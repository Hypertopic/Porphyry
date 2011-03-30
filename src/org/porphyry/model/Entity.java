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

public class Entity extends HyperTopicResource {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

public enum DocumentType {
	FOLDER, SOURCE, FRAGMENT
}

private final List<Attribute> attributes =
	new ArrayList<Attribute>();

private final Map<String,URL> resources =
	new HashMap<String,URL>();

private final List<URL> topics =
	new ArrayList<URL>();

private final List<LabeledURL> entities =
	new ArrayList<LabeledURL>();

private final XMLHandler xmlHandler = new XMLHandler() {
	@Override
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
		} else if (element.equals("relatedEntity") ) {
			Entity.this.addRelatedEntity(
				attr.getValue("relationType"),
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
			new URL(url)
	);
}

public Entity(URL url) 
	throws MalformedURLException, URISyntaxException
{
	super(url);
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

public void addAttribute(String name, String value) {//TODO handle url
	this.attributes.add(new Attribute(name, value));
}

//TODO removeAttribute

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

//TODO removeResource

public URL getResource(String name) {
	return this.resources.get(name);
}

public void addRelatedEntity(String relationType, String href) {
	try {
		this.entities.add(
			new LabeledURL(
				this.getAbsoluteURL(href),
				relationType
			)
		);
	} catch (MalformedURLException e) {
		System.err.println(e);
	}
}

public List<URL> getRelatedEntities(String relationType) {
	List<URL> entities = new ArrayList<URL>();
	for(LabeledURL entity : this.entities) {
		if (entity.getLabel().equals(relationType)) {
			entities.add(entity.getURL());
		}
	}
	return entities;
}

//TODO removeRelatedEntity

// recursive (suppose no cycle), results from bottom to top
protected List<URL> getAllEntities() 
	throws HyperTopicException, java.io.IOException , URISyntaxException,
	SAXException, ParserConfigurationException
{
	List<URL> result = new ArrayList<URL>();
	for (URL url : this.getRelatedEntities("partOf")) {
		Entity child = new Entity(url);
		child.httpGet(true);
		result.addAll(child.getAllEntities());
	}
	result.add(this.getURL());
	return result;
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

public static int getLevel(String urlString) {//TODO safer
	return urlString.split("/entity/")[1].split("/").length;

}

public static DocumentType getDocumentType(String urlString) {
	return urlString.endsWith("/") ? DocumentType.FOLDER
		: urlString.contains("+") ? DocumentType.FRAGMENT
		: DocumentType.SOURCE;
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

@Override
public String toXML() {
	String xml = super.toXML() + "<entity>\n";
	for(Attribute attribute : this.attributes) {
		xml += "<attribute name=\""+ attribute.getKey() + "\" value=\""
			+ attribute.getValue() + "\"/>\n";
	}
	return xml + "</entity>\n";
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

public static void main(String args[]) {
	try {
		Entity root = new Entity(
			new URL(args[0])
		);
		root.httpGet(true);
		List<URL> all = root.getAllEntities();
		for (URL item : all) {
			System.out.println(item);
		}
	} catch (Exception e) {
		System.err.println(e);
	}
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< class Entity
