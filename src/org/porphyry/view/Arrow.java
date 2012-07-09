/*
PORPHYRY - Digital space for confronting interpretations about documents

OFFICIAL WEB SITE
http://porphyry.sf.net/

Copyright (C) 2006-2012 Aurelien Benel.

LEGAL ISSUES
This program is free software; you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the license, or (at your option) any later 
version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY 
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A 
PARTICULAR PURPOSE. See the GNU General Public License for more details: 
http://www.gnu.org/licenses/gpl.html
*/

package org.porphyry.view;

import javax.swing.*;
import java.awt.*;
import java.awt.geom.*;

class Arrow extends JComponent {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

private Line2D line;
private EquilateralTriangle triangle;
private static final int TRIANGLE_RADIUS = 5;
private static final Color PRIMARY_COLOR1 = new Color(153, 51, 00);

private Point p1;
private Point p2;

public Arrow(Point source, Point destination) {
  this.p1 = source;
  this.p2 = destination;
	this.setForeground(PRIMARY_COLOR1);
}

/**
 * An arrow does not prevent components underneath to get mouse events.
 */
@Override public boolean contains(int x, int y) {
	return false; 
}

@Override public void doLayout() {
	if (this.isVisible()) {
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

@Override public void paint(Graphics g) {
	Graphics2D g2D = (Graphics2D) g;
	g2D.setRenderingHint(
		RenderingHints.KEY_ANTIALIASING,
		RenderingHints.VALUE_ANTIALIAS_ON
	);
	g2D.setColor(this.getForeground());
	g2D.draw(this.line);
	g2D.fill(this.triangle);
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Arrow

