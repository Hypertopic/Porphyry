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

package org.porphyry.presenter;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.text.Collator;
import java.net.URL;

import org.porphyry.model.LabeledURL;

public class Viewpoint extends Observable {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

private final org.porphyry.model.Viewpoint model;
private final Map<URL,Topic> topics = new HashMap<URL,Topic>(); //cache
private final ItemSet allItems = new ItemSet();
private final Portfolio.Selection selection;
private static final Collator collator = Collator.getInstance();
private static final Pattern topicIdPattern = 
	Pattern.compile(".*/topic/(.+)/");

public Viewpoint(URL url, Portfolio.Selection selection) {
	super();
	this.model = new org.porphyry.model.Viewpoint(url);
	this.selection = selection;
}

public String getName() {
	return this.model.getName();
}

protected String getEncodedName() {
	return org.porphyry.model.HyperTopicResource.encode(
		this.getName()
	);
}

public URL getURL() {
	return this.model.getURL();
}

public Collection<Topic> getUpperTopics() throws Exception {
	Collection<Topic> c = new ArrayList<Topic>();
	for (URL url : this.model.getUpperTopics()) {
		c.add(this.getTopic(url));
	}
	return c;
} 

public Topic getTopic(URL url) throws Exception {
	Topic t = this.topics.get(url);
	if (t==null) {
		t = this.addTopic(url);
	}
	return t;
} 

/**
* Use only if cache is full.
*/
public Collection<Topic> getAllTopics() {
	return new TreeSet<Topic>(this.topics.values());
}

protected Topic addTopic(URL url) throws Exception {
	Topic t = new Topic(url);
	this.topics.put(url, t);
	t.reload();
	return t;
}

public ItemSet getAllItems() {
	return (ItemSet) this.allItems.clone();
}

//doesn't recurse
public void computeAllItems() throws Exception {
	this.allItems.clear();
	for (Topic t : this.getUpperTopics()) { 
                this.allItems.addAll(
			t.getAllItems()
                );
        }
}

protected void reload() throws Exception {
	this.model.httpGet(false);
}

protected void update() throws Exception {
	this.reload();
	this.allItems.clear();
	for (Topic t : this.getUpperTopics()) { 
		t.computeAllItems();
		this.allItems.addAll(
				t.getAllItems()
		);
	}
	this.setChanged();
	this.notifyObservers();
	this.selection.updateSelectedItems();
}

public String export() throws Exception {
	final Set<Topic> visited = new HashSet<Topic>();
	String s = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n"
		+ "<!-- Created with Porphyry -->\n"
		+ "<map>\n"
		+ "<node TEXT=\"" + this.getEncodedName() + "\">\n";
	for (Topic t : this.getUpperTopics()) {
		s += t.export(visited); 
	}
	s += "</node>\n";
	return s + "</map>\n";
}

public class Topic extends Observable implements Comparable<Topic> {//>>>>>>>>>
//TODO remove from list when an error 404 is got?

private final org.porphyry.model.Topic model;
private final ItemSet allItems = new ItemSet();
private boolean includes;

public Topic(URL url) {
	this.model = new org.porphyry.model.Topic(url);
}

protected String getID() {
	Matcher matcher = 
		Viewpoint.topicIdPattern.matcher(this.getURL().toString());
	matcher.matches();
	return "topic_" + matcher.group(1);	
}

public String export(Set<Topic> visited) throws Exception {
	String s;
	if (visited.contains(this)) {
		s= "<arrowlink DESTINATION=\"" + this.getID() + "\"/>";
	} else {
		visited.add(this);
		s = "<node ID=\"" + this.getID() 
			+ "\" TEXT=\"" + this.getEncodedName(); 
		if (!this.getItems().isEmpty())	{
			s += "\" FOLDED=\"true"; 
		}
		s += "\">\n";
		for (Topic t : this.getTopics("includes")) {
			s += t.export(visited);
		}
		for (LabeledURL item : this.getItems()) {
			s += "<node LINK=\"" + item.getURL();
			if (item.getLabel()!=null) {
				s += "\" TEXT=\"" 
					+ org.porphyry.model.HyperTopicResource.encode(
							item.getLabel()
					);
			}
			s += "\"/>\n";
		}
		s += "</node>\n";
	}
	return s;
}

protected void reload() throws Exception {
	this.model.httpGet(true);
}

public URL getURL() {
	return this.model.getURL();
}

public URL getViewpointURL() {
	return Viewpoint.this.getURL();
}

public String getName() {
	return this.model.getName();
}

protected String getEncodedName() {
	return org.porphyry.model.HyperTopicResource.encode(
		this.getName()
	);
}

public Collection<Topic> getTopics(String relationType) throws Exception {
	Collection<Topic> c = new ArrayList<Topic>();
	for (URL url : this.model.getRelatedTopics(relationType)) {
		c.add(
			Viewpoint.this.getTopic(url)
		);
	}
	return c;
}

public void highlight(Object view) throws Exception {
	for(Topic t : this.getTopics("includes")) {
		t.includes=false;
		t.setChanged();
		t.notifyObservers(view);
	}
	for(Topic t : this.getTopics("includedIn")) {
		t.includes=true;
		t.setChanged();
		t.notifyObservers(view);
	}
}

public boolean includes() {
	return this.includes; //boolean is safe
}

public Collection<org.porphyry.model.LabeledURL> getItems() {
	return this.model.getEntities();
}

// recurse on subtopics
public void computeAllItems() throws Exception {
	this.allItems.clear();
	this.allItems.addAll(this.getItems());
        for (Topic topic: this.getTopics("includes")) { 
		topic.computeAllItems();
                this.allItems.addAll(
			topic.getAllItems()
                );
        }
}

public ItemSet getAllItems() {
	return (ItemSet) this.allItems.clone();
}

@Override
public int compareTo(Topic that) {
	int value = Viewpoint.collator.compare(
		this.getName(),
		that.getName()
	);
	if (value==0) {
		value = this.getURL().toString().compareTo(
			that.getURL().toString()
		);
	}
	return  value;
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< class Topic

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< class Viewpoint

