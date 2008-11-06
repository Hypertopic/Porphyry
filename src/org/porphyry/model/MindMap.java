/*
PORPHYRY - Digital space for building and confronting interpretations about 
documents

SCIENTIFIC COMMITTEE
- Andrea Iacovella
- Aurelien Benel

OFFICIAL WEB SITE
http://www.porphyry.org/

Copyright (C) 2008 Aurelien Benel.

LEGAL ISSUES
This program is free software; you can redistribute it and/or modify it under 
the terms of the GNU General Public License (version 2) as published by the 
Free Software Foundation.
This program is distributed in the hope that it will be useful, but WITHOUT ANY 
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A 
PARTICULAR PURPOSE. See the GNU General Public License for more details: 
http://www.gnu.org/licenses/gpl.html
*/

package org.porphyry.model;

import java.util.*;
import java.net.*;
import java.io.*;

import javax.xml.XMLConstants;
import javax.xml.parsers.SAXParserFactory;
import javax.xml.validation.SchemaFactory;

import org.xml.sax.*;
import org.xml.sax.helpers.*;

public class MindMap {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

/**
 * @return viewpoint URL
 */
public URL importToServer(InputStream inputStream, String service, URL actor, boolean withItems)
	throws Exception 
{
	SAXParserFactory parserFactory = SAXParserFactory.newInstance();
	parserFactory.setSchema(
			SchemaFactory.newInstance(
					XMLConstants.W3C_XML_SCHEMA_NS_URI
			).newSchema(
					MindMap.class.getResource("Freemind.xsd")
			)
	);
	FreemindHandler freemindHandler = new FreemindHandler(service, actor, withItems);
	parserFactory.newSAXParser().parse(inputStream, freemindHandler);
	return freemindHandler.getViewpoint();
}
	
class FreemindHandler extends DefaultHandler {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

private String service;
private URL actor;
private URL viewpoint;
private boolean withItems;
private final Deque<URL> ancestors = new ArrayDeque<URL>(); //stack for node tree exploration
private final Map<String,URL> idTranslator = new HashMap<String,URL>(); 

public FreemindHandler(String service, URL actor, boolean withItems) {
	this.service = service;
	this.actor = actor;
	this.withItems = withItems;
}

public URL getViewpoint() {
	return this.viewpoint;//unsafe
}

protected URL createViewpoint(String name) throws Exception {
	org.porphyry.model.Viewpoint v = new org.porphyry.model.Viewpoint(
			this.service + "viewpoint/"
	);
	v.setName(name);
	v.addActor(this.actor.toString());
	v.httpPostCreate();
	this.viewpoint = v.getURL();
	return v.getURL();
}

protected URL createTopic(String name) throws Exception {
	org.porphyry.model.Topic t = new org.porphyry.model.Topic(
			this.viewpoint.toString()+"topic/"
	);
	t.setName(name);
	if (this.isParentATopic()) {
		t.addRelatedTopic("includedIn", this.ancestors.getFirst().toString());
	}
	t.httpPostCreate();
	return t.getURL();
}

protected void linkTopicToFather(URL url) throws Exception {
	org.porphyry.model.Topic t = new org.porphyry.model.Topic(url);
	Collection<URL> parents = new ArrayList<URL>();
	parents.add(this.ancestors.getFirst());
	t.addRelatedTopicsRemotely("includedIn", parents);
}

protected void linkItemToFather(URL url) throws Exception {
	org.porphyry.model.Topic father = new org.porphyry.model.Topic(
			this.ancestors.getFirst()
	);
	Collection<URL> items = new ArrayList<URL>();
	items.add(url);
	father.addEntitiesRemotely(items);
}

protected boolean isParentATopic() {
	return (
			!this.ancestors.isEmpty() 
			&& HyperTopicResource.getNodeType(
					this.ancestors.getFirst().toString()
			)==HyperTopicResource.NodeType.TOPIC
	);
}

@Override
public void startElement(String u, String n, String element, Attributes attr)
	throws SAXException 
{
	try {
		if ("node".equals(element)) {
			String name = attr.getValue("TEXT");
			String itemURL = attr.getValue("LINK");
			URL url = null;
			System.err.println("DEBUG itemURL="+itemURL+" ancestors="+this.ancestors);
			if (this.viewpoint==null) { // is a viewpoint
				url = this.createViewpoint(name);
			} else if (itemURL!=null) { // is an item
				url = new URL(itemURL);
				if (this.withItems) {
					this.linkItemToFather(url);
				}
			} else { // is a topic
				url = this.createTopic(name);
				String topicID = attr.getValue("ID");
				if (topicID!=null) {
					this.idTranslator.put(topicID, url);
				}
			}
			this.ancestors.addFirst(url);
		} else if ("arrowlink".equals(element)) {
			this.linkTopicToFather(
					this.idTranslator.get(
							attr.getValue("DESTINATION")
					)
			);
		}
	} catch (Exception e) {
		e.printStackTrace();
	}
}

@Override
public void endElement(String u, String n, String element) throws SAXException 
{
	if ("node".equals(element)) {
		this.ancestors.removeFirst();
	}
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< class FreemindHandler

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< class FreemindImporter
