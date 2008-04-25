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

import java.util.ResourceBundle;
import javax.swing.*;

public class ExtendedFrame extends JFrame {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

private ProgressMonitor progressMonitor;
int progress = 0;

protected static final ResourceBundle BABEL = 
	ResourceBundle.getBundle("org.porphyry.view.Language");

public ExtendedFrame(String title) {
	super(title);
}

public void showException(Exception e) {
	if (
		e instanceof ClassCastException 
		|| e instanceof NullPointerException
		|| e instanceof java.io.FileNotFoundException
	) {
		e.printStackTrace();
	} else {
		System.err.println(e);
	}
	JOptionPane.showMessageDialog(
		this,
		e.toString(),
		BABEL.getString("WARNING"), 
		JOptionPane.WARNING_MESSAGE
	);
}
	
public void showProgressMonitor(String title, int max) {
	this.progressMonitor = new ProgressMonitor(this, title, "", 0, max);
}

public void setProgress(String note) {
	if (this.progressMonitor!=null) {
		this.progressMonitor.setProgress(this.progress++);
		this.progressMonitor.setNote(note);
	}
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< class ExtendedFrame
