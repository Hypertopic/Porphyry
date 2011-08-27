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
import java.net.URL;

public class HypertopicMapTest {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

private HypertopicMap map = 
	new HypertopicMap("http://127.0.0.1:5984/test/_design/argos/_rewrite/");
private HypertopicMap.User user;
private HypertopicMap.Corpus corpus;
private HypertopicMap.Corpus.Item item;
private HypertopicMap.Corpus.Item.Highlight highlight;
private HypertopicMap.Viewpoint viewpoint;
private HypertopicMap.Viewpoint.Topic topic;
private HypertopicMap.Viewpoint.Topic childTopic;
private HypertopicMap.Viewpoint.Topic otherTopic;

@Before public void setUp() throws Exception {
	this.user = this.map.getUser("me");
	this.corpus = this.user.createCorpus("my corpus");
	this.item = this.corpus.createItem("my item");
	this.item.setResource("http://acme.com/foo");
	this.item.describe("foo", "bar");
	this.viewpoint = this.user.createViewpoint("my viewpoint");
	this.topic = this.viewpoint.createTopic();
	this.childTopic = this.viewpoint.createTopic(this.topic);
	this.otherTopic = this.viewpoint.createTopic();
	this.highlight = this.item.createHighlight( 
		this.childTopic, "FOO", 1024, 1096
	);
	this.item.tag(this.childTopic);
}

@Test public void register() throws Exception {
	this.corpus.register(this.map.getUser("him"));
	assertEquals(2, this.corpus.listUsers().size());
}

@Test public void unregister() throws Exception {
	this.corpus.unregister(this.user);
	assertEquals(0, this.corpus.listUsers().size());
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

@Test public void undescribe() throws Exception {
	this.item.undescribe("foo", "bar");
	//TODO assert?
}

@Test public void getResource() throws Exception {
	assertEquals(new URL("http://acme.com/foo"), this.item.getResource());
}

@Test public void untag() throws Exception {
	this.item.untag(this.childTopic);
	//TODO assert?
}

@Test public void destroyHighlight() throws Exception {
	this.highlight.destroy(); 
}

@Test public void getItemHighlights() throws Exception {
	assertEquals(1, this.item.getHighlights().size());
}

@Test public void getViewpointHighlights() throws Exception {
	assertEquals(1, this.viewpoint.getHighlights().size());
}

@Test public void getTopicHighlights() throws Exception {
	assertEquals(1, this.topic.getHighlights().size());
}

@Test public void getHighlightText() throws Exception {
	assertTrue(this.highlight.getText().contains("FOO"));
}

@Test public void destroyViewpoint() throws Exception {
	this.viewpoint.destroy();
}

@Test public void getViewpointTopics() throws Exception {
	assertEquals(3, this.viewpoint.getTopics().size());
}

@Test public void renameTopic() throws Exception {
	this.topic.rename("a topic");
	assertEquals("a topic", this.topic.getName());
}

@Test public void getAttributes() throws Exception {
	JSONObject attributes = this.item.getAttributes();
	assertEquals("bar", attributes.getString("foo"));
	assertEquals(1, attributes.length());
}

@Test public void destroyTopic() throws Exception {
	this.topic.destroy();
}

@Test public void moveTopics() throws Exception {
	this.otherTopic.moveTopics(this.childTopic); 
	Collection<HypertopicMap.Viewpoint.Topic> broader = 
		this.childTopic.getBroader();
	assertTrue(broader.contains(this.otherTopic));
	assertEquals(1, broader.size());
}

@Test public void linkTopics() throws Exception {
	this.otherTopic.linkTopics(this.childTopic); 
	Collection<HypertopicMap.Viewpoint.Topic> broader = 
		this.childTopic.getBroader();
	assertTrue(broader.contains(this.otherTopic));
	assertEquals(2, broader.size());
}

@Test public void unlinkTopic() throws Exception {
	this.childTopic.unlink();
	assertEquals(0, this.childTopic.getBroader().size());
}

@Test public void getUpperTopics() throws Exception {
	assertEquals(2, this.viewpoint.getUpperTopics().size());
}

@Test public void getNarrower() throws Exception {
	Collection<HypertopicMap.Viewpoint.Topic> narrower = 
		this.topic.getNarrower();
	assertTrue(narrower.contains(this.childTopic));
	assertEquals(1, narrower.size());
}

@Test public void listCorpora() throws Exception {
	assertTrue(this.user.listCorpora().size()>0);
	assertEquals(0, this.map.getUser("nobody").listCorpora().size());
}

@Test public void listViewpoints() throws Exception {
	assertTrue(this.user.listViewpoints().size()>0);
}

@Test public void getCorpusItems() throws Exception {
	assertEquals(1, this.corpus.getItems().size());
}

@Test public void getViewpointItems() throws Exception {
	assertEquals(1, this.viewpoint.getItems().size());
}

@Test public void getTopicItems() throws Exception {
	assertEquals(1, this.topic.getItems().size());
}

@Test public void getItemName() throws Exception {
	assertEquals("my item", this.item.getName());
}

@Test public void getItemTopics() throws Exception {
	assertEquals(1, this.item.getTopics().size());
}

@Test public void getHighlightTopics() throws Exception {
	assertEquals(this.childTopic, this.highlight.getTopic());
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< HypertopicMapTest

