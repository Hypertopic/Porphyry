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

public class ToggleTopic
	extends SwingWorker <Set<Portfolio.Viewpoint.Topic>,Void>
{//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

private String viewpoint;
private String topic;
private Portfolio portfolio;

public ToggleTopic(Portfolio portfolio, String viewpoint, String topic) {
	this.viewpoint = viewpoint;
	this.topic = topic;
	this.portfolio = portfolio;
}

@Override protected Set<Portfolio.Viewpoint.Topic> doInBackground() 
	throws Exception
{
	this.portfolio.toggleTopic(this.viewpoint, this.topic);
	return this.portfolio.getTopics();
}

@Override public void done() {
	try {
		System.out.println(this.portfolio.getSelectedItemSet());
		for (Portfolio.Viewpoint.Topic t : this.get()) {
			System.out.println(t);
		} 
		this.portfolio.notifyObservers();
	} catch (Exception e) {
		e.printStackTrace();
	}
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ToggleTopic
