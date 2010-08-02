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
import org.junit.*;
import static org.junit.Assert.*;
import java.util.ArrayList;

public class HypertopicMapV2Test {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

private HypertopicMapV2 map = 
	new HypertopicMapV2("http://127.0.0.1:5984/test/");

private String corpusID;

private String itemID;

private String viewpointID;

private String topicID;

private String childTopicID;

private String otherTopicID;

@Before public void setUp() throws Exception {
	this.corpusID = this.map.createCorpus("my corpus", "me");
	this.itemID = this.map.createItem("my item", this.corpusID);
	this.viewpointID = this.map.createViewpoint("my viewpoint", "me");
	this.topicID = this.map.createTopicIn(
		this.viewpointID, new ArrayList()
	);
	ArrayList<String> broader = new ArrayList<String>();
	broader.add(this.topicID);
	this.childTopicID = this.map.createTopicIn(this.viewpointID, broader);
	this.otherTopicID = this.map.createTopicIn(
		this.viewpointID, new ArrayList()
	);
}

@Test public void register() throws Exception {
	this.map.register(this.corpusID, "him");
	JSONArray array = this.map.get(this.corpusID).getJSONArray("actors");
	assertTrue(array.length()==2);
}

@Test public void unregister() throws Exception {
	this.map.register(this.corpusID, "him");
	this.map.unregister(this.corpusID, "me");
	JSONArray array = this.map.get(this.corpusID).getJSONArray("actors");
	assertTrue(array.length()==1);
}

@Test public void renameCorpus() throws Exception {
	this.map.renameCorpus(this.corpusID, "new name");
	assertEquals("new name", this.map.get(this.corpusID).getString("corpus_name"));
}

@Test public void destroyCorpus() throws Exception {
	this.map.destroyCorpus(this.corpusID);
}

@Test public void destroyItem() throws Exception {
	this.map.destroyItem(this.itemID);
}

@Test public void describeItem() throws Exception {
	this.map.describeItem(this.itemID, "foo", "bar");
}

@Test public void undescribeItem() throws Exception {
	this.map.describeItem(this.itemID, "foo", "bar");
	this.map.undescribeItem(this.itemID, "foo", "bar");
}

@Test public void tagItem() throws Exception {
	this.map.tagItem(this.itemID, this.viewpointID, this.topicID);
}

@Test public void untagItem() throws Exception {
	this.map.tagItem(this.itemID, this.viewpointID, this.topicID);
	this.map.untagItem(this.itemID, this.viewpointID, this.topicID);
}

@Test public void tagFragment() throws Exception {
	this.map.tagFragment(
		this.itemID, "1024-1096", "", this.viewpointID, this.topicID
	);
}

@Test public void untagFragment() throws Exception {
	this.map.tagFragment(
		this.itemID, "1024-1096", "", this.viewpointID, this.topicID
	);
	this.map.untagFragment(
		this.itemID, "1024-1096", this.viewpointID, this.topicID
	);
}

@Test public void destroyViewpoint() throws Exception {
	this.map.destroyViewpoint(this.viewpointID);
}

@Test public void renameTopic() throws Exception {
	this.map.renameTopic(this.viewpointID, this.topicID, "a topic");
}

@Test public void destroyTopic() throws Exception {
	this.map.destroyTopic(this.viewpointID, this.topicID);
}

@Test public void moveTopicsIn() throws Exception {
	ArrayList<String> broader = new ArrayList<String>();
	broader.add(this.childTopicID); 
	this.map.moveTopicsIn(broader, this.viewpointID, this.otherTopicID);
}

@Test public void linkTopicsIn() throws Exception {
	ArrayList<String> broader = new ArrayList<String>();
	broader.add(this.childTopicID); 
	this.map.linkTopicsIn(broader, this.viewpointID, this.otherTopicID);
}

/*
@Test public void listCorpora() throws Exception {
	JSONArray array = this.db.getCorpora("me") 
		.getJSONArray("rows");
	assertEquals("me", array.getJSONObject(0).getJSONObject("value").getString("actor"));
	assertEquals("my corpus", array.getJSONObject(1).getJSONObject("value").getString("name"));
}

@Test public void loadCorpus() throws Exception {
	JSONArray array = this.db.getItems(this.corpus)
		.getJSONArray("rows");
	JSONObject row0 = 
		array.getJSONObject(0).getJSONObject("value");
	row0.getJSONArray("topic");
	row0.getJSONArray("text");
	array.getJSONObject(1).getJSONObject("value").getJSONArray("resource");
}
*/

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< HypertopicMapV2Test

