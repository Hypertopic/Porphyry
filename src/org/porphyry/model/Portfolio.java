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

//TODO HypertopicMap.Corpus.Attribute.Value selectedValues

public Portfolio(String primaryService, String... secondaryServices) {
	this.map = 
		new DistributedHypertopicMap(primaryService, secondaryServices);
	this.map.addObserver(this);
}

public void update(Observable o, Object arg) {
	this.setChanged();
	this.cache = null;
	this.notifyObservers();
}

//TODO addSecondary ?
//TODO removeSecondary ?

public Collection<JSONObject> listCorpora(String userID) throws Exception {
	return this.map.getUser(userID).listCorpora(); 
}

public void openCorpus(String corpusID) {
	this.openedCorpora.add(
		this.map.getCorpus(corpusID)
	);
	this.cache = null;
}

public void closeCorpus(String corpusID) {
	this.openedCorpora.remove(
		this.map.getCorpus(corpusID)
	);
	this.cache = null;
}


//TODO related viewpoints?

public void openViewpoint(String viewpointID) {
	this.openedViewpoints.add(
		this.map.getViewpoint(viewpointID)
	);
	this.cache = null;
}

//TODO should unselect topics in it
public void closeViewpoint(String viewpointID) {
	this.openedViewpoints.remove(
		this.map.getViewpoint(viewpointID)
	);
	this.cache = null;
}

public void toggleTopic(String viewpointID, String topicID) {
	HypertopicMap.Viewpoint.Topic topic = 
		this.map.getViewpoint(viewpointID).getTopic(topicID);
	if (this.selectedTopics.contains(topic)) {
		this.selectedTopics.remove(topic);
	} else {
		this.selectedTopics.add(topic);
	}
	this.cache = null;
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


public Set<Topic> getTopics() throws Exception
{ 
	Set<Topic> result = new TreeSet();
	ItemSet globalSet = this.getSelectedItemSet();
	int globalItemsCount = globalSet.countItems();
	int globalHighlightsCount = globalSet.countHighlights();
	for (HypertopicMap.Viewpoint v : this.openedViewpoints) {
		for (HypertopicMap.Viewpoint.Topic t : v.getTopics()) {
			ItemSet localSet = new ItemSet(t);
			localSet.retainAll(globalSet);
			result.add(
				new Topic(
					v.getID(),
					t.getID(),
					t.getName(),
					localSet,
					globalItemsCount,
					globalHighlightsCount
				)
			);
		}
	}
	return result;
}

class Topic {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

private String viewpointID;
private String topicID;
private final String name;
private final double ratio[] = {0, 0};

public Topic(
	String viewpointID,
	String topicID,
	String name,
	ItemSet localSet,
	int globalItemsCount, 
	int globalHighlightsCount
) {
	this.viewpointID = viewpointID;
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

public String getViewpointID() {
	return this.viewpointID;
}

public String getTopicID() {
	return this.topicID;
}

@Override public String toString() {
	return this.name + "(" + this.ratio[0] + "," + this.ratio[1] + ")";
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Topic

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Portfolio
