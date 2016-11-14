/*
HYPERTOPIC - Infrastructure for community-driven knowledge organization systems

OFFICIAL WEB SITE
http://www.hypertopic.org/

Copyright (C) 2011-2012 Aurelien Benel.

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

import java.util.*;
import org.json.*;
import org.junit.*;
import static org.junit.Assert.*;

public class DistributedHypertopicMapTest {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

private HypertopicMap distributedMap = new HypertopicMap(
	"http://127.0.0.1:8080/",
	"http://127.0.0.1:5984/argos/_design/argos/_rewrite/"
);

private HypertopicMap distributedMap2 = new HypertopicMap(
	"http://127.0.0.1:5984/argos/_design/argos/_rewrite/",
  "http://127.0.0.1/~benel/steatite/"
);

@Test public void listTextCorpora() throws Exception {
	Collection<JSONObject> c = this.distributedMap
		.getUser("cecile@hypertopic.org").listCorpora();
	assertEquals(1, c.size());
}

@Test public void listPictureCorpora() throws Exception {
	Collection<JSONObject> c2 = this.distributedMap2
		.getUser("cecile@hypertopic.org").listCorpora();
	assertTrue(c2.size()>0);
}

@Test public void getCorpusItems() throws Exception {
	Collection<HypertopicMap.Corpus.Item> items = 
		this.distributedMap.getCorpus("MISS").getItems();
	assertFalse(items.isEmpty());
}

@Test public void listViewpoints() throws Exception {
	Collection<JSONObject> c = this.distributedMap
		.getUser("nadia@hypertopic.org").listViewpoints();
	assertFalse(c.isEmpty());
}

@Test public void getTopicHighlights() throws Exception {
	Collection<HypertopicMap.Corpus.Item.Highlight> h = this.distributedMap
		.getViewpoint("446d798e240d4dee5a552b902ae56c8d")
		.getTopic("70551d9a197a874cb76372c789be629e")
		.getHighlights();
	assertFalse(h.isEmpty());
}

@Test public void getViewpointTopics() throws Exception {
	Collection<HypertopicMap.Viewpoint.Topic> t = this.distributedMap
		.getViewpoint("446d798e240d4dee5a552b902ae56c8d")
		.getTopics();
	assertFalse(t.isEmpty());
}

//TODO test getTopicItems on Steatite+Argos

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< DistributedHypertopicMapTest

