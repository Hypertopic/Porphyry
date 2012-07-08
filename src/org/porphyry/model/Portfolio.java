/*
PORPHYRY - Digital space for confronting interpretations about documents

OFFICIAL WEB SITE
http://porphyry.sf.net/

Copyright (C) 2011-2012 Aurelien Benel.

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

package org.porphyry.model;

import org.hypertopic.*;
import org.json.*;
import java.util.*;

/**
 * Represents the state of the application 
 * (opened corpora and viewpoints, selected topics)
 */
public class Portfolio extends Observable implements Observer {//>>>>>>>>>>>>>>>

private final HypertopicMap map;
private final Collection<HypertopicMap.Viewpoint> openedViewpoints = 
	new HashSet();
private final Collection<HypertopicMap.Corpus> openedCorpora = 
	new HashSet();
private final Collection<HypertopicMap.Viewpoint.Topic> selectedTopics =
	new HashSet(); 
private ItemSet cache;
private String user;

//TODO HypertopicMap.Corpus.Attribute.Value selectedValues

public Portfolio(String user, String... services) {
	this.map = new HypertopicMap(services);
	this.user = user;
	this.map.addObserver(this);
}

@Override public synchronized void update(Observable o, Object arg) {
	this.invalidateCache();
	this.notifyObservers();
}

protected void invalidateCache() {
	this.setChanged();
	this.cache = null;
}

//TODO addSecondary ?
//TODO removeSecondary ?
//TODO getURLs ?

public Collection<JSONObject> listCorpora(String userID) throws Exception {
	return this.map.getUser(userID).listCorpora(); 
}

public void openCorpus(String corpusID) {
	this.openedCorpora.add(
		this.map.getCorpus(corpusID)
	);
	this.invalidateCache();
}

public void closeCorpus(String corpusID) {
	this.openedCorpora.remove(
		this.map.getCorpus(corpusID)
	);
	this.invalidateCache();
}

//TODO cache?
public Collection<JSONObject> listRelatedViewpoints() throws Exception {
	Set<String> identifiers = new HashSet();
	for (HypertopicMap.Corpus c : this.openedCorpora) {
		for (HypertopicMap.Corpus.Item i : c.getItems()) {
			for (HypertopicMap.Viewpoint.Topic t : i.getTopics()) {
				identifiers.add(t.getViewpointID());	
			}
			for (
				HypertopicMap.Corpus.Item.Highlight h : 
				i.getHighlights()
			) {
				identifiers.add(h.getTopic().getViewpointID());	
			}
		}
	}
	Collection<JSONObject> result = new ArrayList();
	for (String id : identifiers) {
		//TODO request name
		result.add(new JSONObject("{\"id\":\""+id+"\",\"name\":\""+id+"\"}"));
	}
	return result;
}

public void openViewpoint(String viewpointID) {
	this.openedViewpoints.add(
		this.map.getViewpoint(viewpointID)
	);
	this.invalidateCache();
}

public void closeViewpoint(String viewpointID) {
	this.openedViewpoints.remove(
		this.map.getViewpoint(viewpointID)
	);
	Iterator<HypertopicMap.Viewpoint.Topic> t = 
		this.selectedTopics.iterator();
	while (t.hasNext()) {
		if (t.next().getViewpointID().equals(viewpointID)) {
			t.remove();
		}
	}
	this.invalidateCache();
}

public void toggleTopic(String viewpointID, String topicID) {
	HypertopicMap.Viewpoint.Topic topic = 
		this.map.getViewpoint(viewpointID).getTopic(topicID);
	if (this.selectedTopics.contains(topic)) {
		this.selectedTopics.remove(topic);
	} else {
		this.selectedTopics.add(topic);
	}
	this.invalidateCache();
}

public ItemSet getSelectedItemSet() throws Exception {
	if (this.cache==null) {
		Iterator<HypertopicMap.Viewpoint.Topic> t = 
			this.selectedTopics.iterator(); 
		if (t.hasNext()) {
			HypertopicMap.Viewpoint.Topic topic = t.next();
			this.cache = new ItemSet(topic);
			while (t.hasNext()) {
				topic = t.next();
				this.cache.retainAll(
					new ItemSet(topic)
				);
			}
		} else {
			this.cache = new ItemSet();
			for (HypertopicMap.Corpus c : this.openedCorpora) {
				this.cache.addAll(
					new ItemSet(c)
				);
			}
		}
	}
	return this.cache;
}

public Collection<Viewpoint> getViewpoints() throws Exception {
	Collection<Viewpoint> result = new ArrayList();
	for (HypertopicMap.Viewpoint v : this.openedViewpoints) {
		result.add(
			new Viewpoint(v)
		);
	}
	return result;
}

public Set<Viewpoint.Topic> getTopics() throws Exception { 
	Set<Viewpoint.Topic> result = new TreeSet();
	for (HypertopicMap.Viewpoint v : this.openedViewpoints) {
		result.addAll(new Viewpoint(v).getTopics());
	}
	return result;
}

public String getUser() {
	return this.user;
}

public void setUser(String user) {
	this.user = user;
}

public class Viewpoint {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

private final HypertopicMap.Viewpoint data;

public Viewpoint(HypertopicMap.Viewpoint data) {
	this.data = data; // TODO copy data instead?
}

public String getID() {
	return this.data.getID();
}

public String getName() throws Exception {
	return this.data.getName();
}

public Collection<String> listUsers() throws Exception {
	return this.data.listUsers();
}

public Set<Topic> getTopics() throws Exception { 
	Set<Topic> result = new TreeSet();
	ItemSet globalSet = Portfolio.this.getSelectedItemSet();
	int globalItemsCount = globalSet.countItems();
	int globalHighlightsCount = globalSet.countHighlights(); //TODO cache?
	for (HypertopicMap.Viewpoint.Topic t : this.data.getTopics()) {
		ItemSet localSet = new ItemSet(t);
		localSet.retainAll(globalSet);
		result.add(
			new Topic(
				t.getID(),
				t.getName(),
				localSet,
				globalItemsCount,
				globalHighlightsCount
			)
		);
	}
	return result;
}

public class Topic implements Comparable<Topic> {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

private String topicID;
private final String name;
private final double ratio[] = {0, 0};

public Topic(
	String topicID,
	String name,
	ItemSet localSet,
	int globalItemsCount, 
	int globalHighlightsCount
) {
	this.topicID = topicID;
	this.name = name;
	this.ratio[0] = 
		ratio(localSet.countItems(), globalItemsCount);
	this.ratio[1] = 
		ratio(localSet.countHighlights(), globalHighlightsCount);
}

protected double ratio(double p, double q) {
	return (q==0)? 0 : p/q;
}

public double getRatio(int level) {
	return this.ratio[level];
}

public String getName() {
	return this.name;
}

public boolean isSelected() {
  return Portfolio.this.selectedTopics.contains(
		Portfolio.this.map.getViewpoint(Viewpoint.this.getID())
      .getTopic(this.topicID)
  );
}

public String getID() {
	return this.topicID;
}

public Viewpoint getViewpoint() {
	return Viewpoint.this;
}

public Portfolio getPortfolio() {
	return Portfolio.this;
}

@Override public int compareTo(Topic that) {
	return (this.name==null)
    ? -1 
    : (that.name==null)
      ? 1 
      : this.name.compareTo(that.name);
}

@Override public String toString() {
	return this.name + "(" + this.ratio[0] + "," + this.ratio[1] + ")";
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Topic

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Viewpoint

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Portfolio
