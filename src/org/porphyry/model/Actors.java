/*
PORPHYRY - Digital space for building and confronting interpretations about
documents

SCIENTIFIC COMMITTEE
- Andrea Iacovella
- Aurelien Benel

OFFICIAL WEB SITE
http://www.porphyry.org/

Copyright (C) 2006 Aurelien Benel.

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
import org.xml.sax.*;

public class Actors extends HyperTopicResource {

private final Vector<LabeledURL> actors = new Vector<LabeledURL>(); 

private final XMLHandler xmlHandler = new XMLHandler() { /////////////

	private String url;

	@Override
	public void startElement(
		String u, String n, String element, Attributes attr
	) throws SAXException {
		if (element.equals("actor")) {
			this.url = attr.getValue("href");
		} 
	}

	@Override
	public void characters(char[] ch, int start, int length) {
		try {
			if (this.url != null) {
				Actors.this.add(
						this.url, 
						new String(ch, start, length)
				);
			}
		} catch (MalformedURLException e) {
			//Should never go there if XML is valid
			e.printStackTrace();
		}
	}

	@Override
	public void endElement(String u, String n, String element) {
		if (element.equals("actor")) {
			this.url = null;
		}
	}

}; ////////////////////////////////////////////////////////////////////////////

public Actors(String url) 
	throws MalformedURLException
{
	super(url);
}

public Actors(URL url) {
	super(url);
}

public void add(String actorURL, String label) 
	throws MalformedURLException
{
	this.actors.add(
		new LabeledURL(
			this.getAbsoluteURL(actorURL), label
		)
	);
}

@Override
public void clear() {
	this.actors.clear();
}

@Override
public XMLHandler getXMLHandler() {
	return this.xmlHandler;
}

public Vector<LabeledURL> getActors() {
	return new Vector<LabeledURL>(this.actors);
}

@Override
public String toXML() 
	throws UnsupportedOperationException
{
	throw new UnsupportedOperationException();
}

@Override
public void httpPut() 
	throws UnsupportedOperationException
{
	throw new UnsupportedOperationException();
}

@Override
public void httpPostCreate() 
	throws UnsupportedOperationException
{
	throw new UnsupportedOperationException();
}

public void httpPostUpdate() 
	throws UnsupportedOperationException
{
	throw new UnsupportedOperationException();
}

@Override
public void httpDelete() 
	throws UnsupportedOperationException
{
	throw new UnsupportedOperationException();
}

public static void main(String args[]) {
	try {
		Actors a = new Actors("http://localhost/actor/");
		a.httpGet(false);
		System.out.println(a.getActors());
	} catch (Exception e) {
		e.printStackTrace();
	}
}

}
