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

public class HypertopicMapV2Test {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

private HypertopicMapV2 map = 
	new HypertopicMapV2("http://127.0.0.1:5984/test/");

private String corpusID;

private String itemID;

@Before public void createCorpus() throws Exception {
	this.corpusID = this.map.createCorpus("my corpus", "me");
}

@Before public void createItem() throws Exception {
	this.itemID = this.map.createItem("my item", this.corpusID);
}

@Before public void createViewpoint() throws Exception {
	this.itemID = this.map.createViewpoint("my viewpoint", "me");
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

//TODO suite
/*
@Test public void listCorpora() throws Exception {
	JSONArray array = this.db.getCorpora("aurelien.benel@hypertopic.org")
		.getJSONArray("rows");
	array.getJSONObject(0).getJSONObject("value").getString("actor");
	array.getJSONObject(1).getJSONObject("value").getString("name");
	this.corpus = array.getJSONObject(0).getString("key");
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

