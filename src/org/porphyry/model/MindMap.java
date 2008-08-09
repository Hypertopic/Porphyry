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
public URL importToServer(File file, String service, URL actor) throws Exception {
	SAXParserFactory parserFactory = SAXParserFactory.newInstance();
	parserFactory.setSchema(
			SchemaFactory.newInstance(
					XMLConstants.W3C_XML_SCHEMA_NS_URI
			).newSchema(
					MindMap.class.getResource("Freemind.xsd")
			)
	);
	FreemindHandler freemindHandler = new FreemindHandler(service, actor);
	parserFactory.newSAXParser().parse(
			new FileInputStream(file),
			freemindHandler
	);
	return freemindHandler.getViewpoint();
}
	
class FreemindHandler extends DefaultHandler {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

private String service;
private URL actor;
private URL viewpoint;
private final Deque<URL> ancestors = new ArrayDeque<URL>();
private final Map<String,URL> idTranslator = new HashMap<String,URL>(); 

public FreemindHandler(String service, URL actor) {
	this.service = service;
	this.actor = actor;
}

public URL getViewpoint() {
	return this.viewpoint;//unsafe
}

protected void createViewpoint(String name) throws Exception {
	org.porphyry.model.Viewpoint v = new org.porphyry.model.Viewpoint(
			this.service + "viewpoint/"
	);
	v.setName(name);
	v.addActor(this.actor.toString());
	v.httpPostCreate();
	this.viewpoint = v.getURL();
}

protected URL createTopic(String name) throws Exception {
	org.porphyry.model.Topic t = new org.porphyry.model.Topic(
			this.viewpoint.toString()+"topic/"
	);
	t.setName(name);
	if (!this.ancestors.isEmpty()) {
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

@Override
public void startElement(String u, String n, String element, Attributes attr)
	throws SAXException 
{
	try {
		if ("node".equals(element)) {
			String name = attr.getValue("TEXT");
			if (this.viewpoint==null) { // is a viewpoint
				this.createViewpoint(name);
			} else { // is a topic
				URL topicURL = this.createTopic(name);
				this.ancestors.addFirst(topicURL);
				String topicID = attr.getValue("ID");
				if (topicID!=null) {
					this.idTranslator.put(topicID, topicURL);
				}
			}
		} else if ("arrowlink".equals(element)) {
			this.linkTopicToFather(
					this.idTranslator.get(
							attr.getValue("DESTINATION")
					)
			);
		}
	} catch (Exception e) {
		System.err.println(e);
	}
}

@Override
public void endElement(String u, String n, String element) throws SAXException 
{
	if ("node".equals(element) && !this.ancestors.isEmpty()) {
		this.ancestors.removeFirst();
	}
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< class FreemindHandler

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< class FreemindImporter
