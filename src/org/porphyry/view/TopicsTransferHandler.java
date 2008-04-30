/*
PORPHYRY - Digital space for building and confronting interpretations about
documents

SCIENTIFIC COMMITTEE
- Andrea Iacovella
- Aurelien Benel

OFFICIAL WEB SITE
http://www.porphyry.org/

Copyright (C) 2007 Aurelien Benel.

LEGAL ISSUES
This program is free software; you can redistribute it and/or modify it under
the terms of the GNU General Public License (version 2) as published by the
Free Software Foundation.
This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details:
http://www.gnu.org/licenses/gpl.html
*/

package org.porphyry.view;

import java.util.*;
import java.awt.datatransfer.*;
import java.io.IOException;
import javax.swing.*;

public class TopicsTransferHandler extends TransferHandler {//>>>>>>>>>>>>>>>>>

private JComponent source; //TODO Java 6 API
private JComponent destination = null; //TODO Java 6 API

private static final TopicsTransferHandler singleton = 
	new TopicsTransferHandler();

public static final DataFlavor TOPICS_FLAVOR = new DataFlavor(
	Collection.class, "topics"
);

public static TopicsTransferHandler getSingleton() {
	return singleton;
}

protected static Collection<org.porphyry.presenter.Viewpoint.Topic> 
	componentToTopics(JComponent source) 
{
	Collection<org.porphyry.presenter.Viewpoint.Topic> c = null;
	if (source instanceof Viewpoint.ViewpointPane.Topic) {
		c = ((Viewpoint.ViewpointPane.Topic) source).getActiveTopics();	
	}
	return c;
}

protected static Collection<org.porphyry.presenter.Viewpoint.Topic> 
	transferableToTopics(Transferable t) throws 
	UnsupportedFlavorException, UnsupportedFlavorException, IOException
{
	return (Collection<org.porphyry.presenter.Viewpoint.Topic>) 
		t.getTransferData(TOPICS_FLAVOR);
}

@Override
public int getSourceActions(JComponent source) {
	this.source = source;//TODO Java 6 API
	return COPY_OR_MOVE;
}

@Override
protected Transferable createTransferable(JComponent source) {
	return new TopicSelection(componentToTopics(source));
}

@Override
public boolean canImport(JComponent destination, DataFlavor[] flavors) {
	return Arrays.asList(flavors).contains(TOPICS_FLAVOR)
		&& destination!=this.source;//TODO Java 6 API
}

@Override
public boolean importData(JComponent destination, Transferable data) {
	boolean ok = true;
	try {
		if (this.canImport(destination, new DataFlavor[] {TOPICS_FLAVOR}) && destination instanceof Viewpoint.ViewpointPane.Topic) {
			Collection<org.porphyry.presenter.Viewpoint.Topic> topics = transferableToTopics(data);
			((Viewpoint.ViewpointPane.Topic) destination)
				.presenter.linkTopics(topics, "includes");
			this.destination = destination;
		}
	} catch (Exception e) {
		System.err.println(e);
		ok = false;
	}
	return ok;
}

@Override
protected void exportDone(JComponent s, Transferable data, int action) {
	try {
		if (this.destination!=null && action==MOVE) {
			Collection<org.porphyry.presenter.Viewpoint.Topic> topics =
				transferableToTopics(data);
			for (org.porphyry.presenter.Viewpoint.Topic t: topics){
				Collection<org.porphyry.presenter.Viewpoint.Topic> toDel = t.getTopics("includedIn");
				toDel.remove(((org.porphyry.view.Viewpoint.ViewpointPane.Topic)this.destination).presenter);
				t.unlinkTopics(toDel, "includedIn");
			}
		}
	} catch (Exception e) {
		System.err.println(e);
	}
}

public class TopicSelection implements Transferable {//>>>>>>>>>>>>>>>>>>>>>>>>

private Collection<org.porphyry.presenter.Viewpoint.Topic> data;

public TopicSelection(
	Collection<org.porphyry.presenter.Viewpoint.Topic> data
) {
	this.data = data;
}

public DataFlavor[] getTransferDataFlavors() {
	return new DataFlavor[] {TOPICS_FLAVOR};
}

public boolean isDataFlavorSupported(DataFlavor flavor) {
	return TOPICS_FLAVOR.equals(flavor);
}

public Object getTransferData(DataFlavor flavor) 
	throws UnsupportedFlavorException 
{
	if (TOPICS_FLAVOR.equals(flavor))
		return this.data;
	throw new UnsupportedFlavorException(flavor);
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< class TopicSelection

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< class TopicTransferHandler

