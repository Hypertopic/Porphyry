package org.porphyry.view;

import java.awt.dnd.DropTargetDragEvent;
import java.awt.dnd.DropTargetDropEvent;
import java.awt.dnd.DropTargetEvent;
import java.awt.dnd.DropTargetListener;

public class VisibleDropTargetListener implements DropTargetListener {//>>>>>>>

@Override
public void dragEnter(DropTargetDragEvent event) {
	((Highlightable) event.getDropTargetContext().getComponent())
		.setHighlight(true);
}

@Override
public void dragExit(DropTargetEvent event) {
	((Highlightable) event.getDropTargetContext().getComponent())
	.setHighlight(false);
}

@Override
public void dragOver(DropTargetDragEvent event) {}

@Override
public void drop(DropTargetDropEvent event) {
	((Highlightable) event.getDropTargetContext().getComponent())
	.setHighlight(false);
}

@Override
public void dropActionChanged(DropTargetDragEvent event) {}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< class VisibleDropTargetListener
