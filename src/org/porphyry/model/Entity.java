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
import java.io.*;
import java.util.*;
import javax.xml.parsers.ParserConfigurationException;
import org.xml.sax.*;

public class Entity extends HyperTopicResource {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

private final List<Attribute> attributes =
	new ArrayList<Attribute>();

private final Map<String,URL> resources =
	new HashMap<String,URL>();

private final List<URL> topics =
	new ArrayList<URL>();

private final XMLHandler xmlHandler = new XMLHandler() {
	public void startElement (
		String u, String n, String element, Attributes attr
	) throws SAXException {
		if (element.equals("attribute") ) {
			Entity.this.addAttribute(
				attr.getValue("name"),
				attr.getValue("value")
			);
		} else if (element.equals("resource") ) {
			Entity.this.addResource(
				attr.getValue("name"),
				attr.getValue("href")
			);
		} else if (element.equals("topic") ) {
			Entity.this.addTopic(
				attr.getValue("href")
			);
		}
	}
}; 

public Entity(String url) 
	throws MalformedURLException, URISyntaxException
{
	super(
		HyperTopicResource.encode(
			new URL(url)
		)
	);
}

public Entity(URL url) 
	throws MalformedURLException, URISyntaxException
{
	super(
		HyperTopicResource.encode(url)
	);
}

@Override
public void clear() {
	this.attributes.clear();
	this.resources.clear();
	this.topics.clear();
}

@Override
public XMLHandler getXMLHandler() {
	return this.xmlHandler;
}

public void addTopic(String href) {
	try {
		this.topics.add(
			this.getAbsoluteURL(href)
		);
	} catch (MalformedURLException e) {
		System.err.println(e);
	}
}

public void addTopicRemotely(URL href) 
	throws java.io.IOException, HyperTopicException, SAXException, 
	ParserConfigurationException
{
	this.httpPostUpdate("<entity><topic href=\""+href+"\" action=\"insert\"/></entity>");
	this.httpGet(false);
}

public void addAttribute(String name, String value) {//TODO handle url
	this.attributes.add(new Attribute(name, value));
}

public void addAttributeRemotely(String name, String value)
	throws java.io.IOException, HyperTopicException, SAXException, 
	ParserConfigurationException
{
	this.httpPostUpdate("<entity><attribute name=\""+name+"\" value=\""+value+"\" action=\"insert\"/></entity>");
	this.httpGet(false);
}

//TODO removeAttribute
//TODO removeAttributeRemotely

public void addResource(String name, String href) {
	try {
		this.resources.put(
			name, 
			this.getAbsoluteURL(href)
		);
	} catch (MalformedURLException e) {
		System.err.println(e);
	}
}

public void addResourceRemotely(String name, URL href) 
	throws java.io.IOException, HyperTopicException, SAXException, 
	ParserConfigurationException
{
	this.httpPostUpdate("<entity><resource name=\""+name+"\" href=\""+href+"\" action=\"insert\"/></entity>");
	this.httpGet(false);
}

//TODO removeResource
//TODO removeResourceRemotely

public URL getResource(String name) {
	return this.resources.get(name);
}

public String getFirstValue(String key) {
	int i=0;
	Attribute a = null;
	while (i<this.attributes.size() && (a==null||!key.equals(a.getKey()))){
		a = this.attributes.get(i);
		i++;
	}
	return (a==null)
		? null
		: a.getValue();
}

public int getLevel() {//TODO safer
	return this.getURL().toString().split("/entity/")[1].split("/").length;

}

public List<URL> getTopics() {
	return new ArrayList<URL>(this.topics);
}

public List<Attribute> getAttributes() {
	return new ArrayList<Attribute>(this.attributes);//TODO safe copy
}

public List<String> getValues(String key) {
	List<String> values = new ArrayList<String>();
	for(Attribute attribute : this.attributes) {
		if (attribute.getKey().equals(key)) {
			values.add(attribute.getValue());
		}
	}
	return values;
}

public String toXML() {
	String xml = super.toXML() + "<entity>\n";
	for(Attribute attribute : this.attributes) {
		xml += "<attribute name=\""+ attribute.getKey() + "\" value=\""
			+ attribute.getValue() + "\"/>\n";
	}
	return xml + "</entity>\n";
}

public void httpPostCreate()
        throws UnsupportedOperationException
{
        throw new UnsupportedOperationException();
}


public static void main(String args[]) {
	try {
		System.out.println(
			(new Entity("http://localhost/entity/Aaa/Bbb/Ccc")).getLevel()
		);
		System.out.println(
			(new Entity("http://localhost/entity/Aaa/Bbb/")).getLevel()
		);
		System.out.println(
			(new Entity("http://localhost/entity/Aaa/")).getLevel()
		);
	} catch (Exception e){
		e.printStackTrace();
	}
}

class Attribute {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

private String key;

private String value;

public Attribute(String key, String value) {
	this.key = key;
	this.value = value;
}

public String getKey() {
	return this.key;
}

public String getValue() {
	return this.value;
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< class Attribute

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< class Entity
