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

import java.awt.*;
import java.awt.event.*;
import javax.swing.*;
import org.porphyry.controller.ToggleTopic;
import org.porphyry.model.Portfolio;

class TopicLabel extends JLabel {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

private Portfolio.Viewpoint.Topic model;

public TopicLabel(Portfolio.Viewpoint.Topic model) {
	super(model.toString());
	this.model = model;
	this.addMouseListener(
		new MouseAdapter() {
			@Override public void mouseClicked(MouseEvent e) {
				Portfolio.Viewpoint.Topic 
					model = TopicLabel.this.model;
				new ToggleTopic(
					model.getPortfolio(), 
					model.getViewpoint().getID(), 
					model.getID()
				).execute();
			}
		}
	);
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< TopicLabel

