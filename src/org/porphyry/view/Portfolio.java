/*
PORPHYRY - Digital space for building and confronting interpretations about
documents

SCIENTIFIC COMMITTEE
- Andrea Iacovella
- Aurelien Benel

OFFICIAL WEB SITE
http://www.porphyry.org/

Copyright (C) 2006-2007 Aurelien Benel.

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

import java.awt.*;
import java.awt.event.*;
import java.util.*;
import java.net.*;
import javax.swing.*;
import javax.swing.border.*;
import javax.swing.event.*;
import org.porphyry.model.LabeledURL;
import org.porphyry.presenter.ItemSet;

public class Portfolio extends ExtendedFrame {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

private final org.porphyry.presenter.Portfolio presenter;

private final ViewpointsPane viewpointsPane;
private final ItemsPane itemsPane;
private final JSplitPane splitPane;

private boolean isLoading = false;

protected static final int FRAGMENT_TAB = 0;
protected static final int SOURCE_TAB = 1;

private static Portfolio instance;

public static Portfolio getInstance() {
	if (instance==null) {
		instance = new Portfolio();
	}
	return instance;
}

protected Portfolio() {
	super(BABEL.getString("PORTFOLIO"));
	
	this.presenter = new org.porphyry.presenter.Portfolio();

	this.viewpointsPane = new ViewpointsPane();
	this.itemsPane = new ItemsPane();
	this.splitPane = new JSplitPane( 
		JSplitPane.HORIZONTAL_SPLIT, 
		this.viewpointsPane, 
		this.itemsPane
	);
	this.setContentPane(this.splitPane);
	this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
	MenuBar menu = new MenuBar(this.presenter, this, this);

	this.setJMenuBar(menu);
	this.setSize(800,600);
	this.setVisible(true);
}

public void handleURL(String url) {
	try {
		org.porphyry.model.HyperTopicResource.NodeType nodeType = 
			org.porphyry.model.HyperTopicResource.getNodeType(url);
		switch (nodeType) {
			case VIEWPOINT:
				Object[] v1 = {new LabeledURL(url, "")};
				this.openViewpoints(v1);
				break;
			case TOPIC:
				URL topic = new URL(url);
				URL viewpoint = new URL(topic, "../..");
				Object[] v2 = {
					new LabeledURL(viewpoint.toString(), "")
				};
				this.openViewpoints(v2);
				this.presenter.resetSelect(viewpoint, topic);	
				break;			
			//TODO other types (attribute value...)
			default:
				this.presenter.setService(url);	
		}
	} catch (Exception e) {
		Portfolio.this.showException(e);
	}
}

public void openViewpoints(Object[] labeledURLs) throws Exception {
	ViewpointsLoader loader = new ViewpointsLoader(
		this.presenter.openViewpoints(labeledURLs)
	);
	loader.execute();
}

class ViewpointsPane extends Box implements Observer {//>>>>>>>>>>>>>>>>>>>>>>>

public ViewpointsPane() {
	super(BoxLayout.Y_AXIS);
	this.setMinimumSize(new Dimension(0,0));
	Portfolio.this.presenter.addObserver(this);
}

public void update(Observable obs, Object arg) {
	this.removeAll();
	Portfolio.this.splitPane.setDividerLocation(0.4);
	for (org.porphyry.presenter.Viewpoint v :
		Portfolio.this.presenter.getAllViewpoints()) 
	{
		this.add(
			Box.createRigidArea(new Dimension(1,1))
		);
		this.add(new Viewpoint(v));
	}
}

class Viewpoint extends Box implements Observer {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>

private org.porphyry.presenter.Viewpoint presenter;

private JLabel label = new JLabel();

private JLayeredPane graphPane = new JLayeredPane() {
	@Override
	public void doLayout() {
		Viewpoint.this.nodePane.setSize(this.getSize());
	}
};

private JPanel nodePane = new JPanel() {
	@Override
	public void doLayout() {
		super.doLayout();
		for(Component c : Viewpoint.this.graphPane.getComponentsInLayer(1)) {
			c.doLayout();
		}
	}
};

public Viewpoint(org.porphyry.presenter.Viewpoint presenter) {
	super(BoxLayout.Y_AXIS);
	this.presenter = presenter;
	this.label.setText(this.presenter.getName());
	this.label.setForeground(Color.WHITE); 
	this.label.setOpaque(true);
	this.label.setMaximumSize(
		new Dimension(
			Integer.MAX_VALUE,
			this.label.getMaximumSize().height
		)
	);
	this.label.setCursor(
		new Cursor(Cursor.HAND_CURSOR)
	);
	this.label.addMouseListener(
		new MouseAdapter() {
			@Override
			public void mouseClicked(MouseEvent e) {
				if (e.getButton()==MouseEvent.BUTTON1) { 
					Viewpoint.this.switchClosure();
				} else {
					//TODO Viewpoint Popup
				}
			}
		}
	);
	this.label.setAlignmentX(Component.CENTER_ALIGNMENT);
	this.add(this.label);
	this.nodePane.setOpaque(false);
	this.graphPane.add(this.nodePane, new Integer(0));
	this.add(this.graphPane);
	this.reload();
	this.open();
	this.presenter.addObserver(this);
}

public void update(Observable obs, Object arg) {
	this.reload();
	this.revalidate();//TODO refactor
}

public String getURL() {
	return this.presenter.getURL().toString();
}

public void switchClosure() {
	if (this.graphPane.isVisible()) {
		this.close();
	} else {
		this.open();
	}
}

public void open() {
	this.graphPane.setVisible(true);
	this.label.setBackground(PorphyryTheme.PRIMARY_COLOR1);//TODO LnF
	this.setBorder(new LineBorder(PorphyryTheme.PRIMARY_COLOR1, 2));//TODO LnF
}

public void close() {
	this.graphPane.setVisible(false);
	this.label.setBackground(Color.GRAY);//TODO LnF
	this.setBorder(new LineBorder(Color.GRAY, 2));//TODO LnF
}

public void reload() {
	try {
		this.nodePane.removeAll();
		for (org.porphyry.presenter.Viewpoint.Topic t : 
			this.presenter.getAllTopics()) 
		{
			if (!t.getAllItems().isEmpty()) {
				this.add(new Topic(t.getURL()));
			}
		}
	} catch (Exception e) {
		//Should never go there
		e.printStackTrace();
	}
}

public void add(Topic topic) {
	this.nodePane.add(topic);
}

public void add(Topic.Inclusion inclusion) {
	this.graphPane.add(inclusion, new Integer(1));
}

public Topic getTopic(URL url) throws Exception {//TODO precise exception
	Topic topic = null;
	boolean found = false;
	for (int i=0; i<this.nodePane.getComponentCount() && !found; i++) {
		topic = (Topic) this.nodePane.getComponent(i);
		found = url.equals(topic.getURL());
	}
	if (!found) throw new Exception("URL not found in memory: "+url);
	return topic;
}

class Topic extends JLabel implements Observer, MouseListener {//>>>>>>>>>>>>>>

private static final int MAX_FONT_GROWTH = 20;
private static final int MIN_FONT_SIZE = 10;
private static final int NULL_FONT_SIZE = 5;
private final Border MARGINS = new EmptyBorder(0, 3, 0, 3);

private double ratio = 0;

private org.porphyry.presenter.Viewpoint.Topic presenter;

private final Inclusion inclusion = new Inclusion();

public Topic(URL url) throws Exception {
	this.presenter = Viewpoint.this.presenter.getTopic(url);
	this.setText(this.presenter.getName());
	this.setBorder(this.MARGINS);
	this.setCursor(
		new Cursor(Cursor.HAND_CURSOR)
	);
	Viewpoint.this.add(this.inclusion);
	this.addMouseListener(this);
	Portfolio.this.presenter.addObserverToSelection(this);
	this.presenter.addObserver(this);
}

//Implement MouseListener
public void mouseEntered(MouseEvent event) {
	try {
		this.setForeground(PorphyryTheme.PRIMARY_COLOR1);
		if (this.ratio==0) {
			this.setToolTipText(this.getText());
		}
		this.presenter.highlight(this);
	} catch (Exception e) {
		Portfolio.this.showException(e);
	}
}

//Implement MouseListener
public void mouseExited(MouseEvent event) {
	try {
		this.updateFontAndColor();
		this.setToolTipText(null);
		this.presenter.highlight(null);
	} catch (Exception e) {
		Portfolio.this.showException(e);
	}
}

//Implement MouseListener
public void mouseClicked(MouseEvent e) {
	if (!Portfolio.this.isLoading) {
		if ((e.getModifiers()&PorphyryTheme.SHORTCUT_KEY)!=0) {
			Portfolio.this.presenter.toggleSelect(this.presenter);
		} else {
			Portfolio.this.presenter.resetSelect(this.presenter);	
		}
	}
}

//Implement MouseListener
public void mouseReleased(MouseEvent e) {}
public void mousePressed(MouseEvent e) {}

//Implement Observer
public void update(Observable observable, Object argument) {
	if (observable instanceof org.porphyry.presenter.Viewpoint.Topic) {
		if (argument instanceof Topic) {
			this.inclusion.draw((Topic) argument);
		} else {
			this.inclusion.setVisible(false);
		}
	} else { //instanceof org.porphyry.presenter.Portfolio.Selection
		this.updateBackground();
		this.updateFontAndColor();
	}
}

public void updateBackground() {
	if (Portfolio.this.presenter.containsInSelection(this.presenter)) {
		this.setOpaque(true);
		this.setBackground(PorphyryTheme.PRIMARY_COLOR2);
	} else {
		this.setOpaque(false);
		this.setBackground(null);
	}
}

public void updateFontAndColor() {
	this.ratio = Portfolio.this.presenter.getRatio(this.presenter);
	this.setFont(
		new Font( 
			null, 
			Font.BOLD, 
			(int) Math.round( 
				(this.ratio==0) ? NULL_FONT_SIZE
				: MIN_FONT_SIZE-1+MAX_FONT_GROWTH*this.ratio
			)
		)
	);
	this.setForeground(
		(this.ratio==0)? PorphyryTheme.LIGHT_GRAY 
		: (this.ratio==1)? Color.BLACK 
		: PorphyryTheme.DARK_GRAY 
	);
}

protected Point getAnchor() {
	Rectangle bounds = this.getBounds();
	return new Point(
		bounds.x + bounds.width/2,
		bounds.y + bounds.height/2
	);
}

public URL getURL() {
	return this.presenter.getURL();
}

@Override
public String toString() {
	return this.presenter.getName()+" "+this.presenter.getURL();
}

class Inclusion extends Arrow {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	
private Topic source;

private Topic destination;

public Inclusion() {
	this.setVisible(false);
	this.setForeground(PorphyryTheme.PRIMARY_COLOR1);
}

@Override
public boolean contains(int x, int y) {
	return false;
}

public void draw(Topic other) {
	if (Topic.this.presenter.includes()) {
		this.source = Topic.this;
		this.destination = other;
	} else {
		this.source = other;
		this.destination = Topic.this;
	}
	this.setVisible(true);
}

@Override
public Point getSource() {
	return this.source.getAnchor();
}

@Override
public Point getDestination() {
	return this.destination.getAnchor();
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< class Inclusion

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< class Topic

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< class Viewpoint

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< class ViewpointsPane

class ItemsPane extends JTabbedPane implements Observer {//>>>>>>>>>>>>>>>>>>>>

public ItemsPane() {
	super(JTabbedPane.BOTTOM);
	this.add(
		new EntityLevel(BABEL.getString("FRAGMENTS")), 
		FRAGMENT_TAB
	); 
	this.add(
		new EntityLevel(BABEL.getString("SOURCES")), 
		SOURCE_TAB
	); 
	this.setSelectedIndex(SOURCE_TAB);
	this.addChangeListener(
		new ChangeListener() {
			public void stateChanged(ChangeEvent e) {
				int tab = ItemsPane.this.getSelectedIndex();
				Portfolio.this.presenter.setLevel(
					(tab==0)?ItemSet.FRAGMENT
					:(tab==1)?ItemSet.SOURCE
					:Portfolio.this.itemsPane.getTabCount()-tab-1
				);
			}
		}
	);
	this.updateTabNames();
	Portfolio.this.presenter.addObserverToSelection(this);
}

public void update(Observable o1, Object level) {
	if (level==null) {
		Set<LabeledURL> selectedItems = 
			Portfolio.this.presenter.getSelectedItems();
		for (Component cachedEntity : this.getEntities()) {
			LabeledURL url = ((Entity) cachedEntity).getURL();
			cachedEntity.setVisible(
				selectedItems.remove(url)
			);
		} 
		try {
			ItemsLoader loader = new ItemsLoader(selectedItems); 
			loader.execute();
		} catch (Exception e) {
			Portfolio.this.showException(e);
		}
	}
}

protected EntityLevel getEntityLevel(int level) {
	return (EntityLevel) this.getComponentAt(level);
}

public void updateTabNames() {
	for (int i=0; i<this.getTabCount(); i++) {
		this.setTitleAt(
			i,
			this.getEntityLevel(i).getTitle()
		);
	}
}

public Collection<Component> getEntities() {
	ArrayList<Component> l = new ArrayList<Component>(); 
	for (int i=0; i<this.getTabCount(); i++) {
		l.addAll(
			this.getEntityLevel(i).getEntities()
		);
	}
	return l;
}

public void addEntity(LabeledURL itemURL) throws Exception {
	Entity item = new Entity(itemURL);
	String urlString = itemURL.getURL().toString();
	int tab = 0;
	switch (org.porphyry.model.Entity.getDocumentType(urlString)) {
		case FRAGMENT :
			tab = FRAGMENT_TAB;
			break;
		case SOURCE :
			tab = SOURCE_TAB;
			break;
		case FOLDER :
			int level = org.porphyry.model.Entity.getLevel(urlString);
			int missingTabs = level+2-this.getTabCount();
			for (int i=0; i<missingTabs; i++) {
				this.insertTab(
					null, 
					null, 
					new EntityLevel(BABEL.getString("FOLDERS")), 
					null,
					SOURCE_TAB+1
				);
			}
			tab = this.getTabCount()-level;
	}
	this.getEntityLevel(tab).add(item);
}

class EntityLevel extends JScrollPane {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

private final ScrollablePanel panel = new ScrollablePanel(105);

private final String type;

public EntityLevel(String type) {
	super(VERTICAL_SCROLLBAR_AS_NEEDED, HORIZONTAL_SCROLLBAR_NEVER);
	this.type = type;
	this.panel.setBackground(Color.WHITE); 
	this.panel.setLayout(new WrapLayout());
	this.setViewportView(this.panel);
}

protected int getEntitiesCount() {
	int count=0;
	Component[] cachedEntities = 
			this.panel.getComponents();
	for (Component c : cachedEntities) {
		if (c.isVisible()) {
			count++;
		}
	}
	return count;
}

public String getTitle() {
	return this.type + " ("+this.getEntitiesCount()+")"; //TODO i18n
}

public Collection<Component> getEntities() {
	return Arrays.asList(	
		((Container) this.panel).getComponents()
	);
}

public void add(Entity entity) {
	this.panel.add(entity);
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< class EntityLevel

class Entity extends JLabel implements MouseListener {//>>>>>>>>>>>>>>>>>>>>>>>
	
private LabeledURL url;

private java.util.regex.Pattern pattern = 
	java.util.regex.Pattern.compile("^.*/entity/(.*)$"); //static?

private final Border unactiveBorder = 
	new EmptyBorder(2, 2, 2, 2); //static?

private final Border activeBorder = 
	new LineBorder(PorphyryTheme.PRIMARY_COLOR2, 2); //static?

public Entity(LabeledURL labeledURL) throws Exception {
	super(); 
	this.url = labeledURL;
	java.util.regex.Matcher key = this.pattern.matcher(labeledURL.getURL().toString());
	key.matches(); 
	this.setToolTipText(key.group(1));
	String label = labeledURL.getLabel();
	if (label==null || "".equals(label)) {
		org.porphyry.model.Entity model = new org.porphyry.model.Entity(labeledURL.getURL());
		model.httpGet(false);
		URL thumbnail = model.getResource("thumbnail");
		if (thumbnail!=null) {
			this.setIcon(new ImageIcon(thumbnail));
		} else {
			java.util.List<String> names = model.getValues("name");
			label = (names.isEmpty())
				? key.group(1)
				: names.get(0);
		}
	}
	this.setText(label);
	this.setBorder(this.unactiveBorder);
	this.setCursor(
		new Cursor(Cursor.HAND_CURSOR)
	);
	this.setFont(
		new Font(Font.MONOSPACED, Font.PLAIN, this.getFont().getSize())
	);
	this.addMouseListener(this);
}

public LabeledURL getURL() {
	return this.url;
}

@Override
public void mouseEntered(MouseEvent e) {
	this.setBorder(this.activeBorder);
}

@Override
public void mouseExited(MouseEvent e) {
	this.setBorder(this.unactiveBorder);
}

@Override
public void mouseClicked(MouseEvent e) {
	try {
		org.porphyry.model.Entity model = 
			new org.porphyry.model.Entity(this.url.getURL());
		model.httpGet(false);
		URL source = model.getResource("highlight");
		if (source==null) {
			source = model.getResource("source");
		}			
		if (source!=null) {
			Desktop.getDesktop()
				.browse(source.toURI());
		}
	} catch (Exception ex) {
		Portfolio.this.showException(ex);
	}
}

@Override
public void mousePressed(MouseEvent e) {}

@Override
public void mouseReleased(MouseEvent e) {}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< class Entity

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< class ItemsPane

class ViewpointsLoader extends SwingWorker<Object,Object> {//>>>>>>>>>>>>>>>>>>

private final Collection<org.porphyry.presenter.Viewpoint> viewpoints;

private final Collection<org.porphyry.presenter.Viewpoint.Topic> todo = 
	new ArrayList<org.porphyry.presenter.Viewpoint.Topic>();

public ViewpointsLoader(Collection<org.porphyry.presenter.Viewpoint> viewpoints) {
	super();
	this.viewpoints = viewpoints; 
	try {
		for (org.porphyry.presenter.Viewpoint v : this.viewpoints) {
			this.todo.addAll(v.getUpperTopics());
		}
		Portfolio.this.showProgressMonitor(
			BABEL.getString("LOADING_TOPICS"),
			this.todo.size()
		);
	} catch (Exception e) {
		Portfolio.this.showException(e);
	}
}

@Override
public Object doInBackground() {
	try {
		for (org.porphyry.presenter.Viewpoint.Topic t : this.todo) {
			Portfolio.this.setProgress(t.getName());
			t.computeAllItems();
		}
		Portfolio.this.setProgress("");
	} catch (Exception e) {
		Portfolio.this.showException(e);
	}
	return null;
}

@Override
protected void done() {
	try {
		for (org.porphyry.presenter.Viewpoint v : this.viewpoints) {
			v.computeAllItems();
		}
		Portfolio.this.presenter.notifyObservers();
		Portfolio.this.presenter.updateSelectedItems();
	} catch (Exception e) {
		Portfolio.this.showException(e);
	}
	
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< class ViewpointsLoader

class ItemsLoader extends SwingWorker<Object,Object> {//>>>>>>>>>>>>>>>>>>>>>>>

private final Set<LabeledURL> nonCachedEntities;

public ItemsLoader(Set<LabeledURL> nonCachedEntities) {
	super();
	this.nonCachedEntities = nonCachedEntities;
	Portfolio.this.showProgressMonitor(
		BABEL.getString("LOADING_THUMBNAILS"),
		nonCachedEntities.size()
	);
	Portfolio.this.isLoading = true;
}

@Override
public Object doInBackground() {
	try {
		for (LabeledURL nonCachedEntity : this.nonCachedEntities) {
			Portfolio.this.setProgress(nonCachedEntity.toString());
			Portfolio.this.itemsPane.addEntity(nonCachedEntity);
		}
		Portfolio.this.setProgress("");
	} catch (Exception e) {
		Portfolio.this.showException(e);
	}
	return null;
}

@Override
protected void done() {
	Portfolio.this.itemsPane.updateTabNames();
	Portfolio.this.isLoading = false;
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< class ItemsLoader

public static void main(String args[]) {
	final int PORT = 10101;
	final String MESSAGE = (args.length==0) 
		? "http://" 
		: (args[0]);
	final SingleInstance porphyry = new SingleInstance(PORT, MESSAGE) {
		@Override public void runOnReceive() {
			Portfolio portfolio = Portfolio.getInstance();
			if(!portfolio.isVisible()) 
				portfolio.setVisible(true);
			portfolio.toFront(); 
			portfolio.handleURL(this.getMessage());
		}
	};
	if (porphyry.isUnique()) {
		PorphyryTheme.use();
		Portfolio portfolio = Portfolio.getInstance();
		portfolio.handleURL(MESSAGE);
	}
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< class Portfolio
