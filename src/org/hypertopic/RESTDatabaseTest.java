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
import org.junit.Test;

public class RESTDatabaseTest {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

private RESTDatabase db = new RESTDatabase("http://127.0.0.1:5984/test/");

@Test public void readOnCouch() throws Exception {
	this.db.get("_all_docs?include_docs=true").getInt("total_rows");
}

@Test public void createOnCouch() throws Exception {
	JSONObject o = new JSONObject().put("name", "Bond");
	this.db.post(o);
}

/**
 * Note: success depends on create
 */
@Test public void updateOnCouch() throws Exception {
	JSONObject o = new JSONObject().put("name", "Bond");
	this.db.post(o);
	this.db.put(o.put("name", "James Bond"));
}

/**
 * Note: success depends on create
 */
@Test public void deleteOnCouch() throws Exception {
	JSONObject o = new JSONObject().put("name", "Bond");
	this.db.post(o);
	this.db.delete(o);
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< RESTDatabaseTest

