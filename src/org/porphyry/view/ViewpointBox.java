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
import java.awt.Component;
import java.util.Collection;

public class ViewpointBox extends Box {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

private Portfolio.Viewpoint model;
private final int ARROWS_LAYER = 1;
private final int TOPICS_LAYER = 0;

private JLayeredPane graph = new ViewpointGraph();

public ViewpointBox(Portfolio.Viewpoint model) {
	super(BoxLayout.Y_AXIS);
  this.model = model;
  this.add(this.graph);
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

