/*
PORPHYRY - Digital space for building and confronting interpretations about
documents

SCIENTIFIC COMMITTEE
- Andrea Iacovella
- Aurelien Benel

OFFICIAL WEB SITE
http://www.porphyry.org/

Copyright (C) 2006-2009 Aurelien Benel.

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

public class Topic extends HyperTopicResource {

private URL viewpoint;

private String name = "";	 

private final Set<RelatedTopic> relatedTopics = new HashSet<RelatedTopic>();

private final Set<LabeledURL> entities = new HashSet<LabeledURL>();

private final XMLHandler xmlHandler = new XMLHandler() { /////////////
	
	private String url;
	private String label = "";

	@Override 
	public void startElement (
		String u, String n, String element, Attributes attr
	) throws SAXException {
		try {
			if (element.equals("topic")) {
				String s = attr.getValue("name");
				Topic.this.name = (s==null)?"":s;
			} else if (element.equals("viewpoint")) {
				Topic.this.viewpoint = 
					Topic.this.getAbsoluteURL(attr.getValue("href"));
			} else if (element.equals("relatedTopic")) {
				Topic.this.addRelatedTopic(
					attr.getValue("relationType"),
					attr.getValue("href")
				);
			} else if (element.equals("entity")) {
				this.url = attr.getValue("href");
			}
		} catch (MalformedURLException e) {
			System.err.println(e);
		}
	}

	@Override
	public void characters(char[] ch, int start, int length) {
		this.label += new String(ch, start, length);
	}

	@Override
	public void endElement(String u, String n, String element) {
		try {
			if (element.equals("entity")) {
				if ("".equals(this.label.trim())) {
					this.label = null;
				}
				Topic.this.addEntity(this.url, this.label);
			}
			this.url = null;
			this.label = "";
		} catch (MalformedURLException e) {
			System.err.println(e);
		}
	}
	
}; ////////////////////////////////////////////////////////////////////////////

public class RelatedTopic {

	private String relationType;

	private URL href;

	public RelatedTopic(String relationType, String href) 
		throws MalformedURLException
	{
		this.relationType = relationType;
		this.href = Topic.this.getAbsoluteURL(href);
	}

	public String getRelationType() {
		return this.relationType;
	}

	public URL getURL() {
		URL url = null;
		try {
			url = new URL(this.href.toString());
		} catch (MalformedURLException e) {
			e.printStackTrace(); // Should never go there
		}
		return url;
	}

	@Override
	public boolean equals(Object that) {
		return that instanceof RelatedTopic
		&& this.href.equals(((RelatedTopic) that).href)
		&& this.relationType.equals(((RelatedTopic) that).relationType);
	}

}

public Topic(String url) 
	throws MalformedURLException
{
	super(url);
}

public Topic(URL url) {
	super(url);
}

@Override
public void clear() {
	this.relatedTopics.clear();
	this.entities.clear();
}

public URL getViewpoint() 
	throws MalformedURLException
{
	return new URL(this.viewpoint.toString());
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

public void addRelatedTopic(String relationType, String href) 
	throws MalformedURLException
{
	this.relatedTopics.add(new RelatedTopic(relationType, href));
}

public void removeRelatedTopic(String relationType, String href) 
	throws MalformedURLException
{
	this.relatedTopics.remove(new RelatedTopic(relationType, href));
}

public Collection<URL> getRelatedTopics(String relationType) {
        Collection<URL> c = new ArrayList<URL>();        
	for (RelatedTopic r : this.relatedTopics) {
                if (r.getRelationType().equals(relationType)) {
                        c.add(r.getURL());
		}
	}
	return c;
}

public void addEntity(String href, String label) 
	throws MalformedURLException
{
	this.entities.add( 
		new LabeledURL(
			this.getAbsoluteURL(href),
			label
		)
	);
}

public void removeEntity(URL href) {
	this.entities.remove(href);
}

public List<LabeledURL> getEntities() { 
	return new ArrayList<LabeledURL>(this.entities);
}

@Override
public String toXML() {
	String xml = super.toXML() + "<topic name=\"" + this.name +"\">\n";
	for (RelatedTopic relatedTopic : this.relatedTopics) {
		xml += "<relatedTopic relationType=\"" 
			+ relatedTopic.getRelationType() + "\" href=\"" 
			+ relatedTopic.getURL() + "\"/>\n";
	}
	for (LabeledURL entity : this.entities) {
		String label = entity.getLabel();
		xml += "<entity href=\"" + entity.getURL() + "\">"
			+ ((label==null)?"":label)
			+ "</entity>\n";
	}
	return xml + "</topic>\n";
}

public static void main(String args[]) {
	try {
		Topic t = new Topic("http://localhost/viewpoint/1/topic/11/");
		t.httpGet(true);
		System.out.println(t.toXML());
	} catch (Exception e) {
		e.printStackTrace();
	}
}

}
