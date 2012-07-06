/*
PORPHYRY - Digital space for confronting interpretations about documents

OFFICIAL WEB SITE
http://porphyry.sf.net/

Copyright (C) 2011 Aurelien Benel.

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

package org.porphyry.controller;

import javax.swing.*;
import org.porphyry.model.Portfolio;
import org.porphyry.view.PortfolioFrame;

public class Start {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

public static void main(String[] args) throws Exception {
	SwingUtilities.invokeAndWait(new Runnable() {
		public void run() {
			JFrame frame = new PortfolioFrame(
				new Portfolio(
					//TODO
					"nadia@hypertopic.org",
					"http://127.0.0.1:5984/argos/_design/argos/_rewrite/",
					"http://127.0.0.1/~benel/cassandre/"
				)
			);
			frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
			frame.setBounds(0, 0, 800, 600);
			frame.setVisible(true);
		}
	});
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Start
