/*
HYPERTOPIC - Infrastructure for community-driven knowledge organization systems

OFFICIAL WEB SITE
http://www.hypertopic.org/

Copyright (C) 2010-2012 Aurelien Benel.

LEGAL ISSUES
This library is free software; you can redistribute it and/or modify it under
the terms of the GNU Lesser General Public License as published by the Free 
Software Foundation, either version 3 of the license, or (at your option) any
later version.
This library is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details:
http://www.gnu.org/licenses/lgpl.html
*/

package org.hypertopic;

import org.json.*;
import java.net.*;
import java.util.*;
import java.io.*;
import javax.swing.SwingWorker;
import javax.xml.ws.http.HTTPException;

/**
 * Client library for a REST database a la CouchDB.
 * The emphasis is put on improving read performance (cached bulk GET).
 * On _changes, the cache is cleared and the observers are notified.
 * Design pattern: Data Access Object. 
 */
public class RESTDatabase extends Observable {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

private final String baseUrl;
private final Map<URL,JSONObject> cache = new HashMap<URL,JSONObject>();

/**
 * @param baseURL The database URL (with a trailing slash).
 */
public RESTDatabase(String baseUrl) {
	this.baseUrl = baseUrl;
}

public String getURL() {
	return this.baseUrl;
}

public URL getURL(String path) throws Exception {
  URL url = new URL(this.baseUrl + path);
  return new URL(new URI(
    url.getProtocol(), 
    url.getUserInfo(),
    url.getHost(),
    url.getPort(),
    url.getPath(),
    url.getQuery(),
    url.getRef()
  ).toASCIIString());
}

/**
 * @param object The object to create on the server.
 * It is updated with an _id 
 * (and a _rev if the server features conflict management).
 */
public JSONObject post(JSONObject object) throws Exception {
	JSONObject body = new JSONObject(
		send("POST", this.getURL(""), object)
	);
	object.put("_id", body.getString("id"));
	if (body.has("rev")) {
		object.put("_rev", body.getString("rev"));
	}
	return object;
}

/**
 * @param query the path to get the view from the base URL(s)
 * @return {key0:{key1:{attribute0:[value0, value1]}}}
 * for {rows:[ 
 *   {key:[key0, key1], value:{attribute0:value0}},
 *   {key:[key0, key1], value:{attribute0:value1}}
 * ]}
 * Implementation note: Synchronized because it updates cache.
 */
public synchronized JSONObject getAll(String query) throws Exception {
	URL url = this.getURL(query);
	JSONObject result = this.cache.get(url);
	if (result == null) {
    System.out.println("URL: "+ url);
    result = index(new JSONObject(send("GET", url, null)));
    this.cache.put(url, result);
	}
	return new JSONObject(result);
}

/**
 * @return {key0:{key1:{attribute0:[value0, value1]}}}
 * for {rows:[ 
 *   {key:[key0, key1], value:{attribute0:value0}},
 *   {key:[key0, key1], value:{attribute0:value1}}
 * ]}
 */
protected static JSONObject index(JSONObject view) throws Exception {
  JSONObject result = new JSONObject();
  JSONArray rows = view.getJSONArray("rows");
  for (int i=0; i<rows.length(); i++) {
    JSONObject r = rows.getJSONObject(i);
    JSONArray keys = r.getJSONArray("key");
    JSONObject current = result;
    for (int k=0; k<keys.length(); k++) {
      current = current.getJSONObjectOrCreate(
        keys.getString(k)
      );
    } 
    JSONObject value = r.getJSONObject("value");
    Iterator<String> v = value.keys();
    while (v.hasNext()) {
      String attribute = v.next();
      current.justAccumulate(
        attribute,
        value.get(attribute)
      );
    }
  }
  return result;
}

/**
 * @param id the path to get the view from the baseURL 
 * @return the corresponding object
 */
public JSONObject get(String id) throws Exception {
	return new JSONObject(
    send("GET", this.getURL(id), null)
  );
}

/**
 * @param object the object to update on the server 
 * (_id is mandatory, the server may need _rev for conflict management)
 * if the server features conflict management, the object is updated with _rev
 */
public void put(JSONObject object) throws Exception {
	JSONObject body = new JSONObject(
		send(
			"PUT", 
			this.getURL(object.getString("_id")), 
			object
		)
	);
	if (body.has("rev")) {
		object.put("_rev", body.getString("rev"));
	}
}

/**
 * @param object the object to delete on the server 
 * (_id is mandatory, the server may need _rev for conflict management)
 */
public void delete(JSONObject object) throws Exception {
	send(
		"DELETE", 
		this.getURL(
			object.getString("_id") 
			+ (object.has("_rev")
				? "?rev=" + object.getString("_rev")
				: ""
			)
		),
		null
	);
}

/**
 * @param object null if method is GET or DELETE
 * @return response body
 */
protected String send(String method, URL service, JSONObject object) 
	throws Exception
{
//	System.err.print(method + ' ' + service + ' ' + object + ' '); //DEBUG
	HttpURLConnection connection =  
		(HttpURLConnection) service.openConnection();
	connection.setRequestMethod(method);
	connection.setRequestProperty("Content-Type", "application/json");
	connection.setRequestProperty("Accept", "application/json");
	if (object != null) this.writeBody(connection, object);
	String result = this.readBody(connection);
//	System.err.println(result); //DEBUG
	this.checkError(connection);
	return result;
}

protected static void writeBody(
	HttpURLConnection connection, JSONObject object
) 
	throws Exception 
{
	connection.setDoOutput(true);
	OutputStreamWriter writer =
		new OutputStreamWriter(connection.getOutputStream(), "UTF-8");
	object.write(writer);
	writer.close();
}

/**
 * @return response body
 */
protected static String readBody(HttpURLConnection connection) 
	throws Exception 
{
	BufferedReader reader = new BufferedReader(
		new InputStreamReader(
			connection.getInputStream()
		)
	);
	String line = reader.readLine(); 
	StringBuffer result = new StringBuffer();
	while (line != null) {
		result.append(line);
		line = reader.readLine(); 
	}
	return result.toString();
}

protected static void checkError(HttpURLConnection connection) 
	throws Exception 
{
	connection.disconnect();
	int code = connection.getResponseCode();
//	System.err.println(code); //DEBUG
	if (code/100 != 2) throw new HTTPException(code);
}

/**
 * On _changes, the cache is cleared and the observers are notified.
 */
public void startListening() {
  SwingWorker w = new SwingWorker() {
    protected Object doInBackground() {
      boolean retry = true;
      while (retry) {
        try {
          RESTDatabase.this.listen();
        } catch (JSONException e1) {
          System.err.println("WARNING: " + RESTDatabase.this + " " + e1);
          retry = false;
        } catch (Exception e2) {
          System.err.println("WARNING: " + RESTDatabase.this + " " + e2);
          try {
            Thread.sleep(60000);
          } catch (InterruptedException e3) {
            System.err.println(e3); //Should not go there...
          }
        }
      }
      return null;
    }
  };
  w.execute();
}

protected void listen() throws Exception {
  int last = this.get("").getInt("update_seq");
  for (;;) {
    URL service = new URL(
      this.baseUrl + "_changes?feed=continuous&since=" + last
    );
    HttpURLConnection connection =  
      (HttpURLConnection) service.openConnection();
    connection.setRequestMethod("GET");
    BufferedReader reader = new BufferedReader(
      new InputStreamReader(
        connection.getInputStream()
      )
    );
    String line = reader.readLine();
    while (line.startsWith("{\"seq\":")) {
      this.cache.clear();
      this.setChanged();
      this.notifyObservers();
      line = reader.readLine();
    }
    last = new JSONObject(line).getInt("last_seq");
  }
}

@Override public String toString() {
	return this.baseUrl;
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< RESTDatabase

