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

package org.porphyry.view;

import java.awt.*;
import java.awt.dnd.*;
import javax.swing.*;

public class ScrollablePanel extends JPanel 
	implements Scrollable, Autoscroll {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

private static int MARGIN = 20;
private final int unit;

public ScrollablePanel(int unit) {
	super();
	this.unit = unit; 
}

protected int getPartiallyExposed(Rectangle r, int direction) {
	return (direction>0)
		? (r.y + r.height) % this.unit
		: ((r.y % this.unit) == 0)
			? 0
			: this.unit - r.y % this.unit;
}

@Override
public Dimension getPreferredScrollableViewportSize() {
	return this.getParent().getSize();
}

@Override
public int getScrollableUnitIncrement(Rectangle r, int ori, int direction) {
	return (this.unit) - this.getPartiallyExposed(r, direction);
}

@Override
public int getScrollableBlockIncrement(Rectangle r, int ori, int direction) {
	return r.height - this.getPartiallyExposed(r, direction);
}

@Override
public boolean getScrollableTracksViewportWidth() {
	return true;
}

@Override
public boolean getScrollableTracksViewportHeight() {
	return false;
}

@Override
public void autoscroll(Point location) {
	Rectangle visible = this.getVisibleRect();
	int topShift = visible.y + MARGIN - location.y;
	int leftShift = visible.x + MARGIN - location.x; //TODO test
	int bottomShift = location.y + MARGIN - visible.y - visible.height;
	int rightShift =  location.x + MARGIN - visible.x - visible.width; //TODO test
	if (topShift > 0) 
		visible.y -= topShift;
	if (leftShift > 0) 
		visible.x -= leftShift;
	if (bottomShift > 0) 
		visible.y += bottomShift;
	if (rightShift > 0) 
		visible.x += rightShift;
	this.scrollRectToVisible(visible);
}

@Override
public Insets getAutoscrollInsets() {
	Rectangle visible = this.getVisibleRect();
	return new Insets(
		visible.y + MARGIN, //top 
		visible.x + MARGIN, //left
		this.getHeight() - (visible.y + visible.height) + MARGIN, //bottom
		this.getWidth() - (visible.x + visible.width) + MARGIN //right
	);
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

