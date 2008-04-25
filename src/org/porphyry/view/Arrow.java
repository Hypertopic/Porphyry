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

import javax.swing.*;
import java.awt.*;
import java.awt.geom.*;

abstract class Arrow extends JComponent {

private Line2D line;
private EquilateralTriangle triangle;
protected final int TRIANGLE_RADIUS = 5;

public abstract Point getSource();

public abstract Point getDestination();

public void doLayout() {
	if (this.isVisible()) {
	Point p1 = this.getSource();
	Point p2 = this.getDestination();
	int deltaX = p2.x-p1.x;
	int deltaY = p2.y-p1.y;
	// In global coordinates :
	int x0 = Math.min(p1.x, p2.x)-TRIANGLE_RADIUS;
	int y0 = Math.min(p1.y, p2.y)-TRIANGLE_RADIUS;
	this.setBounds(
		x0, 
		y0, 
		Math.abs(deltaX)+2*TRIANGLE_RADIUS, 
		Math.abs(deltaY)+2*TRIANGLE_RADIUS
	);
	// In local coordinates :
	this.line = new Line2D.Double(p1.x-x0, p1.y-y0, p2.x-x0, p2.y-y0);
	this.triangle = new EquilateralTriangle(
		(int) Math.round(((double) p1.x+p2.x)/2)-x0, 
		(int) Math.round(((double) p1.y+p2.y)/2)-y0, 
		TRIANGLE_RADIUS, 
		Math.atan2(deltaY, deltaX)
	);
	}
}

public void paint(Graphics g) {
	Graphics2D g2D = (Graphics2D) g;
	g2D.setRenderingHint(
		RenderingHints.KEY_ANTIALIASING,
		RenderingHints.VALUE_ANTIALIAS_ON
	);
	g2D.setColor(this.getForeground());
	g2D.draw(this.line);
	g2D.fill(this.triangle);
}

}
