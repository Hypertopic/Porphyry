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

public class Actor extends HyperTopicResource {

	private String completeName = null;	 

	private final Vector<LabeledURL> viewpoints = new Vector<LabeledURL>();

	private final XMLHandler xmlHandler = new XMLHandler() { /////////////

		private String url;

		@Override
		public void startElement (
				String u, String n, String element, Attributes attr
		) throws SAXException {
			if (element.equals("actor") ) {
				Actor.this.completeName = attr.getValue("name");
			} else if (element.equals("viewpoint")) {
				this.url = attr.getValue("href");
			}
		}

		@Override
		public void characters(char[] ch, int start, int length) {
			try {
				if (this.url != null) {
					Actor.this.addViewpoint(
							this.url,
							new String(ch, start, length)
					);
				}
			} catch (MalformedURLException e) {
				//Shouldn't go there if the XML is valid
				e.printStackTrace();
			}
		}

		@Override
		public void endElement(String u, String n, String element) {
			if (element.equals("viewpoint")) {
				this.url = null;
			}
		}

	}; ////////////////////////////////////////////////////////////////////////////


//	TODO Cache if necessary


	public Actor (String url) 
	throws MalformedURLException
	{
		super(url);
	}

	public Actor (URL url) {
		super(url);
	}

	@Override
	public void clear() {
		this.viewpoints.clear();
	}

	@Override
	public XMLHandler getXMLHandler() {
		return this.xmlHandler;
	}

	public String getCompleteName() {
		return decode(this.completeName);
	}

	public void setCompleteName(String completeName) {
		this.completeName = encode(completeName); 
	}

	public void addViewpoint(String viewpointURL, String label) 
	throws MalformedURLException
	{
		this.viewpoints.add(
				new LabeledURL(
						this.getAbsoluteURL(viewpointURL), label
				)
		);
	}

	public void removeViewpoint(String viewpointURL) 
	throws MalformedURLException
	{
		this.viewpoints.remove(new LabeledURL(viewpointURL, ""));
	}

	public Vector<LabeledURL> getViewpoints() {
		return new Vector<LabeledURL>(this.viewpoints);
	}

	@Override
	public String toXML() {
		String xml = super.toXML() + "<actor name=\"" + this.completeName +"\">\n";
		for(LabeledURL viewpoint : this.viewpoints) {
			xml += "<viewpoint href=\""+ viewpoint.getURL() + "\">" 
			+ viewpoint.getLabel() + "</viewpoint>\n";
		}
		return xml + "</actor>\n";
	}

	public static void main(String args[]) {
		try {
			Actor a = new Actor( "http://localhost/actor/toto");
			a.httpGet(false);
			//a.httpPut();
			System.out.println(a.getViewpoints());
		} catch (Exception e){
			e.printStackTrace();
		}
	}

}
