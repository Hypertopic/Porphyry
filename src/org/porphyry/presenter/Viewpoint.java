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
import java.text.Collator;
import java.net.URL;

public class Viewpoint extends Observable {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

private final org.porphyry.model.Viewpoint model;
private final Map<URL,Topic> topics = new HashMap<URL,Topic>(); //cache
private final ItemSet allItems = new ItemSet();
private final Portfolio.Selection selection;
private static final Collator collator = Collator.getInstance();

public Viewpoint(URL url, Portfolio.Selection selection) {
	super();
	this.model = new org.porphyry.model.Viewpoint(url);
	this.selection = selection;
}

public String getName() {
	return this.model.getName();
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

public void createTopic(Collection<Topic> topics, String relationType)  
	throws Exception
{
	org.porphyry.model.Topic t = new org.porphyry.model.Topic(
		this.getURL().toString()+"topic/"
	);
	for (Topic relative : topics) {
		t.addRelatedTopic(relationType, relative.getURL().toString());
	}
	t.httpPostCreate();
	this.addTopic(t.getURL());
	for (Topic relative : topics) {
		relative.reload();
	}
	this.update();
}

public void destroyTopics(Collection<Topic> topicsToDestroy) throws Exception {
	Set<Topic> neighbors = new HashSet<Topic>();
	for (Topic t : topicsToDestroy) {
		neighbors.addAll(t.getTopics("includes"));
		neighbors.addAll(t.getTopics("includedIn"));
	}
	for (Topic t : topicsToDestroy) {
		t.model.httpDelete();
		this.topics.remove(t.getURL());
	}
	for (Topic t : neighbors) {
		if (!topicsToDestroy.contains(t)) {
			t.reload();
		}
	}
	this.update();
}

public class Topic extends Observable implements Comparable<Topic> {//>>>>>>>>>
//TODO remove from list when an error 404 is got?

private final org.porphyry.model.Topic model;
private final ItemSet allItems = new ItemSet();
private boolean includes;

public Topic(URL url) {
	this.model = new org.porphyry.model.Topic(url);
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

public void rename(String name)  throws Exception {
	this.model.setNameRemotely(name);
	Viewpoint.this.update();
}

public void unlinkFromParents() 
	throws Exception
{
	Collection<Topic> parents = this.getTopics("includedIn");
	Collection<URL> urls = new ArrayList<URL>();
	for (Topic t : parents) {
		urls.add(t.getURL());
	}
	this.model.removeRelatedTopicsRemotely("includedIn", urls);
	for (Topic t : parents) {
		t.reload();
	}
	Viewpoint.this.update();
}

public void link(Collection<Topic> topics)
	throws Exception
{
	Collection<URL> urls = new ArrayList<URL>();
	for (Topic t : topics) {
		urls.add(t.getURL());
	}
	this.model.addRelatedTopicsRemotely("includes", urls);
	for (Topic t : topics) {
		t.reload();
	}
	Viewpoint.this.update();	
}

public void linkItems(Collection<URL> items)  throws Exception {
	this.model.addEntitiesRemotely(items);
	Viewpoint.this.update();
}

public void unlinkItems(Collection<URL> items)  throws Exception {
	this.model.removeEntitiesRemotely(items);
	Viewpoint.this.update();
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

