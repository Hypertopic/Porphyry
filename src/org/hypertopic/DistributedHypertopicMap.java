/*
HYPERTOPIC - Infrastructure for community-driven knowledge organization systems

OFFICIAL WEB SITE
http://www.hypertopic.org/

Copyright (C) 2011 Aurelien Benel.

LEGAL ISSUES
This library is free software; you can redistribute it and/or modify it under
the terms of the GNU Lesser General Public License as published by the Free
Software Foundation, either version 3 of the license, or (at your option) any
later version.
This library is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details:
http://www.gnu.org/licenses/lgpl.html
*/

package org.hypertopic;

import org.json.*;
import java.util.*;

//TODO: each request in a distinct thread?

/**
  * Extension to HypertopicMap.
  * Secondary services are used for read-only methods.
  */
public class DistributedHypertopicMap extends HypertopicMap {//>>>>>>>>>>>>>>>>>

private final Collection<HypertopicMap> secondary = new ArrayList();

public DistributedHypertopicMap(String primary, String... secondary) {
	super(primary);
	for (String s : secondary) {
		this.addSecondary(s);
	}
}

@Override public Collection<String> getURLs() {
	Collection<String> c = super.getURLs();
	for (HypertopicMap m : this.secondary) {
		c.addAll(m.getURLs());
	}
	return c;
}

public void addSecondary(String service) {
	this.secondary.add(new HypertopicMap(service));
}

//TODO remove secondary?

@Override public User getUser(String userID) {
	return new DistributedHypertopicMap.User(userID);
} 

@Override public Viewpoint getViewpoint(String viewpointID) {
	return new DistributedHypertopicMap.Viewpoint(viewpointID);
}

@Override public Corpus getCorpus(String corpusID) {
	return new DistributedHypertopicMap.Corpus(corpusID);
}

public class User extends HypertopicMap.User {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

public User(String id) {
	super(id);
}

@Override public Collection<JSONObject> listCorpora() throws Exception {
	Collection<JSONObject> result = super.listCorpora();
	for (HypertopicMap m : DistributedHypertopicMap.this.secondary) {
		result.addAll(
			m.getUser(this.getID()).listCorpora()
		);
	}
	return result;
}

@Override public Collection<JSONObject> listViewpoints() throws Exception {
	Collection<JSONObject> result = super.listViewpoints();
	for (HypertopicMap m : DistributedHypertopicMap.this.secondary) {
		result.addAll(
			m.getUser(this.getID()).listViewpoints()
		);
	}
	return result;
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< User

public class Corpus extends HypertopicMap.Corpus {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>

public Corpus(String id) {
	super(id);
}

@Override public Collection<HypertopicMap.Corpus.Item> getItems() 
	throws Exception 
{
	Collection result = super.getItems();
	for (HypertopicMap m : DistributedHypertopicMap.this.secondary) {
		result.addAll(
			m.getCorpus(this.getID()).getItems()
		);
	}
	return result;
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Corpus

public class Viewpoint extends HypertopicMap.Viewpoint {//>>>>>>>>>>>>>>>>>>>>>>

public Viewpoint(String id) {
	super(id);
}

@Override public Topic getTopic(String topicID) {
	return new DistributedHypertopicMap.Viewpoint.Topic(topicID);
}

public class Topic extends HypertopicMap.Viewpoint.Topic {//>>>>>>>>>>>>>>>>>>>>

public Topic(String id) {
	super(id);
}

@Override public  Collection<Corpus.Item.Highlight> getHighlights() 
	throws Exception 
{
	Collection result = super.getHighlights();
	for (HypertopicMap m : DistributedHypertopicMap.this.secondary) {
		result.addAll(
			m.getViewpoint(this.getViewpointID())
				.getTopic(this.getID())
				.getHighlights()
		);
	}
	return result;
}

//TODO getitems?

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Topic

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Viewpoint

@Override public String toString() {
	String result = super.toString() + '\n';
	for (HypertopicMap m : DistributedHypertopicMap.this.secondary) {
		result += m.toString() + '\n';
	}
	return result; 
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< HypertopicMap
