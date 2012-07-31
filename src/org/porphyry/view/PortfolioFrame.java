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

import java.util.*;
import java.awt.*;
import java.awt.event.*;
import javax.swing.*;
import javax.swing.event.*;
import org.porphyry.model.*;
import org.porphyry.controller.ToggleTopic;

public class PortfolioFrame extends JFrame implements Observer {//>>>>>>>>>>>>>>

private Portfolio model;
private final JTabbedPane corporaPanel = new JTabbedPane(JTabbedPane.BOTTOM);
private final Box viewpointsPanel = new Box(BoxLayout.Y_AXIS);
private final JPanel itemsPanel = new ScrollablePanel();
private final JPanel highlightsPanel = new ScrollablePanel();
private final int ARROWS_LAYER = 1;
private final int TOPICS_LAYER = 0;

public PortfolioFrame(Portfolio model) {
	super(localize("PORTFOLIO"));
	this.model = model;
	this.setMenus(
		new Menu("PORTFOLIO").addAll(
			new MenuItem("OPEN_CORPORA") {
				void run() {
					new CorporaOpener(PortfolioFrame.this);
				}
			},
			new MenuItem("OPEN_VIEWPOINTS") {
				void run() {
					new ViewpointsOpener(
						PortfolioFrame.this
					);
				}
			}
		)
	);
	JSplitPane main = new JSplitPane(
		JSplitPane.HORIZONTAL_SPLIT,
		this.viewpointsPanel,
		this.corporaPanel
	);
	this.addTab(this.itemsPanel, "SOURCES");
	this.addTab(this.highlightsPanel, "HIGHLIGHTS");
	this.setContentPane(main);
  this.itemsPanel.setBackground(Color.WHITE);
  this.highlightsPanel.setBackground(Color.WHITE);
	model.addObserver(this);
  this.corporaPanel.addChangeListener(
    new ChangeListener() {
      public void stateChanged(ChangeEvent e) {
        // Call a controller instead?
        try {
          PortfolioFrame.this.updateViewpointsPanel();
        } catch (Exception ex) {
		      ex.printStackTrace(); //TODO
        }
      }
    }
  );
}

@Override public void update(Observable o, Object arg) {
	try {
    this.updateCorporaPanel();
    this.updateViewpointsPanel();
	} catch (Exception e) {
		e.printStackTrace(); //TODO
	}
}

protected void updateCorporaPanel() throws Exception {
  ItemSet s = this.model.getSelectedItemSet();
  this.setTabTitle(0, "SOURCES", s.countItems());
  this.setTabTitle(1, "HIGHLIGHTS", s.countHighlights());
  //TODO updating and/or hiding instead of starting from scratch?
  this.itemsPanel.removeAll();
  this.highlightsPanel.removeAll();
  for (ItemSet.Item i : s.getItems()) {
    this.itemsPanel.add(new ItemLabel(i));
    for (ItemSet.Item.Highlight h : i.getHighlights()) {
      this.highlightsPanel.add(new HighlightLabel(h));
    }
  }
}

protected void updateViewpointsPanel() throws Exception {
  //TODO updating instead of starting from scratch?
  int level = this.corporaPanel.getSelectedIndex();
  this.viewpointsPanel.removeAll();
  for (Portfolio.Viewpoint v : PortfolioFrame.this.model.getViewpoints()) {
    ViewpointBox box = new ViewpointBox(v);
    this.viewpointsPanel.add(box);
    box.update(level);
  }
}


protected void setTabTitle(int index, String key, int count) {
	this.corporaPanel.setTitleAt(
		index,
		this.localize(key) + " (" + count + ")"
	);
}

protected void addTab(JPanel panel, String key) {
	panel.setLayout(new WrapLayout());
	this.corporaPanel.add(
		this.localize(key) + " (0)", 
		new JScrollPane(
			panel,
			JScrollPane.VERTICAL_SCROLLBAR_ALWAYS, 
			JScrollPane.HORIZONTAL_SCROLLBAR_NEVER
		)
	);
}

protected void setMenus(Menu... menus) {
	JMenuBar bar = new JMenuBar();
	for (Menu m: menus) {
		bar.add(m);
	}
	this.setJMenuBar(bar);
}

protected static String localize(String code) {
	return ResourceBundle.getBundle("org.porphyry.view.Localization")
		.getString(code);
}

public Portfolio getModel() {
	return this.model;
}

class ViewpointBox extends Box {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

private Portfolio.Viewpoint model;

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

class Menu extends JMenu {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

public Menu(String s) {
	super(localize(s));
}

public Menu addAll(JComponent... components) {
	for (JComponent c: components) {
		this.add(c);
	}
	return this;
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Menu

abstract class MenuItem extends JMenuItem {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

public MenuItem(String s) {
	super(localize(s) + "...");
	this.addActionListener(
		new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				try {
					MenuItem.this.run();
				} catch (NullPointerException ex) {
					// If canceled, nothing to do...
				}
			}
		}
	);
}

abstract void run();

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< MenuItem

/**
 * JPanel that can be resized in a vertical JScrollPane.
 */
class ScrollablePanel extends JPanel {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

@Override public Dimension getPreferredSize() {
	Container parent = this.getParent();
	return new Dimension(
		parent.getWidth(), 
		Math.max(
			super.getPreferredSize().height,
			parent.getHeight()
		)
	);
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ScrollablePanel

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< PortfolioFrame
