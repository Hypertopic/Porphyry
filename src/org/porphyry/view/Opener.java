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

import javax.swing.*;
import javax.swing.event.*;
import java.awt.*;
import java.awt.event.*;
import java.util.Collection;
import org.json.JSONObject;
import org.porphyry.controller.OpenCorpus;

public abstract class Opener extends JDialog {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

private final Portfolio portfolio;
private final Box rightPanel = Box.createVerticalBox();
private final Box leftPanel = Box.createVerticalBox();
private final JSONList listView;
final DefaultListModel listModel = new DefaultListModel();

public Opener(Portfolio portfolio) {
	super(portfolio, portfolio.localize("OPEN_CORPORA"));
	this.portfolio = portfolio;
	this.add(
		new JSplitPane(
			JSplitPane.HORIZONTAL_SPLIT, 
			this.leftPanel, 
			this.rightPanel
		)
	);
	org.porphyry.model.Portfolio model = portfolio.getModel();
	try {
		this.populateList(model);
	} catch (Exception e) {
		e.printStackTrace(); //TODO
	}
	this.listView = new JSONList(listModel);
	this.display(this.listView, JSplitPane.RIGHT);

	this.display(new ActionButton("CANCEL", false), JSplitPane.RIGHT);
	this.display(
		new ActionButton("OPEN", true) {
			@Override public void onClick() {
				for (
					Object o : 
					Opener.this.listView.getSelectedValues()
				) {
					Opener.this.open(
						((JSONObject) o)
							.optString("id"),
						Opener.this.portfolio.getModel()
					);
				}
				super.onClick();
			}
		},
		JSplitPane.RIGHT
	);

	this.setBounds(0, 0, 640, 480);
	this.setVisible(true);
}

protected abstract void populateList(org.porphyry.model.Portfolio model) 
	throws Exception;

protected abstract void open(String id, org.porphyry.model.Portfolio model);

protected void displayHeader(String key, String side) {
	this.displayStrut(6, side);
	this.display(this.portfolio.localize(key), Color.GRAY, side);
	this.displayStrut(3, side);
}

protected void display(Collection<JSONObject> c, String side) throws Exception {
	for (JSONObject o : c) {
		this.display(o.getString("name"), JSplitPane.RIGHT);
	}
}

protected void display(String s, String side) {
	this.display(s, Color.BLACK, side);
}

protected void display(String s, Color c, String side) {
	JLabel l = new JLabel(s);
	l.setForeground(c);
	this.display(l, side);
}

protected void displayStrut(int height, String side) {
	this.display(Box.createVerticalStrut(height), side);
}

protected void display(Component c, String side) {
	Box panel = (JSplitPane.RIGHT.equals(side))
		? this.rightPanel
		: this.leftPanel;
	panel.add(c);
}

class JSONList extends JList {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

public JSONList(ListModel dataModel) {
	super(dataModel);
	super.setCellRenderer(
		new DefaultListCellRenderer() {
			@Override public Component getListCellRendererComponent(
				JList list, 
				Object value, 
				int index, 
				boolean isSelected, 
				boolean hasFocus
			) {
				String name;
				try {
					name = ((JSONObject) value)
						.getString("name"); 
				} catch (Exception e) {
					name = e.toString();
				}
				return super.getListCellRendererComponent(
					list, name, index, isSelected, hasFocus
				);
			}
		}
	);
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< JSONList

class ActionButton extends JButton {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

public ActionButton(String key, boolean isDefault) {
	super(Opener.this.portfolio.localize(key));
	this.addActionListener(
		new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				ActionButton.this.onClick();
			}
		}
	);
	if (isDefault) {
		Opener.this.getRootPane().setDefaultButton(this);
	}
	Opener.this.display(this, JSplitPane.RIGHT);
}

public void onClick() {
	Opener.this.dispose();
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ActionButton

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Opener

