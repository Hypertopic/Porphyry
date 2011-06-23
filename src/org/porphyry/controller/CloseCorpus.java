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

public class CloseCorpus extends SwingWorker <Set<Portfolio.Topic>,Void> {//>>>>

private String corpus;
private Portfolio portfolio;

public CloseCorpus(Portfolio portfolio, String corpus) {
	this.corpus = corpus;
	this.portfolio = portfolio;
}

@Override protected Set<Portfolio.Topic> doInBackground() throws Exception {
	this.portfolio.closeCorpus(this.corpus);
	return this.portfolio.getTopics();
}

@Override public void done() {
	try {
		System.out.println(this.portfolio.getSelectedItemSet());
		for (Portfolio.Topic t : this.get()) {
			System.out.println(t);
		} 
	} catch (Exception e) {
		e.printStackTrace();
	}
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< CloseCorpus
