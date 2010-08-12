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
import java.util.*;
import java.net.URLEncoder;

/**
 * v2 implementation of the Hypertopic client API
 * TODO extends HypertopicMap
 */
public class HypertopicMapV2 implements Observer {//>>>>>>>>>>>>>>>>>>>>>>>>>>>

private RESTDatabase db;

/**
 * @param baseURL The database URL (with a trailing slash).
 */
public HypertopicMapV2(String baseUrl) {
	this.db = new RESTDatabase(baseUrl);
//	this.db.addObserver(this);
//	this.db.startListening();
}

public void update(Observable o, Object arg) {
//	this.cache.clear();
}

/**
 * @return the index of the first occurrence of the specified value
 * or -1 if the array does not contain the element.
 */
protected static int indexOf(JSONArray array, String value) 
	throws JSONException
{
	int i = 0;
	boolean found = false;
	while (i<array.length() && !found) {
		found = array.getString(i).equals(value);
		i++;
	}
	return (found)?i-1:-1;
}

protected static boolean contains(JSONArray array, String value) 
	throws JSONException
{
	return indexOf(array, value)>-1;
}

/**
 * Inverse function of JSONObject.append
 */
protected static void remove(JSONObject object, String key, String value) 
	throws JSONException
{
	JSONArray array = object.getJSONArray(key);
	int i = indexOf(array, value);
	if (i>-1) array.remove(i); 
	if (array.length()==0) {
		object.remove(key);
	} 
}

public JSONObject get(String objectID) throws Exception {
	return this.db.get(objectID);
}

//========================================================= CORPUS OR VIEWPOINT

public void register(String objectID, String user) throws Exception {
	this.db.put(
		this.db.get(objectID).append("users", user)
	);
}

public void unregister(String objectID, String user) throws Exception {
	JSONObject object = this.db.get(objectID);
	remove(object, "users", user);
	this.db.put(object);
}

//====================================================================== CORPUS

/**
 * @param user e.g. "cecile@hypertopic.org"
 */
public JSONArray listCorpora(String user) throws Exception {
	return this.db.get("user/" + user)
		.getJSONObject(user)
		.optJSONArray("corpus");
}

public JSONObject getCorpus(String corpusID) throws Exception {
	return this.db.get("corpus/" + corpusID)
		.getJSONObject(corpusID);
}

/**
 * @return corpusID
 */
public String createCorpus(String name, String user) throws Exception {
	return this.db.post(
		new JSONObject()
		.put("corpus_name", name)
		.append("users", user)
	).getString("_id");
}

public void renameCorpus(String corpusID, String name) throws Exception {
	this.db.put(
		this.db.get(corpusID).put("corpus_name", name)
	);
}

/** 
 * Destroy the nodes of the corpus and of all its documents.
 */
public void destroyCorpus(String corpusID) throws Exception {
	this.db.delete(
		this.db.get(corpusID)
	);
	for (String documentID : this.listItems(corpusID)) {
		this.db.delete(
			this.db.get(documentID) 
		);
	}
}


//======================================================================== ITEM

public Collection<String> listItems(String corpusID) throws Exception {
	ArrayList<String> items = new ArrayList<String>();
	Iterator<String> i = this.getCorpus(corpusID).keys();
	while (i.hasNext()) {
		String key = i.next();
		if (!"name".equals(key) && !"user".equals(key)) {
			items.add(key);
		}
	}
	return items;
}
 
public JSONObject getItem(String corpusID, String itemID) throws Exception {
	return this.getCorpus(corpusID)
		.getJSONObject(itemID);
}

/**
 * @return itemID
 */
public String createItem(String name, String corpusID) throws Exception {
	return this.db.post(
		new JSONObject()
		.put("item_name", name)
		.put("item_corpus", corpusID)
	).getString("_id");
}

public void destroyItem(String itemID) throws Exception {
	this.db.delete(
		this.db.get(itemID)
	);
}

public void describeItem(String itemID, String attribute, String value) 
	throws Exception
{
	JSONObject item = this.db.get(itemID);
	item.append(attribute, value);
	this.db.put(item);
}

public void undescribeItem(String itemID, String attribute, String value)
	throws Exception
{
	JSONObject item = this.db.get(itemID);
	remove(item, attribute, value);
	this.db.put(item);
}

public void tagItem(String itemID, String viewpointID, String topicID) 
	throws Exception 
{
	JSONObject item = this.db.get(itemID);
	JSONObject topics = item.optJSONObject("topics");
	if (topics==null) {
		topics = new JSONObject();
		item.put("topics", topics);
	}
	topics.append(
		topicID, 
		new JSONObject().put("viewpoint", viewpointID)
	);
	this.db.put(item);
}

public void untagItem(String itemID, String viewpointID, String topicID) 
	throws Exception 
{
	JSONObject item = this.db.get(itemID);
	remove(item, "topics", topicID);
	this.db.put(item);
}

/**
 * @param itemID Note: replaced by a corpusID in Cassandre.
 * @return the ID of the highlight
 */
public String tagFragment(
	String itemID, Collection<Integer> coordinates, String text, 
	String viewpointID, String topicID
) throws Exception {
	JSONObject item = this.db.get(itemID);
	JSONObject highlights = item.optJSONObject("highlights");
	if (highlights==null) {
		highlights = new JSONObject();
		item.put("highlights", highlights);
	}
	String id = UUID.randomUUID().toString();
	highlights.put(
		id,
		new JSONObject()
		.put("coordinates", coordinates)
		.put("text", text)
		.put("viewpoint", viewpointID)
		.put("topic", topicID)
	);
	this.db.put(item);
	return id;
}

/**
 * @param itemID Note: replaced by a corpusID in Cassandre.
 */
public void untagFragment(
	String itemID, String highlightID
) throws Exception {
	JSONObject item = this.db.get(itemID);
	remove(item, "highlights", highlightID);
	this.db.put(item);
}

//=================================================================== VIEWPOINT

/**
 * @param user e.g. "cecile@hypertopic.org"
 */
public JSONArray listViewpoints(String user) throws Exception {
	return this.db.get("user/" + user)
		.getJSONObject(user)
		.optJSONArray("viewpoint");
}

public JSONObject getViewpoint(String viewpointID) throws Exception {
	return this.db.get("viewpoint/" + viewpointID)
		.getJSONObject(viewpointID);
}

public String createViewpoint(String name, String user) throws Exception {
	return this.db.post(
		new JSONObject()
		.put("viewpoint_name", name)
		.append("users", user)
	).getString("_id");
}

public void destroyViewpoint(String viewpointID) throws Exception {
	this.db.delete(
		this.db.get(viewpointID)
	);
}

//TODO importViewpoint(XML, viewpointID?)
//TODO XML exportViewpoint(viewpointID)

//======================================================================= TOPIC

/**
 * @param topicID null for the virtual root
 * @return an object with broader, narrower and name 
 */
public JSONObject getTopic(String viewpointID, String topicID) 
	throws Exception 
{
	return this.getViewpoint(viewpointID)
		.getJSONObject(topicID);
}

/**
 * @param topics can be empty
 * @return topic ID
 */
public String createTopicIn(String viewpointID, Collection<String> topicsIDs) 
	throws Exception 
{
	String topicID = UUID.randomUUID().toString();
	JSONObject viewpoint = this.db.get(viewpointID);
	JSONObject topics = viewpoint.optJSONObject("topics");
	if (topics==null) {
		topics = new JSONObject();
		viewpoint.put("topics", topics);
	}
	topics.put(
		topicID,
		new JSONObject().put("broader", topicsIDs) 
	);
	this.db.put(viewpoint);
	return topicID;
}

public void renameTopic(String viewpointID, String topicID, String name)
	throws Exception 
{
	JSONObject viewpoint = this.db.get(viewpointID);
	viewpoint.getJSONObject("topics")
		.getJSONObject(topicID)
		.put("name", name);
	this.db.put(viewpoint);
}

public void destroyTopic(String viewpointID, String topicID)
	throws Exception 
{
	JSONObject viewpoint = this.db.get(viewpointID);
	JSONObject topics = viewpoint.getJSONObject("topics");
	topics.remove(topicID);
	Iterator<String> t = topics.keys();
	while (t.hasNext()) {
		remove(topics.getJSONObject(t.next()), "broader", topicID);
	}
	this.db.put(viewpoint);
}


/**
 * @param topicID can be empty (to unlik from parents)
 */
public void moveTopicsIn(
	Collection<String> topicsIDs, String viewpointID, String topicID
) 
	throws Exception 
{
	JSONArray broader = new JSONArray();
	if (topicID!=null) {
		broader.put(topicID);
	}
	JSONObject viewpoint = this.db.get(viewpointID);
	JSONObject topics = viewpoint.getJSONObject("topics");
	for (String t : topicsIDs) {
		topics.getJSONObject(t).put("broader", broader); 
	}
	this.db.put(viewpoint);
}

public void linkTopicsIn(
	Collection<String> topicsIDs, String viewpointID, String topicID
) 
	throws Exception 
{
	JSONObject viewpoint = this.db.get(viewpointID);
	JSONObject topics = viewpoint.getJSONObject("topics");
	for (String t : topicsIDs) {
		topics.getJSONObject(t).append("broader", topicID);
	}
	this.db.put(viewpoint);
}

//==================================================================== RESOURCE

/**
 * @param resource e.g. "http://cassandre/text/d0"
 */
public JSONObject getResources(String resource) throws Exception {
	return this.db.get("resource/" + URLEncoder.encode(resource, "ASCII"))
		.getJSONObject(resource);
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< HypertopicMapV2
