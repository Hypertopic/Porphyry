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
import java.net.*;

/**
 * v2 implementation of the Hypertopic client API.
 * This is a 'lazy' object mapping: only IDs are stored,
 * other data are retrieved on demand.
 * To improve client cache efficiency,
 * topic views are based on viewpoint views;
 * and item views are based on corpus views.
 */
public class HypertopicMap extends Observable implements Observer {//>>>>>>>>>>>

private final RESTDatabase db;

/**
 * @param baseURL The database URL (with a trailing slash).
 */
public HypertopicMap(String baseUrl) {
	this.db = new RESTDatabase(baseUrl);
	this.db.addObserver(this);
	this.db.startListening();
}

public void update(Observable o, Object arg) {
	this.setChanged();
	this.notifyObservers();
}

//TODO it is not clear if memory footprint would be reduced or increased by
//using a cache on getUSer, getViewpoint, getCorpus, getTopic, getItem
//as that would mean less invocations but also less garbage collecting.
public User getUser(String userID) {
	return new User(userID);
}

public Viewpoint getViewpoint(String viewpointID) {
	return new Viewpoint(viewpointID);
}

public Corpus getCorpus(String corpusID) {
	return new Corpus(corpusID);
}

/**
 * @param resource e.g. "http://cassandre/text/d0"
 */
public Corpus.Item getItem(String resource) throws Exception {
	JSONObject item = this.db.get(
		"resource/" + URLEncoder.encode(resource, "ASCII")
	).getJSONObject(resource).getJSONObject("item");
	return this.getItem(item);
}

protected Viewpoint.Topic getTopic(JSONObject topic) throws Exception {
	return this.getViewpoint(topic.getString("viewpoint"))
		.getTopic(topic);
}

protected Corpus.Item getItem(JSONObject item) throws Exception {
	return this.getCorpus(item.getString("corpus"))
		.getItem(item.getString("id"));
}

protected Corpus.Item.Highlight getHighlight(JSONObject highlight)
	throws Exception
{
	return this.getCorpus(highlight.getString("corpus"))
		.getItem(highlight.getString("item"))
		.getHighlight(highlight.getString("id"));
}

protected static boolean isReserved(String key) {
	return "highlight".equals(key)
		|| "name".equals(key)
		|| "resource".equals(key)
		|| "thumbnail".equals(key)
		|| "topic".equals(key)
		|| "upper".equals(key)
		|| "user".equals(key);
}

public abstract class Identified {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

private final String id;

protected Identified(String id) {
	this.id = id;
}

public String getID() {
	return this.id;
}

protected abstract JSONObject getView() throws Exception;

@Override public boolean equals(Object that) {
	return that instanceof Identified
		&& this.id.equals(((Identified)that).id);
}

@Override public int hashCode() {
	return this.id.hashCode();
}

@Override public String toString() {
	try {
		return this.getView().toString(2);
	} catch (Exception e) {
		return "ERROR at HypertopicMap.Named.toString()";
	}
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Identified

public abstract class Named extends Identified {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

public Named(String id) {
	super(id);
}

public String getName() throws Exception {
	return this.getView().getString("name");
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Named

public abstract class Located extends Named {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

public Located(String id) {
	super(id);
}

protected JSONObject getRaw() throws Exception {
	return HypertopicMap.this.db.get(this.getID());
}

public void destroy() throws Exception {
	HypertopicMap.this.db.delete(this.getRaw());
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Located

public abstract class Registered extends Located {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>

public Registered(String id) {
	super(id);
}

public void register(User user) throws Exception {
	HypertopicMap.this.db.put(
		this.getRaw().append("users", user.getID())
	);
}

public void unregister(User user) throws Exception {
	JSONObject registered = this.getRaw();
	registered.getJSONArray("users").remove(user.getID());
	HypertopicMap.this.db.put(registered);
}

public Collection<String> listUsers() throws Exception {
	return (Collection<String>) this.getView().getJSONArrayOrCreate("user")
		.toCollection();
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Registered

public class User extends Identified {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

public User(String id) {
	super(id);
}

@Override protected JSONObject getView() throws Exception {
	return HypertopicMap.this.db.get("user/" + this.getID())
		.getJSONObject(this.getID());
}

/**
 * @return a collection of IDs and names pairs... fast!
 * Can be empty.
 */
public Collection<JSONObject> listCorpora() throws Exception {
	try {
		return this.getView().getAllJSONObjects("corpus");
	} catch (JSONException e) {
		return new ArrayList();
	}
}

/**
 * @return a collection of IDs and names pairs... fast!
 * Can be empty.
 */
public Collection<JSONObject> listViewpoints() throws Exception {
	try {
		return this.getView().getAllJSONObjects("viewpoint");
	} catch (JSONException e) {
		return new ArrayList();
	}
}

public Corpus createCorpus(String name) throws Exception {
	return HypertopicMap.this.getCorpus(
		HypertopicMap.this.db.post(
			new JSONObject()
				.put("corpus_name", name)
				.append("users", this.getID())
		).getString("_id")
	);
}

public Viewpoint createViewpoint(String name) throws Exception {
	return HypertopicMap.this.getViewpoint(
		HypertopicMap.this.db.post(
			new JSONObject()
				.put("viewpoint_name", name)
				.append("users", this.getID())
		).getString("_id")
	);
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< User

public class Corpus extends Registered {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

public Corpus(String id) {
	super(id);
}

/**
 * @return whole items contained in the corpus
 */
public Collection<Item> getItems() throws Exception {
	Collection<Item> result = new ArrayList<Item>();
	JSONObject view = this.getView();
	if (view!=null) {
		Iterator<String> i = view.keys();
		while (i.hasNext()) {
			String key = i.next();
			if (!isReserved(key)) {
				result.add(this.getItem(key));
			}
		}
	}
	return result;
}

@Override protected JSONObject getView() throws Exception {
	return HypertopicMap.this.db.get("corpus/" + this.getID())
		.optJSONObject(this.getID());
}

public void rename(String name) throws Exception {
	HypertopicMap.this.db.put(
		this.getRaw().put("corpus_name", name)
	);
}

/**
 * Destroy the nodes of the corpus and of all its documents.
 */
public void destroy() throws Exception {
	super.destroy();
	for (Item item : this.getItems()) {
		item.destroy();
	}
}

public Item createItem(String name) throws Exception {
	return this.getItem(
		HypertopicMap.this.db.post(
			new JSONObject()
				.put("item_name", name)
				.put("item_corpus", this.getID())
		).getString("_id")
	);
}

public Item getItem(String itemID) {
	return new Item(itemID);
}

public class Item extends Located {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

public Item(String id) {
	super(id);
}

public Corpus getCorpus() {
	return Corpus.this;
}

public URL getResource() throws Exception {
	return new URL(this.getView().getString("resource"));
}

public URL getThumbnail() throws Exception {
	return new URL(this.getView().getString("thumbnail"));
}

public Collection<Viewpoint.Topic> getTopics() throws Exception {
	Collection<Viewpoint.Topic> result = new ArrayList<Viewpoint.Topic>();
	JSONArray array = this.getView().getJSONArray("topic");
	for (int i=0; i<array.length(); i++) {
		JSONObject topic = array.getJSONObject(i);
		result.add(
			HypertopicMap.this.getTopic(topic)
		);
	}
	return result;
}

public JSONObject getAttributes() throws Exception {
	JSONObject result = new JSONObject();
	JSONObject item = this.getView();
	Iterator<String> i = item.keys();
	while (i.hasNext()) {
		String key = i.next();
		if (!isReserved(key)) {
			Object value = item.get(key);
			if (!(value instanceof JSONObject)) {
				result.put(key, value);
			}
		}
	}
	return result;
}

@Override protected JSONObject getView() throws Exception {
	return Corpus.this.getView()
		.getJSONObject(this.getID());
}

public void rename(String name) throws Exception {
	JSONObject item = this.getRaw();
	item.put("item_name", name);
	HypertopicMap.this.db.put(item);
}

public void setResource(String url) throws Exception {
	JSONObject item = this.getRaw();
	item.put("resource", url);
	HypertopicMap.this.db.put(item);
}

public void describe(String attribute, String value) throws Exception {
	JSONObject item = this.getRaw();
	item.accumulate(attribute, value);
	HypertopicMap.this.db.put(item);
}

public void undescribe(String attribute, String value) throws Exception {
	JSONObject item = this.getRaw();
	item.remove(attribute, value);
	HypertopicMap.this.db.put(item);
}

public void tag(Viewpoint.Topic topic) throws Exception {
	JSONObject item = this.getRaw();
	JSONObject topics = item.getJSONObjectOrCreate("topics");
	topics.put(
		topic.getID(),
		new JSONObject().put("viewpoint", topic.getViewpoint().getID())
	);
	HypertopicMap.this.db.put(item);
}

public void untag(Viewpoint.Topic topic) throws Exception {
	JSONObject item = this.getRaw();
	item.getJSONObject("topics").remove(topic.getID());
	HypertopicMap.this.db.put(item);
}

//TODO itemID replaced by a corpusID in Cassandre!!!
public Highlight createHighlight(
	Viewpoint.Topic topic, String text, int... coordinates
) throws Exception {
	JSONObject item = this.getRaw();
	JSONObject highlights = item.getJSONObjectOrCreate("highlights");
	String id = UUID.randomUUID().toString();
	highlights.put(
		id,
		new JSONObject()
			.put("coordinates", coordinates)
			.put("text", text)
			.put("viewpoint", topic.getViewpoint().getID())
			.put("topic", topic.getID())
	);
	HypertopicMap.this.db.put(item);
	return this.getHighlight(id);
}

public Collection<Highlight> getHighlights() throws Exception{
	Collection<Highlight> result = new ArrayList<Highlight>();
	JSONObject view = this.getView();
	Iterator<String> i = view.keys();
	while (i.hasNext()) {
		String key = i.next();
		if (!isReserved(key) && view.get(key) instanceof JSONObject) {
			result.add(this.getHighlight(key));
		}
	}
	return result;
}

public Highlight getHighlight(String highlightID) {
	return new Highlight(highlightID);
}

public class Highlight extends Identified {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

public Highlight(String id) {
	super(id);
}

public Item getItem() {
	return Item.this;
}

public Corpus getCorpus() {
	return Corpus.this;
}

public Viewpoint.Topic getTopic() throws Exception {
	return HypertopicMap.this.getTopic(
		this.getView().getJSONObject("topic")
	);
}

public Collection<String> getText() throws Exception {
	return this.getView().getAllStrings("text");
}

public URL getThumbnail() throws Exception {
	return new URL(this.getView().getString("thumbnail"));
}

//TODO change return type?
public JSONArray getCoordinates() throws Exception {
	return this.getView().getJSONArray("coordinates");
}

@Override protected JSONObject getView() throws Exception {
	return Item.this.getView().getJSONObject(this.getID());
}

public void destroy() throws Exception {
	JSONObject item = Item.this.getRaw(); //WHAT TODO with Cassandre???
	item.getJSONObject("highlights").remove(this.getID());
	HypertopicMap.this.db.put(item);
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Highlight

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Item

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Corpus

public class Viewpoint extends Registered {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

public Viewpoint(String id) {
	super(id);
}

public Collection<Topic> getUpperTopics() throws Exception {
	Collection<Topic> result = new ArrayList<Topic>();
	for (JSONObject t: this.getView().getAllJSONObjects("upper")) {
		result.add(this.getTopic(t));
	}
	return result;
}

public Collection<Topic> getTopics() throws Exception {
	Collection<Topic> result = new ArrayList<Topic>();
	Iterator<String> i = this.getView().keys();
	while (i.hasNext()) {
		String key = i.next();
		if (!isReserved(key)) {
			result.add(
				this.getTopic(key)
			);
		}
	}
	return result;
}

@Override protected JSONObject getView() throws Exception {
	return HypertopicMap.this.db.get("viewpoint/" + this.getID())
		.getJSONObject(this.getID());
}

public Collection<Corpus.Item> getItems() throws Exception {
	Collection<Corpus.Item> result = new HashSet<Corpus.Item>();
	for (Topic t : this.getTopics()) {
		result.addAll(t.getItems());
	}
	return result;
}

public Collection<Corpus.Item.Highlight> getHighlights() throws Exception {
	Collection<Corpus.Item.Highlight> result =
		new HashSet<Corpus.Item.Highlight>();
	for (Topic t : this.getTopics()) {
		result.addAll(t.getHighlights());
	}
	return result;
}

public void rename(String name) throws Exception {
	JSONObject viewpoint = this.getRaw();
	viewpoint.put("viewpoint_name", name);
	HypertopicMap.this.db.put(viewpoint);
}

/**
 * @param topicsIDs empty to create an upper topic
 */
public Topic createTopic(Topic... broaderTopics) throws Exception {
	String topicID = UUID.randomUUID().toString();
	JSONObject viewpoint = this.getRaw();
	JSONArray broader = new JSONArray();
	for (Topic t : broaderTopics) {
		broader.put(t.getID());
	}
	viewpoint.getJSONObjectOrCreate("topics").put(
		topicID,
		new JSONObject().put("broader", broader)
	);
	HypertopicMap.this.db.put(viewpoint);
	return this.getTopic(topicID);
}

public Topic getTopic(String topicID) {
	return new Topic(topicID);
}

public Topic getTopic(JSONObject topic) throws Exception {
	return this.getTopic(topic.getString("id"));
}

public class Topic extends Named {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

public Topic(String id) {
	super(id);
}

protected Viewpoint getViewpoint() {
	return Viewpoint.this;
}

public Collection<Topic> getNarrower() throws Exception {
	Collection<Topic> result = new ArrayList<Topic>();
	for (JSONObject narrower:this.getView().getAllJSONObjects("narrower")) {
		result.add(Viewpoint.this.getTopic(narrower));
	}
	return result;
}

public Collection<Topic> getBroader() throws Exception {
	Collection<Topic> result = new ArrayList<Topic>();
	for (JSONObject broader : this.getView().getAllJSONObjects("broader")) {
		result.add(Viewpoint.this.getTopic(broader));
	}
	return result;
}

/**
 * Recursive. Could be optimized with a cache.
 * Precondition: narrower topics graph must be acyclic.
 */
public Collection<Corpus.Item> getItems() throws Exception {
	try {
		Collection<Corpus.Item> result = new HashSet<Corpus.Item>();
		JSONObject topic = this.getView();
		for (JSONObject item : topic.getAllJSONObjects("item")) {
			result.add(
				HypertopicMap.this.getItem(item)
			);
		}
		for (JSONObject narrower: topic.getAllJSONObjects("narrower")) {
			result.addAll(
				Viewpoint.this.getTopic(narrower)
					.getItems()
			);
		}
		return result;
	} catch (JSONException e) {
		return new ArrayList();
	}
}

/**
 * Recursive. Could be optimized with a cache.
 * Precondition: narrower topics graph must be acyclic.
 */
public Collection<Corpus.Item.Highlight> getHighlights() throws Exception {
	try {
		Collection<Corpus.Item.Highlight> result =
			new HashSet<Corpus.Item.Highlight>();
		JSONObject topic = this.getView();
		for (JSONObject highlight: topic.getAllJSONObjects("highlight")) {
			result.add(
				HypertopicMap.this.getHighlight(highlight)
			);
		}
		for (JSONObject narrower: topic.getAllJSONObjects("narrower")) {
			result.addAll(
				Viewpoint.this.getTopic(narrower)
					.getHighlights()
			);
		}
		return result;
	} catch (JSONException e) {
		return new ArrayList();
	}
}

/**
 * @return an object with broader, narrower and name
 */
@Override protected JSONObject getView() throws Exception {
	return Viewpoint.this.getView()
		.getJSONObject(this.getID());
}

public void rename(String name) throws Exception {
	JSONObject viewpoint = Viewpoint.this.getRaw();
	viewpoint.getJSONObject("topics")
		.getJSONObject(this.getID())
		.put("name", name);
	HypertopicMap.this.db.put(viewpoint);
}

public void destroy() throws Exception {
	JSONObject viewpoint = Viewpoint.this.getRaw();
	JSONObject topics = viewpoint.getJSONObject("topics");
	topics.remove(this.getID());
	Iterator<String> t = topics.keys();
	while (t.hasNext()) {
		topics.getJSONObject(t.next())
			.getJSONArray("broader").remove(this.getID());
	}
	HypertopicMap.this.db.put(viewpoint);
}

/**
 * @param narrowerTopics the topics to unlink from their parents and to link to
 * this object
 */
public void moveTopics(Topic... narrowerTopics) throws Exception {
	JSONArray broader = new JSONArray();
	broader.put(this.getID());
	JSONObject viewpoint = Viewpoint.this.getRaw();
	JSONObject topics = viewpoint.getJSONObject("topics");
	for (Topic t : narrowerTopics) {
		topics.getJSONObject(t.getID()).put("broader", broader);
	}
	HypertopicMap.this.db.put(viewpoint);
}

/**
 * Unlink from broader topics
 */
public void unlink() throws Exception {
	JSONObject viewpoint = Viewpoint.this.getRaw();
	viewpoint.getJSONObject("topics")
		.getJSONObject(this.getID())
		.put("broader", new JSONArray());
	HypertopicMap.this.db.put(viewpoint);
}

public void linkTopics(Topic... narrowerTopics) throws Exception {
	JSONObject viewpoint = Viewpoint.this.getRaw();
	JSONObject topics = viewpoint.getJSONObject("topics");
	for (Topic t : narrowerTopics) {
		topics.getJSONObject(t.getID()).append("broader", this.getID());
	}
	HypertopicMap.this.db.put(viewpoint);
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Topic

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Viewpoint

@Override public String toString() {
	return this.db.toString();
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< HypertopicMap
