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
import java.awt.Component;
import java.awt.datatransfer.*;
import java.io.IOException;
import javax.swing.*;

public class TopicsTransferHandler extends TransferHandler {//>>>>>>>>>>>>>>>>>

private int action = TransferHandler.NONE;

private static final TopicsTransferHandler singleton = 
	new TopicsTransferHandler();

public static final DataFlavor TOPICS_FLAVOR = new DataFlavor(
	Collection.class, "topics"
);

public static TopicsTransferHandler getSingleton() {
	return singleton;
}

protected static Collection<org.porphyry.presenter.Viewpoint.Topic> getSource(TransferSupport transfer) 
	throws UnsupportedFlavorException, IOException
{
	return (Collection<org.porphyry.presenter.Viewpoint.Topic>)
		transfer.getTransferable().getTransferData(TOPICS_FLAVOR);
}

protected static org.porphyry.presenter.Viewpoint.Topic getTarget(TransferSupport transfer) {
	Component c = transfer.getComponent();
	return (c instanceof Viewpoint.ViewpointPane.Topic) 
		? ((Viewpoint.ViewpointPane.Topic) c).presenter
		: null;
}

@Override
public int getSourceActions(JComponent source) {
	return COPY_OR_MOVE;
}

@Override
protected Transferable createTransferable(JComponent source) {
	Collection<org.porphyry.presenter.Viewpoint.Topic> c = null;
	if (source instanceof Viewpoint.ViewpointPane.Topic) {
		c = ((Viewpoint.ViewpointPane.Topic) source).getActiveTopics();	
	}	
	return new TopicSelection(c);
}

@Override
public boolean canImport(TransferSupport transfer) {
	try {
		Component target = transfer.getComponent();
		return transfer.isDataFlavorSupported(TOPICS_FLAVOR)
			&& target instanceof Highlightable
			&& !getSource(transfer).contains(getTarget(transfer));//TODO must check that it does no cycle
	} catch (Exception e) {
		System.err.println("canImport "+e);
		return false;
	}
}

protected int getAction(TransferSupport transfer) {
	int a = (transfer.isDrop())
		? transfer.getDropAction()
		: this.action;
	System.out.println("DEBUG action "+a);
	return a;
}

@Override
public boolean importData(TransferSupport transfer) {
	boolean ok = true;
	try {
		if (this.canImport(transfer)) {
			Collection <org.porphyry.presenter.Viewpoint.Topic> source =
				getSource(transfer);
			org.porphyry.presenter.Viewpoint.Topic target =
				getTarget(transfer);
			if (this.getAction(transfer)==TransferHandler.MOVE) {
				for (org.porphyry.presenter.Viewpoint.Topic t : source) {
					t.unlinkFromParents();
				}
			}
			if (target!=null) {
				target.link(source);
			}
		}
	} catch (Exception e) {
		e.printStackTrace();
		ok = false;
	}
	return ok;
}

@Override
protected void exportDone(JComponent source, Transferable data, int action) {
	this.action = action;
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

