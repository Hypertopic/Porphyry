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
import org.junit.*;
import static org.junit.Assert.*;
import java.util.*;

public class HypertopicMapTest {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

private HypertopicMap map = 
	new HypertopicMap("http://127.0.0.1:5984/test/_design/argos/_rewrite/");
private HypertopicMap.User user;
private HypertopicMap.Corpus corpus;
private HypertopicMap.Corpus.Item item;
private HypertopicMap.Viewpoint viewpoint;
private HypertopicMap.Viewpoint.Topic topic;
private HypertopicMap.Viewpoint.Topic childTopic;
private HypertopicMap.Viewpoint.Topic otherTopic;

@Before public void setUp() throws Exception {
	this.user = this.map.getUser("me");
	this.corpus = this.user.createCorpus("my corpus");
	this.item = this.corpus.createItem("my item");
	this.viewpoint = this.user.createViewpoint("my viewpoint");
	this.topic = this.viewpoint.createTopic();
	this.childTopic = this.viewpoint.createTopic(this.topic);
	this.otherTopic = this.viewpoint.createTopic();
}

@Test public void register() throws Exception {
	this.corpus.register(this.map.getUser("him"));
	JSONArray array = this.corpus.listUsers();
	assertTrue(array.length()==2);
}

@Test public void unregister() throws Exception {
	this.corpus.register(this.map.getUser("him"));
	this.corpus.unregister(this.user);
	assertTrue(this.corpus.listUsers().length()==1);
}

@Test public void renameCorpus() throws Exception {
	this.corpus.rename("new name");
	assertEquals("new name", this.corpus.getName());
}

@Test public void destroyCorpus() throws Exception {
	this.corpus.destroy();
}

@Test public void destroyItem() throws Exception {
	this.item.destroy();
}

@Test public void describeItem() throws Exception {
	this.item.describe("foo", "bar");
}

@Test public void undescribeItem() throws Exception {
	this.item.describe("foo", "bar");
	this.item.undescribe("foo", "bar");
}

@Test public void tagItem() throws Exception {
	this.item.tagItem(this.topic);
}

@Test public void untagItem() throws Exception {
	this.item.tagItem(this.topic);
	this.item.untagItem(this.topic);
}

@Test public void createHighlight() throws Exception {
	this.item.createHighlight(this.topic, "FOO", 1024, 1096); 
}

@Test public void destroyHighlight() throws Exception {
	this.item.createHighlight(this.topic, "FOO", 1024, 1096)
		.destroy(); 
}

@Test public void destroyViewpoint() throws Exception {
	this.viewpoint.destroy();
}

@Test public void renameTopic() throws Exception {
	this.topic.rename("a topic");
}

@Test public void destroyTopic() throws Exception {
	this.topic.destroy();
}

@Test public void moveTopics() throws Exception {
	this.otherTopic.moveTopics(this.childTopic); 
}

@Test public void linkTopics() throws Exception {
	this.otherTopic.linkTopics(this.childTopic); 
}

@Test public void getUpperTopics() throws Exception {
	assertTrue(this.viewpoint.getUpperTopics().size()==2);
}

@Test public void getNarrower() throws Exception {
	Collection<HypertopicMap.Viewpoint.Topic> narrower = 
		this.topic.getNarrower();
	assertTrue(narrower.contains(this.childTopic));
	assertTrue(narrower.size()==1);
}

@Test public void listCorpora() throws Exception {
	assertTrue(this.user.listCorpora().length()>0);
}

@Test public void listViewpoints() throws Exception {
	assertTrue(this.user.listViewpoints().length()>0);
}

@Test public void getCorpusItems() throws Exception {
	assertTrue(this.corpus.getItems().size()==1);
}

@Test public void getItemName() throws Exception {
	assertEquals("my item", this.item.getName());
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< HypertopicMapTest

