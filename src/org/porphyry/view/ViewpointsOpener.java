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
import org.porphyry.controller.OpenViewpoint;

public class ViewpointsOpener extends Opener {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

public ViewpointsOpener(Portfolio model) {
	super(model);
}

@Override protected void open(String id, org.porphyry.model.Portfolio model) {
	new OpenViewpoint(model, id).execute();
}

@Override protected void populateList(org.porphyry.model.Portfolio model) 
	throws Exception
{
	//TODO related viewpoints instead
	for (JSONObject o : model.listRelatedViewpoints()) {
		this.listModel.addElement(o);
	}
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ViewpointsOpener

