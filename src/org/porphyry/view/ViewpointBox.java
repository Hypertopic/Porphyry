/*
PORPHYRY - Digital space for confronting interpretations about documents

OFFICIAL WEB SITE
http://porphyry.sf.net/

Copyright (C) 2012 Aurelien Benel.

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

import org.porphyry.model.*;
import javax.swing.*;
import javax.swing.border.LineBorder;
import java.awt.*;
import java.awt.event.*;
import java.util.Collection;

public class ViewpointBox extends Box {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

private Portfolio.Viewpoint model;
private final int ARROWS_LAYER = 1;
private final int TOPICS_LAYER = 0;
private static final Color PRIMARY_COLOR1 = new Color(153, 51, 00);
private static final Color PRIMARY_COLOR2 = new Color(204, 153, 51);
private static final Color DARK_GRAY = new Color(110, 110, 110);
private static final Color LIGHT_GRAY = new Color(200, 200, 200);
private static final Cursor HAND_CURSOR = new Cursor(Cursor.HAND_CURSOR);	
public static final String OPEN_SYMBOL = "\u25bc";
public static final String CLOSED_SYMBOL = "\u25ba";
private final LineBorder ACTIVE_BORDER = new LineBorder(PRIMARY_COLOR1, 2);
private final LineBorder INACTIVE_BORDER = new LineBorder(DARK_GRAY, 2);

private JLayeredPane graph = new ViewpointGraph();
private JLabel title = new JLabel();

public ViewpointBox(Portfolio.Viewpoint model) throws Exception {
	super(BoxLayout.Y_AXIS);
  this.model = model;
  this.title.setForeground(Color.WHITE);
	this.title.setOpaque(true);  
  this.title.setCursor(new Cursor(Cursor.HAND_CURSOR));
	this.title.setAlignmentX(Component.CENTER_ALIGNMENT);  
  this.add(this.title);
  this.add(this.graph);
  this.unmask();
  this.title.setMaximumSize(
		new Dimension(Integer.MAX_VALUE, this.title.getMaximumSize().height)
	);
	this.title.addMouseListener(
		new MouseAdapter() {
			@Override public void mouseClicked(MouseEvent e) {
				if (e.getButton()==MouseEvent.BUTTON1) {
          ViewpointBox.this.switchMask();
 				} else {
					//TODO Viewpoint Popup
				}
			}
		}
	);
}

public void update(int level) throws Exception {
  //TODO updating instead of starting from scratch?  
  this.graph.removeAll();
  for (Portfolio.Viewpoint.Topic t : this.model.getTopics()) {
    this.graph.add(new TopicLabel(t, level), new Integer(TOPICS_LAYER));
  }
  this.graph.validate();
  this.graph.repaint();
}

public void switchMask() {
  try {
    if (this.graph.isVisible()) {
      this.mask();
    } else {
      this.unmask();
    }
  } catch (Exception e) {
    e.printStackTrace(); //TODO?
  }
}

public void unmask() throws Exception {
	this.graph.setVisible(true);
	this.title.setText(OPEN_SYMBOL + " " + this.model.getName());
  this.title.setBackground(PRIMARY_COLOR1);
  this.setBorder(ACTIVE_BORDER);
}

public void mask() throws Exception {
	this.graph.setVisible(false);
	this.title.setText(CLOSED_SYMBOL + " " + this.model.getName());
	this.title.setBackground(DARK_GRAY);
	this.setBorder(INACTIVE_BORDER);
}

class ViewpointGraph extends JLayeredPane {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

public ViewpointGraph() {
  this.setLayout(new WrapLayout());
}

protected void showArrow(TopicLabel from, TopicLabel to) {
  this.add(
    new Arrow(from.getAnchor(), to.getAnchor()),
    new Integer(ARROWS_LAYER)
  );
}

public void showArrows(
  TopicLabel focus, 
  Collection<String> broaderIDs,
  Collection<String> narrowerIDs
) {
  for (Component t : this.getComponentsInLayer(TOPICS_LAYER)) {
    String id = ((TopicLabel) t).getID();
    if (narrowerIDs.contains(id)) {
      this.showArrow(focus, (TopicLabel) t);
    } else if (broaderIDs.contains(id)) {
      this.showArrow((TopicLabel) t, focus);
    }
  }
}

public void hideArrows() {
  Component[] arrows = this.getComponentsInLayer(ARROWS_LAYER);
  for (int i = arrows.length-1; i>=0; i--) {
    this.remove(arrows[i]);
  }
  this.validate();
  this.repaint();
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ViewpointGraph

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ViewpointBox

