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

public class Viewpoints extends HyperTopicResource {

private final Vector<LabeledURL> viewpoints = new Vector<LabeledURL>(); 

private final XMLHandler xmlHandler = new XMLHandler() { /////////////

	private String url;

	public void startElement(
		String u, String n, String element, Attributes attr
	) throws SAXException {
		if (element.equals("viewpoint")) {
			this.url = attr.getValue("href");
		} 
	}

	public void characters(char[] ch, int start, int length) {
		try {
			if (this.url != null) {
				Viewpoints.this.add(
						this.url, 
						new String(ch, start, length)
				);
			}
		} catch (MalformedURLException e) {
			//Should never go there if XML is valid
			e.printStackTrace();
		}
	}

	public void endElement(String u, String n, String element) {
		if (element.equals("viewpoint")) {
			this.url = null;
		}
	}

}; ////////////////////////////////////////////////////////////////////////////

public Viewpoints(String url) 
	throws MalformedURLException
{
	super(url);
}

public Viewpoints(URL url) {
	super(url);
}

public void add(String viewpointURL, String label) 
	throws MalformedURLException
{
	this.viewpoints.add(
		new LabeledURL(
			this.getAbsoluteURL(viewpointURL), label
		)
	);
}

@Override
public void clear() {
	this.viewpoints.clear();
}

@Override
public XMLHandler getXMLHandler() {
	return this.xmlHandler;
}

public Vector<LabeledURL> getViewpoints() {
	return new Vector<LabeledURL>(this.viewpoints);
}

public String toXML(){
	String xml = super.toXML() + "<viewpoints>\n";
	for(int i=0;i<viewpoints.size();i++) {
		xml += "<viewpoint href=\""+ viewpoints.get(i).getURL() + "\">" 
		+ viewpoints.get(i).getLabel() + "</viewpoint>\n";
	}
	return xml + "</viewpoints>\n";
}

public void httpPut() 
	throws UnsupportedOperationException
{
	throw new UnsupportedOperationException();
}

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

public void httpDelete() 
	throws UnsupportedOperationException
{
	throw new UnsupportedOperationException();
}

public static void main(String args[]) {
	try {
		Viewpoints a = new Viewpoints("http://localhost/viewpoint/");
		a.httpGet(false);
		System.out.println(a.getViewpoints());
	} catch (Exception e) {
		e.printStackTrace();
	}
}

}
