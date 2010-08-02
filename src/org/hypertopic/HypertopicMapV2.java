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
import java.util.*;

/**
 * v2 implementation of the Hypertopic client API
 * TODO extends HypertopicMap
 */
public class HypertopicMapV2 {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

private RESTDatabase db;

/**
 * @param baseURL The database URL (with a trailing slash).
 */
public HypertopicMapV2(String baseUrl) {
	this.db = new RESTDatabase(baseUrl);
}

/**
 * Inverse function of JSONObject.append
 */
protected void remove(JSONObject object, String key, String value) 
	throws JSONException
{
	JSONArray array = object.getJSONArray(key);
	int i = 0;
	boolean found = false;
	while (i<array.length() && !found) {
		found = value.equals(array.getString(i));
		i++;
	}
	if (found) array.remove(i-1); 
	if (array.length()==0) {
		object.remove(key);
	} else {
		object.put(key, array);
	}
}

public JSONObject get(String objectID) throws Exception {
	return this.db.get(objectID);
}

//========================================================= CORPUS OR VIEWPOINT

public void register(String objectID, String actor) throws Exception {
	this.db.put(
		this.db.get(objectID).append("actors", actor)
	);
}

public void unregister(String objectID, String actor) throws Exception {
	JSONObject object = this.db.get(objectID);
	remove(object, "actors", actor);
	this.db.put(object);
}

//====================================================================== CORPUS

/**
 * @param actor e.g. "cecile@hypertopic.org"
 */
public JSONObject listCorpora(String actor) throws Exception {
	return this.db.get("corpus/?actor=" + actor);
}

/**
 * @return corpusID
 */
public String createCorpus(String name, String actor) throws Exception {
	return this.db.post(
		new JSONObject()
		.put("corpus_name", name)
		.append("actors", actor)
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
	Set<String> documents = new HashSet<String>();
	JSONArray rows = this.db.get("item/?corpus=" + corpusID)
		.getJSONArray("rows");
	for (int i=0; i<rows.length(); i++) {
		documents.add(
			rows.getJSONObject(i).getJSONArray("key").getString(1)
		);
	}
	for (String documentID : documents) {
		this.db.delete(
			//TODO could be avoided if _rev was in "item/" result
			this.db.get(documentID) 
		);
	}
}


//======================================================================== ITEM

/**
 * @param corpus e.g. "MISS"
 * @param item e.g. null, or "d0" to get only an item and its fragments
 */
public JSONObject getItems(String corpus, String itemID) throws Exception {
	return this.db.get(
		"item/?corpus=" + corpus 
		+ ((itemID != null) ? "&item=" + itemID : "")
	);
}
// --> getItems(topic)
// --> getItemsRecursively(topic)

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
	topics.append(viewpointID, topicID);
	this.db.put(item);
}

public void untagItem(String itemID, String viewpointID, String topicID) 
	throws Exception 
{
	JSONObject item = this.db.get(itemID);
	JSONObject topics = item.getJSONObject("topics");
	remove(topics, viewpointID, topicID);
	this.db.put(item);
}

public void tagFragment(
	String itemID, String coordinates, String text, 
	String viewpointID, String topicID
) throws Exception {
	JSONObject item = this.db.get(itemID);
	JSONObject fragments = item.optJSONObject("fragments");
	if (fragments==null) {
		fragments = new JSONObject();
		item.put("fragments", fragments);
	}
	JSONObject f = fragments.optJSONObject(coordinates);
	if (f==null) {
		f = new JSONObject().put("text", text);
		fragments.put(coordinates, f);
	}
	JSONObject topics = f.optJSONObject("topics");
	if (topics==null) {
		topics = new JSONObject();
		f.put("topics", topics);
	}
	topics.append(viewpointID, topicID);
	this.db.put(item);
}


public void untagFragment(
	String itemID, String coordinates, String viewpointID, String topicID
) throws Exception {
	JSONObject item = this.db.get(itemID);
	JSONObject topics = item.getJSONObject("fragments")
		.getJSONObject(coordinates)
		.getJSONObject("topics");
	remove(topics, viewpointID, topicID);
	this.db.put(item);
}

//=================================================================== VIEWPOINT

/**
 * @param actor e.g. "cecile@hypertopic.org"
 */
public JSONObject getViewpoints(String actor) throws Exception {
	return this.db.get("viewpoint/?actor=" + actor);
}

public String createViewpoint(String name, String actor) throws Exception {
	return this.db.post(
		new JSONObject()
		.put("viewpoint_name", name)
		.append("actors", actor)
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
 * @param viewpoint e.g. "01"
 */
public JSONObject getTopics(String viewpoint) throws Exception {
	return this.db.get("topic/?viewpoint=" + viewpoint);
}

/*
getUpperTopics(viewpoint)
getBroaderTopics(topic)
getNarrowerTopics(topic)
getNarrowerTopicsRecursively(topic) //used by getItemsRecusively and for acyclicity tests
*/

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
	return this.db.get("resource/?resource=" + resource);
}


}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< HypertopicMapV2
