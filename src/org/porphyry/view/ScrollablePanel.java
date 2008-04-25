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
import javax.swing.*;

public class ScrollablePanel extends JPanel implements Scrollable {

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

public Dimension getPreferredScrollableViewportSize() {
	return this.getParent().getSize();
}

public int getScrollableUnitIncrement(Rectangle r, int ori, int direction) {
	return (this.unit) - this.getPartiallyExposed(r, direction);
}

public int getScrollableBlockIncrement(Rectangle r, int ori, int direction) {
	return r.height - this.getPartiallyExposed(r, direction);
}

public boolean getScrollableTracksViewportWidth() {
	return true;
}

public boolean getScrollableTracksViewportHeight() {
	return false;
}

};

