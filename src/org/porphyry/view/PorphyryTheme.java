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
import javax.swing.plaf.*;
import javax.swing.plaf.metal.*;
import java.awt.*;

public class PorphyryTheme /*extends OceanTheme*/ {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

public static int SHORTCUT_KEY =
	 Toolkit.getDefaultToolkit().getMenuShortcutKeyMask();

public static final ColorUIResource PRIMARY_COLOR1 = 
	new ColorUIResource(153, 51, 00);

public static final ColorUIResource PRIMARY_COLOR2 = 
	new ColorUIResource(204, 153, 51);

public static final Color DARK_GRAY = new Color(110, 110, 110);

public static final Color LIGHT_GRAY = new Color(200, 200, 200);

/*
public static final Color TRANSLUCENT_PRIMARY_COLOR1 =
	new Color(153, 51, 00, 127);
*/

public static final Color TRANSLUCENT_PRIMARY_COLOR2 =
	new Color(204, 153, 51, 127);

/*
protected ColorUIResource getPrimary1() {
	return PRIMARY_COLOR1;
}

protected ColorUIResource getPrimary2() {
	return PRIMARY_COLOR2; 
}

protected ColorUIResource getPrimary3() {
	return PRIMARY_COLOR2; 
}

protected ColorUIResource getSecondary1() {
	return new ColorUIResource(Color.GRAY);
}

protected ColorUIResource getSecondary2() {
	return new ColorUIResource(Color.LIGHT_GRAY); 
}

public static Color getHighlightColor(int rank) {
	switch (rank) {
		case 0 : return Color.getHSBColor(.17f, .8f, 1f);
		case 1 : return Color.getHSBColor(.30f, .8f, 1f);
		case 2 : return Color.getHSBColor(.45f, .8f, 1f);
		case 3 : return Color.getHSBColor(.93f, .8f, 1f);
		default : return Color.getHSBColor(.05f, .8f, 1f);
	}
}

public String getName() {
	return "Porphyry Stone";
}
*/

public static void use() {
	try {
//		System.out.println("DEBUG: "+UIManager.getDefaults());

//		PorphyryTheme theme = new PorphyryTheme();
//		MetalLookAndFeel.setCurrentTheme(theme);
//		UIManager.setLookAndFeel(new MetalLookAndFeel());
		UIManager.put("TabbedPane.selected", Color.WHITE);
		UIManager.put("TabbedPane.focus", Color.WHITE);
		UIManager.put("TabbedPane.contentAreaColor", Color.WHITE);
		UIManager.put(
			"TabbedPane.borderHightlightColor", Color.LIGHT_GRAY
		);
		UIManager.put( "TabbedPane.darkShadow", Color.GRAY);
	} catch (Exception e) {
		System.err.println(e);
	}
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< class PorphyryTheme
