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
import java.awt.event.*;
import javax.swing.*;
import org.porphyry.model.ItemSet;

public class Portfolio extends JFrame implements Observer {//>>>>>>>>>>>>>>>>>>>

private org.porphyry.model.Portfolio model;
private final JTabbedPane corporaPanel = new JTabbedPane(JTabbedPane.BOTTOM);

public Portfolio(org.porphyry.model.Portfolio model) {
	super(localize("PORTFOLIO"));
	this.model = model;
	this.setMenus(
		new Menu("PORTFOLIO").addAll(
			new MenuItem("OPEN_CORPORA") {
				void run() {
					new Opener(Portfolio.this);
				}
			}
		)
			
	);
	this.addTab("SOURCES");
	this.addTab("HIGHLIGHTS");
	this.add(this.corporaPanel);
	model.addObserver(this);
}

@Override public void update(Observable o, Object arg) {
	try {
		ItemSet s = this.model.getSelectedItemSet();
		this.setTabTitle(0, "SOURCES", s.countItems());
		this.setTabTitle(1, "HIGHLIGHTS", s.countHighlights());
		JPanel itemsPanel = 
			(JPanel) this.corporaPanel.getComponentAt(0);
		JPanel highlightsPanel = 
			(JPanel) this.corporaPanel.getComponentAt(1);
		//TODO updating and/or hiding instead of starting from scratch?
		itemsPanel.removeAll();
		highlightsPanel.removeAll();
		for (ItemSet.Item i : s.getItems()) {
			itemsPanel.add(new JLabel(i.getName()));
			for (ItemSet.Item.Highlight h : i.getHighlights()) {
				//TODO handle PictureHighlight
				highlightsPanel.add(new JLabel(h.toString()));
			}
		}
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

protected void addTab(String key) {
	this.corporaPanel.add(this.localize(key) + " (0)", new JPanel());
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

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Portfolio
