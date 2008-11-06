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

class EditViewpointMenuItem extends JMenuItem {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

public EditViewpointMenuItem(final org.porphyry.presenter.Viewpoint presenter) {
	super(presenter.getName());
	this.addActionListener(
		new ActionListener() { 
			public void actionPerformed(ActionEvent e) { 
				try { 
					new Viewpoint(
						presenter,
						MenuBar.this.presenter,
						MenuBar.this.portfolio
					); 
				} catch (Exception ex) { 
					MenuBar.this.frame.showException(ex);
				} 
			}
		}
	);

}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< class EditViewpointMenuItem

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

private final MenuItem actorCreate = 
	new MenuItem("ACTOR_CREATE") {
		@Override 
		void run() {
			MenuBar.this.createActor(
					MenuBar.this.askForService(
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

private final MenuItem viewpointCreate = 
	new MenuItem("VIEWPOINT_CREATE") {
		@Override
		void run() {
			MenuBar.this.createViewpoint( 
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

private final MenuItem viewpointImport = 
	new MenuItem("VIEWPOINT_IMPORT") {
		@Override
		void run() {
			MenuBar.this.importViewpoint(
				MenuBar.this.askForActor(
					MenuBar.this.askForService(this.getText()),
					this.getText()
				),
				this.getText());
		}
		@Override
		boolean mustBeEnabled() {
			return true;
		}
	};

private final Menu viewpointEdit = 
	new Menu("VIEWPOINT_EDIT"); 

private final Menu viewpointMenu = 
	new Menu("VIEWPOINT"); 

private final MenuItem topicCreateIsolated = 
	new MenuItem("ISOLATED_TOPIC") {
		@Override
		void run() {
			((Viewpoint) MenuBar.this.frame)
				.createIsolatedTopic();
		}
		@Override
		boolean mustBeEnabled() {
			return MenuBar.this.frame instanceof Viewpoint;
		}
	};

private final MenuItem topicCreateGeneric = 
	new MenuItem("GENERIC_TOPIC") {
		@Override
		void run() {
			((Viewpoint) MenuBar.this.frame)
				.createTopic("includes");
		}
		@Override
		boolean mustBeEnabled() {
			return MenuBar.this.frame instanceof Viewpoint;
		}
	};

private final MenuItem topicCreateSpecific = 
	new MenuItem("SPECIFIC_TOPIC") {
		@Override
		void run() {
			((Viewpoint) MenuBar.this.frame)
				.createTopic("includedIn");
		}
		@Override
		boolean mustBeEnabled() {
			return MenuBar.this.frame instanceof Viewpoint;
		}
	};

private final Menu topicCreate = 
	new Menu("TOPIC_CREATE"); 

private final MenuItem topicDestroy = 
	new MenuItem("TOPIC_DESTROY") {
		@Override
		void run() {
			((Viewpoint) MenuBar.this.frame).destroyTopics();
		}
		@Override
		boolean mustBeEnabled() {
			return MenuBar.this.frame instanceof Viewpoint;
		}
	};

private final JMenuItem topicCut = 
	new JMenuItem(TopicsTransferHandler.getCutAction());

private final JMenuItem topicCopy = 
	new JMenuItem(TopicsTransferHandler.getCopyAction());

private final JMenuItem topicPaste = 
	new JMenuItem(TopicsTransferHandler.getPasteAction());

private final MenuItem itemInsert = 
	new MenuItem("ITEM_INSERT") {
		@Override
		void run() {}
	};

private final MenuItem itemUnlink = 
	new MenuItem("ITEM_UNLINK") {
		@Override
		void run() {}
	};

private final MenuItem itemCut = 
	new MenuItem("ITEM_CUT") {
		@Override
		void run() {}
	};

private final MenuItem itemCopy= 
	new MenuItem("ITEM_COPY") {
		@Override
		void run() {}
	};

private final MenuItem itemPaste = 
	new MenuItem("ITEM_PASTE") {
		@Override
		void run() {}
	};

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

private final MenuItem corpusCreate = 
	new MenuItem("CORPUS_CREATE") {
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
	this.topicCut.setText(BABEL.getString("TOPIC_CUT"));
	this.topicCopy.setText(BABEL.getString("TOPIC_COPY"));
	this.topicPaste.setText(BABEL.getString("TOPIC_PASTE"));
	this.topicCut.setAccelerator(
		KeyStroke.getKeyStroke(
			KeyEvent.VK_X, 
			PorphyryTheme.SHORTCUT_KEY
		)
	);
	this.topicCopy.setAccelerator(
		KeyStroke.getKeyStroke(
			KeyEvent.VK_C, 
			PorphyryTheme.SHORTCUT_KEY
		)
	);
	this.topicPaste.setAccelerator(
		KeyStroke.getKeyStroke(
			KeyEvent.VK_V, 
			PorphyryTheme.SHORTCUT_KEY
		)
	);
	this.topicCut.setActionCommand("TOPIC_CUT");
	this.topicCopy.setActionCommand("TOPIC_COPY");
	this.topicPaste.setActionCommand("TOPIC_PASTE");
	this.topicCut.addActionListener(focusActionListener);
	this.topicCopy.addActionListener(focusActionListener);
	this.topicPaste.addActionListener(focusActionListener);
	this.addAll(
		this.actorMenu.addAll(
			this.actorCreate,
			this.actorSuscribe,
			this.actorUnsuscribe
		),
		this.viewpointMenu.addAll(
			this.viewpointCreate,
			this.viewpointLoad,
			this.viewpointEdit,
			this.viewpointClose,
			new JSeparator(),
			this.viewpointImport,
			this.viewpointExport,
			new JSeparator(),
			this.topicCreate.addAll(
				this.topicCreateGeneric,
				this.topicCreateSpecific,
				this.topicCreateIsolated
			),
			this.topicCut, 
			this.topicCopy,
			this.topicPaste,
			this.topicDestroy
		),
		this.corpusMenu.addAll(
			this.corpusCreate,
			this.corpusLoad,
			this.corpusClose,
			new JSeparator(), 
			this.itemInsert, 
			this.itemCut, 
			this.itemCopy, 
			this.itemPaste,
			this.itemUnlink 
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
	this.viewpointEdit.removeAll();
	this.viewpointClose.removeAll();
	this.viewpointExport.removeAll();
	this.load();
}

protected void load() {
	for (org.porphyry.presenter.Viewpoint v: this.presenter.getAllViewpoints()){
		this.viewpointEdit.add(
			new EditViewpointMenuItem(v)
		);
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

public void createViewpoint(Object lastResult, String action) {
	if (lastResult==null)
		throw new NullPointerException();
	JTextField field = new JTextField();
	Object[] message = {
		new JLabel(BABEL.getString("VIEWPOINT_NAME")), 
		field
	};
	boolean pressOK;
	boolean problem;
	do {
		problem = false;
		pressOK = this.ask(message, action);
		if (pressOK) try {
			this.presenter.createViewpoint(field.getText());
		} catch (Exception e) {
			problem = true;
			this.frame.showException(e);
		}
	} while (pressOK && problem); 
}

public void createActor(Object lastResult, String action) {
	if (lastResult==null)
		throw new NullPointerException();
	JTextField login = new JTextField();
	JTextField fullName = new JTextField();
	Object[] message = {
		new JLabel(BABEL.getString("ACTOR_LOGIN")), 
		login,
		new JLabel(BABEL.getString("ACTOR_FULLNAME")), 
		fullName
	};
	boolean pressOK;
	boolean problem;
	do {
		problem = false;
		pressOK = this.ask(message, action);
		if (pressOK) try {
			this.presenter.createActor(login.getText(), fullName.getText());
		} catch (Exception e) {
			problem = true;
			this.frame.showException(e);
		}
	} while (pressOK && problem); 
}

public void importViewpoint(Object lastResult, String action) {
	if (lastResult==null)
		throw new NullPointerException();
	int answer = MenuBar.this.mmFileChooser.showOpenDialog(
			MenuBar.this.frame
	);
	if (answer==JFileChooser.APPROVE_OPTION) {
		try {
			File file = this.mmFileChooser.getSelectedFile();
			int mode = JOptionPane.showConfirmDialog(
					MenuBar.this.frame, 
					BABEL.getString("VIEWPOINT_IMPORT_WITH_ITEMS")
			);
			if (mode!=JOptionPane.CANCEL_OPTION) {
				this.portfolio.importToServer(
					file, 
					this.presenter.getService(),
					this.presenter.getActor(),
					mode==JOptionPane.YES_OPTION
				);
			}	
		} catch (Exception e) {
			this.frame.showException(e);
		}
	}
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

