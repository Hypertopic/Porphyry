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

package org.porphyry.model;

import java.net.*;
import java.util.*;
import javax.xml.parsers.ParserConfigurationException;
import org.xml.sax.*;

public class Viewpoint extends HyperTopicResource {

private String name = null;	 

private final Set<URL> topics = new HashSet<URL>(); //upper topics

private final Vector<URL> actors = new Vector<URL>();

private final XMLHandler xmlHandler = new XMLHandler() { /////////////
	@Override
	public void startElement (
		String u, String n, String element, Attributes attr
	) throws SAXException {
		try {
			if (element.equals("viewpoint") ) {
				Viewpoint.this.name = attr.getValue("name");
			} else if (element.equals("topic")) {
				Viewpoint.this.addTopic(
					attr.getValue("href")
				);
			}
		} catch (MalformedURLException e) {
			e.printStackTrace(); // Should never go there
		}
	}
}; ////////////////////////////////////////////////////////////////////////////


//TODO Cache if necessary
//TODO Partial update

public Viewpoint(String url) 
	throws MalformedURLException
{
	super(url);
}

public Viewpoint(URL url) {
	super(url);
}

@Override
public void clear() {
	this.topics.clear();
	this.actors.clear();
}

@Override
public XMLHandler getXMLHandler() {
	return this.xmlHandler;
}

public String getName() {
	return decode(this.name);
}

public void setName(String name) {
	this.name = encode(name); 
}

public void setNameRemotely(String name) 
	throws java.io.IOException, HyperTopicException, SAXException, 
	ParserConfigurationException
{
	this.httpPostUpdate("<viewpoint name='"+encode(name)+"'/>");
	this.httpGet(false);
}

public void addTopic(String url) 
	throws MalformedURLException
{
	this.topics.add(this.getAbsoluteURL(url));
}

public void addActor(String url) 
	throws MalformedURLException
{
	this.actors.add(this.getAbsoluteURL(url));
}

public void addActorRemotely(URL url) 
	throws java.io.IOException, HyperTopicException, SAXException, 
	ParserConfigurationException
{
	this.httpPostUpdate("<viewpoint><actor href=\""+url+"\" action=\"insert\"/></viewpoint>");
	this.httpGet(false);
}

public void removeTopic(String url) 
	throws MalformedURLException
{
	this.topics.remove(this.getAbsoluteURL(url));
}

public void removeActor(String url) 
	throws MalformedURLException
{
	this.actors.remove(this.getAbsoluteURL(url));
}

public void removeActorRemotely(URL url) //TODO verify syntax
	throws java.io.IOException, HyperTopicException, SAXException, 
	ParserConfigurationException
{
	this.httpPostUpdate("<viewpoint><actor href=\""+url+"\" action=\"delete\"/></viewpoint>");
	this.httpGet(false);
}

public List<URL> getUpperTopics() {
	return new ArrayList<URL>(this.topics);
}

@Override
public String toXML() {
	String xml = super.toXML() + "<viewpoint name=\"" + this.name +"\">\n";
	for (URL url : this.actors) {
		xml += "<actor href=\"" + url + "\"/>\n";
	}
	xml += "</viewpoint>\n";
	return xml;
}

public static void main(String args[]) {
	try {
		Viewpoint v = new Viewpoint( "http://localhost/viewpoint/");
		v.httpPostCreate();
		v.setName("Test");
		v.httpPut();
		v.httpDelete();
	} catch (Exception e){
		e.printStackTrace();
	}
}

}
