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

public class LabeledURL {

private String label;

private URL url;

public LabeledURL(String url, String label) 
	throws MalformedURLException
{
	this.url = new URL(url);
	this.label = label;
}

public LabeledURL(URL url, String label) 
	throws MalformedURLException
{
	this.url = url;
	this.label = label;
}

public URL getURL() {
	URL u = null;
	try {
		u = new URL(this.url.toString()); 
	} catch (MalformedURLException e) {
		//Should never go there
		e.printStackTrace();
	}
	return u;
}

public String getLabel() {
	return this.label;
}

@Override
public String toString() {
	return this.label;
}

@Override
public boolean equals(Object that) {
	return that instanceof LabeledURL
	&& this.url.equals(((LabeledURL)that).url);
}

}
