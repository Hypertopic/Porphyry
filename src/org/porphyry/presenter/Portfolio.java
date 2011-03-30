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

package org.porphyry.presenter;

import java.util.*;
import java.net.*;
import org.porphyry.model.LabeledURL;

public class Portfolio extends Observable {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

private Map<URL,Viewpoint> viewpoints = new HashMap<URL,Viewpoint>();
private Selection selection;

private String service;
private URL actor;

public Portfolio() {
	super();
	this.service = "http://";
	this.selection = new Selection();
}

public void addObserverToSelection(Observer o) {
	this.selection.addObserver(o);
}

public void toggleSelect(Viewpoint.Topic t) {
	this.selection.toggleSelect(t);
}

public void resetSelect(Viewpoint.Topic t) {
	this.selection.resetSelect(t);
}

public void resetSelect(URL viewpoint, URL topic) throws Exception {//TODO cleaner?
	Viewpoint v = this.viewpoints.get(viewpoint); 
	Viewpoint.Topic t = v.getTopic(topic);
	this.selection.resetSelect(t);
}

public boolean containsInSelection(Viewpoint.Topic t) {
	return this.selection.contains(t);
}

public double getRatio(Viewpoint.Topic t) {
	return this.selection.getRatio(t);
}

public Set<LabeledURL> getSelectedItems() {
	return this.selection.selectedItems.getAll();
}

public void updateSelectedItems() {
	this.selection.updateSelectedItems();
}

public void setLevel(int level) {
	this.selection.setLevel(level);
}

@Override
public void notifyObservers() {
//	System.out.print("<Portfolio>");//DEBUG
	super.notifyObservers();
//	System.out.println("</Portfolio>");//DEBUG
}

public void setService(String service) {
        this.service = service;
}

public String getService() {
        return (this.service!=null)?this.service:"";
}

public void setActor(URL actor) {
        this.actor = actor;
}

public URL getActor() {
        return this.actor;
}

// Shallow copy
public Collection<Viewpoint> getAllViewpoints() {
	return new ArrayList<Viewpoint>(this.viewpoints.values());
}

protected void removeViewpoint(URL url) {
	this.viewpoints.remove(url);
	this.setChanged();
}

protected Viewpoint addViewpoint(URL url) throws Exception {
	Viewpoint v = new Viewpoint(url, this.selection);
	v.reload();
	this.viewpoints.put(v.getURL(), v);
	this.setChanged();
	return v;
}

/**
* @param viewpoints LabeledURL[]
* After opening those viewpoints:
* 1- compute all items of upper topics (it fills the cache in the meantime),
* 2- compute all items of viewpoints (not recursively),
* 3- compute all items of the selection,
* 3- notify observers of the portfolio.
* It is recommended to do that in a SwingWorker.
*/
public Collection<Viewpoint> openViewpoints(
	Object[] viewpointsArray
) 
	throws Exception 
{
	Collection<Viewpoint> c = new ArrayList<Viewpoint>();
	for (Object l : viewpointsArray) {
		URL url = ((LabeledURL) l).getURL();
		if (!this.viewpoints.containsKey(url)) {
			Viewpoint v = this.addViewpoint(url);
			c.add(v);
		}
	}
	return c;
}

public void closeViewpoint(URL url) {
	this.removeViewpoint(url);
	this.notifyObservers();
	this.selection.unselectTopicsFromViewpoint(url);
}

public class Selection extends Observable {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

private final Collection<Viewpoint.Topic> selectedTopics = 
	new ArrayList<Viewpoint.Topic>();
private ItemSet selectedItems;
private int level = ItemSet.SOURCE;

public Selection() {
	super();
}

public boolean contains(Viewpoint.Topic t) {
	return this.selectedTopics.contains(t);
}

public void toggleSelect(Viewpoint.Topic t) {
	if (this.contains(t)) {
		this.selectedTopics.remove(t);
	} else {
		this.selectedTopics.add(t);
	}
	this.updateSelectedItems();
}

public void unselectTopicsFromViewpoint(URL url) {
	Iterator <Viewpoint.Topic> i = this.selectedTopics.iterator();
	while (i.hasNext()) {
		if (i.next().getViewpointURL().equals(url)) {
			i.remove();
		}
	} 
	this.updateSelectedItems();
}

public void resetSelect(Viewpoint.Topic t) {
	this.selectedTopics.clear();
	this.selectedTopics.add(t);
	this.updateSelectedItems();
}

public void updateSelectedItems() {
	if (this.selectedTopics.isEmpty()) {
		this.selectedItems = new ItemSet();
		for (Viewpoint v : Portfolio.this.getAllViewpoints()) {
			this.selectedItems.addAll(v.getAllItems());
		}
	} else {
		Iterator<Viewpoint.Topic> i = this.selectedTopics.iterator();
		this.selectedItems = i.next().getAllItems();
		while (i.hasNext()) {
			this.selectedItems.retainAll(i.next().getAllItems());
		}
	}
	this.setChanged();
//	System.out.print("<Selection>");//DEBUG
	this.notifyObservers();
//	System.out.println("</Selection>");//DEBUG
}

public double getRatio(Viewpoint.Topic topic) {
	double ratio = 0;
	double globalSize = this.selectedItems.size(this.level);
	if (globalSize!=0) {
		ItemSet localSet = topic.getAllItems();
		localSet.retainAll(this.selectedItems);
		ratio = localSet.size(this.level) / globalSize;
	}
	return ratio;
}

public void setLevel(int level) {
	this.level = level;
	this.setChanged();
//	System.out.print("<Level>");//DEBUG
	this.notifyObservers(level);
//	System.out.println("</Level>");
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< class Selection

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< class Portfolio
