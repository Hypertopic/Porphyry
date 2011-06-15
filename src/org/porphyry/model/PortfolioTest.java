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

import java.util.*;
import org.json.*;
import org.junit.*;
import static org.junit.Assert.*;

public class PortfolioTest {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

private Portfolio portfolio = new Portfolio(
	"http://127.0.0.1:5984/argos/_design/argos/_rewrite/",
	"http://127.0.0.1/~benel/cassandre/"
);

@Test public void openCorpus() throws Exception {
	this.portfolio.openCorpus("MISS");
	ItemSet s = this.portfolio.getSelectedItemSet();
	assertTrue(s.countItems()>0);
	assertEquals(0, s.countHighlights());
}

@Test public void toggleTopic() throws Exception {
	this.portfolio.openCorpus("MISS");
	this.portfolio.openViewpoint("446d798e240d4dee5a552b902ae56c8d");
	int total = this.portfolio.getSelectedItemSet().countItems();
	this.portfolio.toggleTopic(
		"446d798e240d4dee5a552b902ae56c8d", 
		"70551d9a197a874cb76372c789be629e"
	);
	ItemSet s = this.portfolio.getSelectedItemSet();
	assertTrue(s.countItems()<total);
	assertTrue(s.countHighlights()>0);
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< PortfolioTest
