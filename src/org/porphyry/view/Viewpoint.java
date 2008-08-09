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
import java.awt.*;
import java.awt.event.*;
import java.beans.*;
import javax.swing.*;
import javax.swing.border.*;

public class Viewpoint extends ExtendedFrame implements 
	Observer, PropertyChangeListener {//>>>>>>>>>>>>>>>>>>

public static final int X_INTERVAL = 35;
public static final int Y_INTERVAL = 35;
public static final int X_ORIGIN = 5;
public static final int Y_ORIGIN = 5;
public static final Border DROP_LOCATION =
	new LineBorder(PorphyryTheme.PRIMARY_COLOR1, 2);

private final org.porphyry.presenter.Viewpoint presenter;

private ViewpointPane viewpointPane;
private JScrollPane scrollPane;

public Viewpoint(
	org.porphyry.presenter.Viewpoint presenter,
	org.porphyry.presenter.Portfolio presenterPortfolio, //TODO remove
	org.porphyry.view.Portfolio viewPortfolio //TODO cleaner
) throws Exception {
	super(BABEL.getString("VIEWPOINT")+": "+presenter.getName());
	this.setJMenuBar(new MenuBar(presenterPortfolio, this, viewPortfolio));
	this.presenter = presenter;
	this.viewpointPane = new ViewpointPane();
	this.scrollPane = new JScrollPane(
		this.viewpointPane,
		JScrollPane.VERTICAL_SCROLLBAR_ALWAYS, 
		JScrollPane.HORIZONTAL_SCROLLBAR_NEVER
	);
	this.setContentPane(this.scrollPane);
	KeyboardFocusManager.getCurrentKeyboardFocusManager()
		.addPropertyChangeListener("focusOwner", this);
	this.setSize(800,600);
	this.setVisible(true);
	this.presenter.addObserver(this);
}

public void propertyChange(PropertyChangeEvent e) {
	Object oldValue = e.getOldValue();
	if (oldValue instanceof ViewpointPane.Topic.TopicName) {
		((ViewpointPane.Topic.TopicName) oldValue).saveName();
	}
}

public void update(Observable o, Object arg) {
	this.viewpointPane.reload();
}

public void createIsolatedTopic() {
	try {
		this.presenter.createTopic(new ArrayList<org.porphyry.presenter.Viewpoint.Topic>(), "");
	} catch (Exception e) {
		this.showException(e);
	}
}

public void createTopic(String relationType) {
	try {
		this.presenter.createTopic(
			this.viewpointPane.getActiveTopics(), 
			relationType
		); 
		this.viewpointPane.clearActiveTopics();
	} catch (Exception e) {
		this.showException(e);
	}
}

public void destroyTopics() {
	try {
		this.presenter.destroyTopics(
			this.viewpointPane.getActiveTopics()
		); 
		this.viewpointPane.clearActiveTopics();
	} catch (Exception e) {
		this.showException(e);
	}
}

class ViewpointPane extends ScrollablePanel 
	implements Highlightable, MouseListener 
{//>>>>>>>>

public ViewpointPane() {
	super(Y_INTERVAL);
	this.setLayout(null);
	this.setBackground(Color.WHITE); 
	this.setTransferHandler(TopicsTransferHandler.getSingleton());
//	this.setDropTarget(new FixedDropTarget());
	try {
		this.getDropTarget().addDropTargetListener(
				new VisibleDropTargetListener()
		);
	} catch (TooManyListenersException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
	this.reload();
	this.setFocusable(true);
	this.addMouseListener(this);
	ActionMap actions = this.getActionMap();
	actions.put("TOPIC_PASTE", TransferHandler.getPasteAction());
}

@Override
public void mousePressed(MouseEvent e) {
	this.requestFocusInWindow();
	ViewpointPane.this.clearActiveTopics();
}

@Override
public void mouseReleased(MouseEvent e) {}

@Override
public void mouseClicked(MouseEvent e) {}

@Override
public void mouseEntered(MouseEvent e) {}

@Override
public void mouseExited(MouseEvent e) {}

protected void setHighlight(JComponent dropLocation, boolean highlight) {
	for (Component c : this.getComponents()) {
		((JComponent) c).setBorder(null);
	}
	this.setBorder(null);
	if (highlight) {
		dropLocation.setBorder(DROP_LOCATION);
	}
}

public void setHighlight(boolean highlight) {
	this.setHighlight(this, highlight);
}

@Override
public Dimension getPreferredSize() {
	int maxX = 0;
	int maxY = Viewpoint.this.scrollPane.getViewport().getHeight();
	for (Component c : this.getComponents()) {
		maxX = Math.max(
			maxX,
			c.getX()+c.getWidth()
		);
		maxY = Math.max(
			maxY,
			c.getY()+c.getHeight()
		);
	}
	return new Dimension(maxX, maxY);
}

protected void reload() {
	Collection<org.porphyry.presenter.Viewpoint.Topic> topicsToLoad =
		Viewpoint.this.presenter.getAllTopics();
	for (Component cachedTopic : this.getComponents()) {
		//TODO could be not a topic!
		if (topicsToLoad.contains(((Topic) cachedTopic).presenter)) {
			topicsToLoad.remove(((Topic) cachedTopic).presenter);
			cachedTopic.setLocation(0, 0);
		} else {
			this.remove(cachedTopic);
		}
	}
	for (org.porphyry.presenter.Viewpoint.Topic t : topicsToLoad) {
		this.add(new Topic(t));
	}
	this.revalidate();
}

@Override
public void doLayout() {
	try {
		for (Component c : this.getComponents()) {
			//TODO could be not a topic!
			c.setLocation(0,0);
		}
		this.layoutDAG();
	} catch (Exception e) { 
		Viewpoint.this.showException(e); 
	}
}

/**
 * Lays out the directed acyclic graph.
 * @author Aurelien Benel, 2000
 */
protected void layoutDAG() throws Exception {
	LinkedList<Topic> rows = new LinkedList<Topic>();
	for (Topic t : this.getUpperTopics()) {
		t.layoutSubDAG(X_ORIGIN, rows, 0);
	}
	for (int i=0; i<rows.size(); i++) {
		Topic t = rows.get(i);
		t.setY(Y_ORIGIN + i*Y_INTERVAL);
	}
}

protected Collection<org.porphyry.presenter.Viewpoint.Topic> getActiveTopics() {
	Collection<org.porphyry.presenter.Viewpoint.Topic> c = 
		new ArrayList<org.porphyry.presenter.Viewpoint.Topic>();
	for (Component t: this.getComponents()) {
		//TODO could be not a topic!
		if (((Topic)t).isActive()) {
			c.add(((Topic) t).presenter);
		}
	}
	return c;
}

protected void clearActiveTopics() {
	for (Component c: this.getComponents()) {
		//TODO could be not a topic!
		((Topic) c).setActive(false);
	}
}

public Topic getTopic(org.porphyry.presenter.Viewpoint.Topic  presenter) {
	Topic topic = null;
	boolean found = false;
	for (int i=0; i<this.getComponentCount() && !found; i++) {
		//TODO could be not a topic!
		topic = (Topic) this.getComponent(i);
		found = (topic.presenter==presenter); //same instance
	}
	return (found)?topic:null;
}

public Collection<Topic> getUpperTopics() throws Exception {
	Collection<Topic> c = new ArrayList<Topic>();
	for (org.porphyry.presenter.Viewpoint.Topic t : 
		Viewpoint.this.presenter.getUpperTopics()) 
	{
		c.add(this.getTopic(t));
	}
	return c;
}

public class Topic extends JPanel 
	implements MouseListener, Comparable<Topic>, 
	Highlightable, MouseMotionListener
{//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

final org.porphyry.presenter.Viewpoint.Topic presenter; //unsafe

private final JTextField textField = new TopicName();
private final JLabel bullet = 
	new JLabel(PorphyryTheme.LEAF_SYMBOL);
private int dragLength = 0;

public Topic(org.porphyry.presenter.Viewpoint.Topic presenter) {
	this.presenter = presenter;
	this.textField.setText(this.presenter.getName());
	this.add(this.bullet);
	this.add(this.textField);
	this.setLayout(new FlowLayout(FlowLayout.LEFT));
	this.setSize(this.getPreferredSize());
	this.setOpaque(false);
	this.setTransferHandler(TopicsTransferHandler.getSingleton());
	try {
		this.getDropTarget().addDropTargetListener(
				new VisibleDropTargetListener()
		);
	} catch (TooManyListenersException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
	this.addMouseListener(this);
	this.addMouseMotionListener(this);
	this.setFocusable(true);
	
	ActionMap actions = this.getActionMap();
	actions.put("TOPIC_CUT", TransferHandler.getCutAction());
	actions.put("TOPIC_COPY", TransferHandler.getCopyAction());
	actions.put("TOPIC_PASTE", TransferHandler.getPasteAction());
}

public  Collection<org.porphyry.presenter.Viewpoint.Topic> getActiveTopics() {
	return ViewpointPane.this.getActiveTopics();
}

@Override
public void mouseDragged(MouseEvent e) {
	if (this.dragLength>1) {
		JComponent source = (JComponent) e.getSource();
		source.getTransferHandler().exportAsDrag(
			 source, e, TransferHandler.MOVE
		);
	}
	this.dragLength++;
}

@Override
public void mouseMoved(MouseEvent e) {}

@Override
public void mousePressed(MouseEvent e) {
	this.dragLength = 0;
}

@Override
public void mouseReleased(MouseEvent e) {}

@Override
public void mouseClicked(MouseEvent e) {
	if ((e.getModifiers()&PorphyryTheme.SHORTCUT_KEY) == 0) {
		ViewpointPane.this.clearActiveTopics();
		this.setActive(true);
	} else {
		this.setActive(!this.isActive());
	}
}

@Override
public void mouseEntered(MouseEvent e) {}

@Override
public void mouseExited(MouseEvent e) {}

public void setActive(boolean active) {
	if (active) {
		this.textField.setBackground(PorphyryTheme.PRIMARY_COLOR2);
		this.textField.setForeground(Color.WHITE);
		this.requestFocusInWindow();
	} else {
		this.textField.setBackground(Color.WHITE);
		this.textField.setForeground(Color.BLACK);
	}
}

public boolean isActive() {
	return this.textField.getBackground() != Color.WHITE;
}

/**
 * Lays out the subgraph of a directed acyclic graph.
 * Note : Every node is visited once per father so that every constraint is 
 * considered.
 * @return currentRow for siblings
 * @author Aurelien Benel, 2000
 */
public int layoutSubDAG(int xMin, LinkedList<Topic> rows, int currentRow) 
	throws Exception 
{
	int newX = Math.max(this.getX(), xMin);
	this.setX(newX);
	if (rows.remove(this)) {
		currentRow--;
	}
	rows.add(this);
	newX += Viewpoint.X_INTERVAL;
	for (Topic t : this.getSpecificTopics()) {
		currentRow = t.layoutSubDAG(newX, rows, currentRow + 1);
	}
	return currentRow;
}

public void setX(int x) {
	this.setLocation(x, this.getY());
}

public void setY(int y) {
	this.setLocation(this.getX(), y);
}

public Collection<Topic> getSpecificTopics() throws Exception {
	Collection<Topic> topics = new TreeSet<Topic>();
	for (org.porphyry.presenter.Viewpoint.Topic t : this.presenter.getTopics("includes")) {
		topics.add(ViewpointPane.this.getTopic(t));
	}
	return topics;
}

@Override
public int compareTo(Topic that) {
	return this.presenter.compareTo(that.presenter);
}

@Override
public void setHighlight(boolean highlight) {
	ViewpointPane.this.setHighlight(this, highlight);	
}

public class TopicName extends JTextField implements FocusListener {//>>>>>>>>>

public TopicName() {
	super();
	this.addFocusListener(this);
	this.setTransferHandler(null);
//	this.setSelectionColor(PorphyryTheme.PRIMARY_COLOR2);
//	this.setSelectedTextColor(Color.WHITE);
}

@Override
public Dimension getPreferredSize() {
	return new Dimension(
		300,//Viewpoint.this.getWidth()/2,
		super.getPreferredSize().height
	);
}

public void saveName() { 
	try {
		if (!Topic.this.presenter.getName().equals(this.getText())) {
			this.setForeground(Color.RED);
			Topic.this.presenter.rename(this.getText());
			this.setForeground(Color.BLACK);
		}
	} catch (Exception e) { 
		System.err.println(e);
	}
}

@Override
public void focusGained(FocusEvent e) {
	ViewpointPane.this.clearActiveTopics();
	
}

@Override
public void focusLost(FocusEvent e) { }

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< class TopicName

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< class Topic

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< class ViewpointPane

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< class Viewpoint

