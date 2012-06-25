/*
PORPHYRY - Digital space for confronting interpretations about documents

OFFICIAL WEB SITE
http://porphyry.sf.net/

Copyright (C) 2011-2012 Aurelien Benel.

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
import javax.swing.plaf.ColorUIResource;
import org.porphyry.controller.ToggleTopic;
import org.porphyry.model.Portfolio;

class TopicLabel extends JLabel {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

private static final int MAX_FONT_SIZE = 30;
private static final int MIN_FONT_SIZE = 10;
private static final int NULL_FONT_SIZE = 5;
private static final ColorUIResource PRIMARY_COLOR2 = 
	new ColorUIResource(204, 153, 51);
private static final Cursor HAND_CURSOR = new Cursor(Cursor.HAND_CURSOR);	

private Portfolio.Viewpoint.Topic model;
private final MouseListener clickListener = new MouseAdapter() {
  @Override public void mouseClicked(MouseEvent e) {
    Portfolio.Viewpoint.Topic model = TopicLabel.this.model;
    new ToggleTopic(
      model.getPortfolio(), 
      model.getViewpoint().getID(), 
      model.getID()
    ).execute();
  }
};

public TopicLabel(Portfolio.Viewpoint.Topic model, int level) {
	super(model.getName());
	this.model = model;
  this.updateSizeAndBackground(level);
}

protected void updateSizeAndBackground(int level) {
  double ratio = this.model.getRatio(level);
	this.setFont(
		new Font(null, Font.BOLD, 
      (ratio==0) ? NULL_FONT_SIZE
      : (int) Math.round((MAX_FONT_SIZE - MIN_FONT_SIZE)*ratio + MIN_FONT_SIZE)
		)
	);
  if (ratio>0) {
    this.addMouseListener(this.clickListener);
    this.setCursor(HAND_CURSOR);
  }
  if (this.model.isSelected()) {
    this.setOpaque(true);
    this.setBackground(PRIMARY_COLOR2);
  } else {
    this.setOpaque(false);
    this.setBackground(null);
  }
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< TopicLabel

