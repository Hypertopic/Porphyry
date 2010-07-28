/*
HYPERTOPIC - Infrastructure for community-driven knowledge organization systems

OFFICIAL WEB SITE
http://www.hypertopic.org/

Copyright (C) 2010 Aurelien Benel.

LEGAL ISSUES
This program is free software; you can redistribute it and/or modify it under
the terms of the GNU General Public License (version 3) as published by the
Free Software Foundation.
This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details:
http://www.gnu.org/licenses/gpl.html
*/

package org.hypertopic;

import org.json.*;
import java.net.*;
import java.util.*;
import java.io.*;
import javax.xml.ws.http.HTTPException;

/**
 * Client library for a REST database a la CouchDB.
 * The emphasis is put on improving read performance (cached bulk GET).
 * Design pattern: Data Access Object. 
 * TODO cache update on _changes
 */
public class RESTDatabase {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

private String baseUrl;
private Map<URL,JSONObject> cache = new HashMap<URL,JSONObject>();

/**
 * @param baseURL The database URL (with an trailing slash).
 */
public RESTDatabase(String baseUrl) {
	this.baseUrl = baseUrl;
}

/**
 * @param object The object to create on the server.
 * It is updated with an _id 
 * (and a _rev if the server features conflict management).
 */
public void post(JSONObject object) throws Exception {
	JSONObject body = new JSONObject(
		send("POST", new URL(this.baseUrl), object)
	);
	object.put("_id", body.getString("id"));
	if (body.has("rev")) {
		object.put("_rev", body.getString("rev"));
	}
}

/**
 * TODO ask for a key?
 * Notice: In-memory parser not suited to long payload.
 * @param query the path to get the view from the baseURL 
 * @return the object or the object list that was read on the server
 */
public JSONObject get(String query) throws Exception {
	URL url = new URL(this.baseUrl + query);
	JSONObject result = this.cache.get(url);
	if (result == null) {
		result = new JSONObject(send("GET", url, null));
		this.cache.put(url, result);
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
	System.err.print(method + ' ' + service + ' ' + object + ' '); //DEBUG
	HttpURLConnection connection =  
		(HttpURLConnection) service.openConnection();
	connection.setRequestMethod(method);
	if (object != null) this.writeBody(connection, object);
	String result = this.readBody(connection);
	this.checkError(connection);
	return result;
}

protected void writeBody(HttpURLConnection connection, JSONObject object) 
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
protected String readBody(HttpURLConnection connection) throws Exception {
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


protected void checkError(HttpURLConnection connection) throws Exception {
	connection.disconnect();
	int code = connection.getResponseCode();
	System.err.println(code); //DEBUG
	if (code/100 != 2) throw new HTTPException(code);
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< RESTDatabase

