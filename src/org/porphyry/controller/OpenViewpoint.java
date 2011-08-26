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

package org.porphyry.controller;

import java.util.*;
import javax.swing.*;
import org.porphyry.model.*;

public class OpenViewpoint extends SwingWorker <Set<Portfolio.Topic>,Void> {//>>

private String viewpoint;
private Portfolio portfolio;

public OpenViewpoint(Portfolio portfolio, String viewpoint) {
	this.viewpoint = viewpoint;
	this.portfolio = portfolio;
}

@Override protected Set<Portfolio.Topic> doInBackground() throws Exception {
	this.portfolio.openViewpoint(this.viewpoint);
	return this.portfolio.getTopics();
}

@Override public void done() {
	try {
		for (Portfolio.Topic t : this.get()) {
			System.out.println(t);
		} 
		this.portfolio.notifyObservers();
	} catch (Exception e) {
		e.printStackTrace();
	}
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< OpenViewpoint
