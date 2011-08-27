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

import java.util.*;
import java.awt.*;
import java.awt.event.*;
import javax.swing.*;
import org.porphyry.model.*;
import org.porphyry.controller.ToggleTopic;

//TODO change name to simplify references to model.Portfolio

public class Portfolio extends JFrame implements Observer {//>>>>>>>>>>>>>>>>>>>

private org.porphyry.model.Portfolio model;
private final JTabbedPane corporaPanel = new JTabbedPane(JTabbedPane.BOTTOM);
private final Box viewpointsPanel = new Box(BoxLayout.Y_AXIS);
private final JPanel itemsPanel = new ScrollablePanel();
private final JPanel highlightsPanel = new ScrollablePanel();

public Portfolio(org.porphyry.model.Portfolio model) {
	super(localize("PORTFOLIO"));
	this.model = model;
	this.setMenus(
		new Menu("PORTFOLIO").addAll(
			new MenuItem("OPEN_CORPORA") {
				void run() {
					new CorporaOpener(Portfolio.this);
				}
			},
			new MenuItem("OPEN_VIEWPOINTS") {
				void run() {
					new ViewpointsOpener(Portfolio.this);
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
	model.addObserver(this);
}

@Override public void update(Observable o, Object arg) {
	try {
		ItemSet s = this.model.getSelectedItemSet();
		this.setTabTitle(0, "SOURCES", s.countItems());
		this.setTabTitle(1, "HIGHLIGHTS", s.countHighlights());
		//TODO updating and/or hiding instead of starting from scratch?
		this.itemsPanel.removeAll();
		this.highlightsPanel.removeAll();
		for (ItemSet.Item i : s.getItems()) {
			this.itemsPanel.add(new JLabel(i.getName()));
			for (ItemSet.Item.Highlight h : i.getHighlights()) {
				//TODO handle PictureHighlight
				this.highlightsPanel.add(
					new JLabel(h.toString())
				);
			}
		}
		this.viewpointsPanel.removeAll();
		for (
			org.porphyry.model.Portfolio.Viewpoint.Topic t :
			this.model.getTopics()
		) {
			this.viewpointsPanel.add(new TopicLabel(t));
		}
		this.viewpointsPanel.validate();
		this.viewpointsPanel.repaint();
	} catch (Exception e) {
		e.printStackTrace(); //TODO
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

public org.porphyry.model.Portfolio getModel() {
	return this.model;
}

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

class TopicLabel extends JLabel {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

private org.porphyry.model.Portfolio.Viewpoint.Topic model;

public TopicLabel(org.porphyry.model.Portfolio.Viewpoint.Topic model) {
	super(model.toString());
	this.model = model;
	this.addMouseListener(
		new MouseAdapter() {
			@Override public void mouseClicked(MouseEvent e) {
				org.porphyry.model.Portfolio.Viewpoint.Topic 
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

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Portfolio
