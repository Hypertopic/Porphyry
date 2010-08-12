/*
HYPERTOPIC - Infrastructure for community-driven knowledge organization systems

OFFICIAL WEB SITE
http://www.hypertopic.org/

Copyright (C) 2010 Aurelien Benel.

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
public class RESTDatabase extends Observable {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

private String baseUrl;
private Map<URL,JSONObject> cache = new HashMap<URL,JSONObject>();

/**
 * @param baseURL The database URL (with a trailing slash).
 */
public RESTDatabase(String baseUrl) {
	this.baseUrl = baseUrl;
}

/**
 * @param object The object to create on the server.
 * It is updated with an _id 
 * (and a _rev if the server features conflict management).
 */
public JSONObject post(JSONObject object) throws Exception {
	JSONObject body = new JSONObject(
		send("POST", new URL(this.baseUrl), object)
	);
	object.put("_id", body.getString("id"));
	if (body.has("rev")) {
		object.put("_rev", body.getString("rev"));
	}
	return object;
}

/**
 * @return the existing value, or a new empty one
 */
protected static JSONObject getOrCreate(JSONObject object, String key) {
	JSONObject o = object.optJSONObject(key);
	if (o == null) {
		o = new JSONObject();
		try {
			object.put(key, o);
		} catch (Exception e) {
			e.printStackTrace(); // Should never go there
		}
	}
	return o;
}

/**
 * Notice: In-memory parser not suited to long payload.
 * @param query the path to get the view from the baseURL 
 * @return if the queried object was like
 * {rows:[ {key:[key0, key1], value:{attribute0:value0}},
 * {key:[key0, key1], value:{attribute0:value1}}]}
 * then the returned object is
 * {key0:{key1:{attribute0:[value0, value1...]}}}
 * otherwise the original object is returned.
 */
public synchronized JSONObject get(String query) throws Exception {
	URL url = new URL(this.baseUrl + query);
	JSONObject result = this.cache.get(url);
	if (result == null) {
		result = new JSONObject(send("GET", url, null));
		if (result.has("rows")) {
			JSONArray rows = result.getJSONArray("rows");
			result = new JSONObject();
			for (int i=0; i<rows.length(); i++) {
				JSONObject r = rows.getJSONObject(i);
				JSONArray keys = r.getJSONArray("key");
				JSONObject current = result;
				for (int k=0; k<keys.length(); k++) {
					current = getOrCreate(
						current, keys.getString(k)
					);
				} 
				JSONObject value = r.getJSONObject("value");
				Iterator<String> v = value.keys();
				while (v.hasNext()) {
					String attribute = v.next();
					current.append(
						attribute,
						value.get(attribute)
					);
				}
			} 
			this.cache.put(url, result);
		} 
	}
	return result;
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
			new URL(this.baseUrl + object.getString("_id")), 
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
		new URL(
			this.baseUrl + object.getString("_id") 
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
	if (object != null) this.writeBody(connection, object);
	String result = this.readBody(connection);
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

public void startListening() {
	SwingWorker w = new SwingWorker() {
		protected Object doInBackground() {
			RESTDatabase.this.listen();
			return null;
		}
	};
	w.execute();
}

protected void listen() {
	try {
		int last = this.get("_changes").getInt("last_seq");
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
		while (line!=null) {
			this.cache.clear();
			this.setChanged();
			this.notifyObservers();
			line = reader.readLine();
		}
	} catch (Exception e) {
		System.err.println("GET _changes " + e);
	}
	this.listen(); //Show must go on...
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< RESTDatabase

