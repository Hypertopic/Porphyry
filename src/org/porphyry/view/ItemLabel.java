/*
PORPHYRY - Digital space for confronting interpretations about documents

OFFICIAL WEB SITE
http://porphyry.sf.net/

Copyright (C) 2012 Aurelien Benel.

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

import java.awt.*;
import java.awt.event.*;
import java.net.URL;
import javax.swing.*;
import javax.swing.border.*;
import org.porphyry.model.ItemSet;

//TODO Factorization with HighlightLabel
class ItemLabel extends JLabel {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

private static final Color PRIMARY_COLOR2 = new Color(204, 153, 51);
private static final Border ACTIVE_BORDER = new LineBorder(PRIMARY_COLOR2, 2);
private static final Border INACTIVE_BORDER = new EmptyBorder(2, 2, 2, 2);

private ItemSet.Item model;

public ItemLabel(ItemSet.Item model) {
  this.model = model;
  URL thumbnail = model.getThumbnail();
  if (thumbnail==null) {
    this.setText(model.getName());
  } else {
    this.setIcon(new ImageIcon(thumbnail));
    this.setToolTipText(model.getName());
  }
  this.setBorder(INACTIVE_BORDER);
  this.setCursor(new Cursor(Cursor.HAND_CURSOR));	
  this.addMouseListener(
    new MouseAdapter() {
      @Override public void mouseClicked(MouseEvent e) {
        try {
          Desktop.getDesktop().browse(
            ItemLabel.this.model.getResource().toURI()
          );
        } catch (Exception ex) {
          ex.printStackTrace(); //TODO?
        }
      }
      @Override public void mouseEntered(MouseEvent e) {
        ItemLabel.this.setBorder(ACTIVE_BORDER);
      }
      @Override public void mouseExited(MouseEvent e) {
        ItemLabel.this.setBorder(INACTIVE_BORDER);
      }
    }
  );
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ItemLabel
