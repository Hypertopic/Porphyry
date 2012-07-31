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

package org.porphyry.view;

import org.json.JSONObject;
import org.porphyry.controller.OpenCorpus;
import org.porphyry.model.Portfolio;

public class CorporaOpener extends Opener {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

public CorporaOpener(PortfolioFrame frame) {
	super(frame, "OPEN_CORPORA");
}

@Override protected void open(String id, Portfolio model) {
	new OpenCorpus(model, id).execute();
}

@Override protected void populateList(Portfolio model) 
	throws Exception
{
	for (JSONObject o : model.listCorpora(model.getUser())) {
		this.listModel.addElement(o);
	}
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< CorporaOpener

