/*
PORPHYRY - Digital space for building and confronting interpretations about
documents

SCIENTIFIC COMMITTEE
- Andrea Iacovella
- Aurelien Benel

OFFICIAL WEB SITE
http://www.porphyry.org/

Copyright (C) 2007 Aurelien Benel.

LEGAL ISSUES
This program is free software; you can redistribute it and/or modify it under
the terms of the GNU General Public License (version 2) as published by the
Free Software Foundation.
This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details:
http://www.gnu.org/licenses/gpl.html
*/

package org.porphyry.view;

import java.util.*;
import java.net.*;
import java.awt.*;
import java.awt.event.*;
import java.beans.*;
import java.io.*;

import javax.swing.*;
import javax.swing.filechooser.FileNameExtensionFilter;
import org.porphyry.model.LabeledURL;

public class MenuBar extends JMenuBar implements Observer {//>>>>>>>>>>>>>>>>>>

private static final ResourceBundle BABEL = 
	ResourceBundle.getBundle("org.porphyry.view.Language");

private org.porphyry.presenter.Portfolio presenter;

private final ExtendedFrame frame;

private final JFileChooser mmFileChooser = new JFileChooser();

class Menu extends JMenu {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

public Menu(String s) {
	super(BABEL.getString(s));
}

public Menu addAll(JComponent... components) {
	for (JComponent c: components) {
		if (c instanceof MenuItem) {
			c.setEnabled(((MenuItem) c).mustBeEnabled());
		}
		this.add(c);
	}
	return this;
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< class Menu

abstract class MenuItem extends JMenuItem {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

public MenuItem(String titleCode) {
	super(BABEL.getString(titleCode));
	this.addActionListener(
			new ActionListener() {
				public void actionPerformed(ActionEvent e) {
					try {
						MenuItem.this.run();
					} catch (NullPointerException ex) {
						// Canceled : nothing to do...
					}
				}
			}
	);
}

abstract void run();

boolean mustBeEnabled() {
	return false;
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< class MenuItem

class CloseViewpointMenuItem extends JMenuItem {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

public CloseViewpointMenuItem(final org.porphyry.presenter.Viewpoint presenter) {
	super(presenter.getName());
	this.addActionListener(
		new ActionListener() { 
			public void actionPerformed(ActionEvent e) { 
				MenuBar.this.presenter.closeViewpoint(
					presenter.getURL()
				); 
			}
		}
	);
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< class CloseViewpointMenuItem

class ExportViewpointMenuItem extends JMenuItem {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

	public ExportViewpointMenuItem(final org.porphyry.presenter.Viewpoint presenter) {
		super(presenter.getName());
		this.addActionListener(
			new ActionListener() { 
				public void actionPerformed(ActionEvent e) { 
					try {
						int answer = MenuBar.this.mmFileChooser.showSaveDialog(
							MenuBar.this.frame
						);
						if (answer==JFileChooser.APPROVE_OPTION) {
							Writer w = new OutputStreamWriter(
								new FileOutputStream(
									MenuBar.this.mmFileChooser.getSelectedFile()
								), "UTF-8"
							);
							w.write(presenter.export());
							w.close();
						}
					} catch (Exception ex) {
						MenuBar.this.frame.showException(ex);
					} 
				}
			}
		);
	}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< class CloseViewpointMenuItem

private final MenuItem actorSuscribe = 
	new MenuItem("ACTOR_SUSCRIBE") {
		@Override void run() {}
	};

private final MenuItem actorUnsuscribe = 
	new MenuItem("ACTOR_UNSUSCRIBE") {
		@Override void run() {}
	};

private final Menu actorMenu = 
	new Menu("ACTOR"); 

private final MenuItem viewpointLoad = 
	new MenuItem("VIEWPOINT_LOAD") {
		@Override 
		void run() {
			MenuBar.this.askForViewpoints( 
				MenuBar.this.askForActor(
					MenuBar.this.askForService(this.getText()),
					this.getText()
				),
				this.getText()
			);
		}
		@Override
		boolean mustBeEnabled() {
			return true;
		}
	};

private final Menu viewpointExport = 
	new Menu("VIEWPOINT_EXPORT");
	
private final Menu viewpointClose = 
	new Menu("VIEWPOINT_CLOSE");

private final Menu viewpointMenu = 
	new Menu("VIEWPOINT"); 

private final MenuItem corpusLoad = 
	new MenuItem("CORPUS_LOAD") {
		@Override
		void run() {}
	};

private final MenuItem corpusClose = 
	new MenuItem("CORPUS_CLOSE") {
		@Override
		void run() {}
	};

private final Menu corpusMenu = 
	new Menu("CORPUS");

private Portfolio portfolio; //TODO cleaner

public MenuBar(
	org.porphyry.presenter.Portfolio presenter, 
	ExtendedFrame frame,
	Portfolio portfolio //TODO cleaner
) {
	super();
	this.presenter = presenter;
	this.frame = frame;
	this.portfolio = portfolio;
	FocusActionListener focusActionListener = new FocusActionListener();
	this.addAll(
		this.viewpointMenu.addAll(
			this.viewpointLoad,
			this.viewpointClose,
			new JSeparator(),
			this.viewpointExport,
			new JSeparator()
		),
		this.corpusMenu.addAll(
			this.corpusLoad,
			this.corpusClose,
			new JSeparator()
		)
	);
	this.load();
	this.presenter.addObserver(this);
	this.mmFileChooser.setFileFilter(
			new FileNameExtensionFilter("Freemind XML", "mm")
	);
}

public void addAll(Menu... menus) {
	for (Menu m: menus) {
		this.add(m);
	}
}

public void update(Observable o1, Object o2) {
	this.viewpointClose.removeAll();
	this.viewpointExport.removeAll();
	this.load();
}

protected void load() {
	for (org.porphyry.presenter.Viewpoint v: this.presenter.getAllViewpoints()){
		this.viewpointExport.add(
			new ExportViewpointMenuItem(v)
		);
		this.viewpointClose.add(
			new CloseViewpointMenuItem(v)
		);

	}
}

public Vector<LabeledURL> askForService(String action) {
	Vector<LabeledURL> actors = null;
	JTextField field = new JTextField(
		this.presenter.getService()
	);
	Object[] message = {
		new JLabel(BABEL.getString("SERVICE")), 
		field
	};
	boolean pressOK;
	do {
		pressOK = this.ask(message, action);
		if (pressOK) try {
			org.porphyry.model.Actors a = 
				new org.porphyry.model.Actors(
					field.getText()+"actor/"
				);
			a.httpGet(true);
			actors = a.getActors();
			this.presenter.setService(field.getText());
		} catch (Exception e) {
			actors = null;
			this.frame.showException(e);
		}
	} while (pressOK && actors==null);
	return actors;
}

public Vector<LabeledURL> askForActor(Vector<LabeledURL> actors, String action) {
	Vector<LabeledURL> viewpoints = null;
	JComboBox combo = 
		new JComboBox(actors);
	if (this.presenter.getActor()!=null) {
		try {
			combo.setSelectedItem(
				new LabeledURL(this.presenter.getActor(), "")
			);
		} catch (MalformedURLException e) {
			//Should never go there
			e.printStackTrace();
		}
	}
	Object[] message= {
		new JLabel(BABEL.getString("ACTOR")),
		combo
	};
	boolean pressOK;
	do {
		pressOK = this.ask(message, action);
		if (pressOK) try {
			org.porphyry.model.Actor a = 
				new org.porphyry.model.Actor(
					((LabeledURL)combo.getSelectedItem())
						.getURL()
				);
			a.httpGet(true);
			viewpoints = a.getViewpoints();
			this.presenter.setActor(a.getURL());
		} catch (Exception e) {
			viewpoints = null;
			this.frame.showException(e);
		}
	} while (pressOK && viewpoints==null); 
	return viewpoints;
}

public void askForViewpoints(Vector<LabeledURL> possibleViewpoints, String action) {
	JList list = new JList(possibleViewpoints);
	list.setSelectionInterval(0, possibleViewpoints.size()-1);
	Object[] message= {
		new JLabel(BABEL.getString("SELECT_VIEWPOINTS")),
		list
	};
	boolean pressOK;
	boolean problem;
	do {
		problem = false;
		pressOK = this.ask(message, action);
		if (pressOK) try {
			this.portfolio.openViewpoints(list.getSelectedValues());
		} catch (Exception e) {
			problem = true;
			this.frame.showException(e);
		}
	} while (pressOK && problem); 
}

protected boolean ask(Object[] message, String action) {
	return JOptionPane.OK_OPTION==JOptionPane.showOptionDialog(
		this.frame,
		message,
		action,
		JOptionPane.OK_CANCEL_OPTION,
		JOptionPane.QUESTION_MESSAGE,
		null,
		null,
		null
	);
}

/**
* Used to perform menu actions on the focus component.
*/
class FocusActionListener implements ActionListener, PropertyChangeListener {//>>>

private JComponent focus = null;

public FocusActionListener() {
	KeyboardFocusManager.getCurrentKeyboardFocusManager()
        	.addPropertyChangeListener("permanentFocusOwner", this);
}

public void propertyChange(PropertyChangeEvent e) {
	Object o = e.getNewValue();
	this.focus = (o instanceof JComponent)
		? (JComponent) o
		: null;
}
    
public void actionPerformed(ActionEvent e) {
	if (this.focus!=null) {
        	Action a = this.focus.getActionMap().get(
			e.getActionCommand()
		); 
		if (a != null) {
            		a.actionPerformed(
				new ActionEvent( 
					this.focus, 
					ActionEvent.ACTION_PERFORMED,
					 null
				)
			);
		}
	}
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< class FocusActionListener

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< class MenuBar

