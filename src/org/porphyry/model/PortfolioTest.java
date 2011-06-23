/*
PORPHYRY - Digital space for confronting interpretations about documents

OFFICIAL WEB SITE
http://porphyry.sf.net/

Copyright (C) 2011 Aurelien Benel.

LEGAL ISSUES
This program is free software; you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the license, or (at your option) any later 
version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY 
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A 
PARTICULAR PURPOSE. See the GNU General Public License for more details: 
http://www.gnu.org/licenses/gpl.html
*/

package org.porphyry.model;

import org.junit.*;
import static org.junit.Assert.*;

public class PortfolioTest {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

private Portfolio portfolio = new Portfolio(
	"http://127.0.0.1:5984/argos/_design/argos/_rewrite/",
	"http://127.0.0.1/~benel/cassandre/"
);

@Test public void getSelectedItems() throws Exception {
	this.portfolio.openCorpus("MISS");
	int total = this.portfolio.getSelectedItemSet().countItems();
	assertTrue(total>0);
	this.portfolio.openViewpoint("446d798e240d4dee5a552b902ae56c8d");
	this.portfolio.toggleTopic(
		"446d798e240d4dee5a552b902ae56c8d",
		"70551d9a197a874cb76372c789be629e"
	);
	assertTrue(this.portfolio.getSelectedItemSet().countItems()<total);
	this.portfolio.closeViewpoint("446d798e240d4dee5a552b902ae56c8d");
	assertEquals(total, this.portfolio.getSelectedItemSet().countItems());
}

@Test public void getSelectedHighlights() throws Exception {
	this.portfolio.openCorpus("MISS");
	assertEquals(0, this.portfolio.getSelectedItemSet().countHighlights());
	this.portfolio.openViewpoint("446d798e240d4dee5a552b902ae56c8d");
	this.portfolio.toggleTopic(
		"446d798e240d4dee5a552b902ae56c8d", 
		"70551d9a197a874cb76372c789be629e"
	);
	assertTrue(this.portfolio.getSelectedItemSet().countHighlights()>0);
	this.portfolio.closeViewpoint("446d798e240d4dee5a552b902ae56c8d");
	assertEquals(0, this.portfolio.getSelectedItemSet().countHighlights());
}

@Test public void getTopicsRatios() throws Exception {
	this.portfolio.openCorpus("MISS");
	this.portfolio.openViewpoint("446d798e240d4dee5a552b902ae56c8d");
	for (Portfolio.Topic t : this.portfolio.getTopics()) {
		assertTrue(t.getRatio(0)<1);
		assertTrue(t.getRatio(1)==0);
	}
	this.portfolio.toggleTopic(
		"446d798e240d4dee5a552b902ae56c8d",
		"70551d9a197a874cb76372c789be629e"
	);
	for (Portfolio.Topic t : this.portfolio.getTopics()) {
		if (
			"446d798e240d4dee5a552b902ae56c8d"
				.equals(t.getViewpointID())
			&& "70551d9a197a874cb76372c789be629e"
				.equals(t.getTopicID())
		) {
			assertTrue(t.getRatio(0)==1);
			assertTrue(t.getRatio(1)==1);
		}
	}
	this.portfolio.closeViewpoint("446d798e240d4dee5a552b902ae56c8d");
	assertTrue(this.portfolio.getTopics().isEmpty());
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< PortfolioTest
