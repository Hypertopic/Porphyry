package org.porphyry.view;

import java.awt.*;
import java.awt.dnd.*;
import java.awt.event.ActionEvent;

import javax.swing.*;

/**
 * Fix for Java bug #6710705
 * http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=6710705
 **/
public class FixedDropTarget extends DropTarget {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>

@Override
protected DropTargetAutoScroller createDropTargetAutoScroller(Component c, Point p) {
	return new FixedDropTargetAutoScroller(c, p); 
} 

class FixedDropTargetAutoScroller extends DropTargetAutoScroller {//>>>>>>>>>>>

private Component  component; 
private Autoscroll autoScroll; 
private Timer      timer; 
private Point      locn; 
private Point      prev; 
private Point      screenLocation; 
private Rectangle  outer = new Rectangle(); 
private Rectangle  inner = new Rectangle(); 
private int        hysteresis = 5; 
	
protected FixedDropTargetAutoScroller(Component c, Point p) { 
	super(c, p); 
	super.stop(); 
	this.component  = c; 
	this.autoScroll = (Autoscroll) this.component; 
	java.awt.Toolkit t  = 
		java.awt.Toolkit.getDefaultToolkit(); 
	Integer    initial  = new Integer(100); 
	Integer    interval = new Integer(100); 
	try { 
		initial = 
			(Integer)t.getDesktopProperty("DnD.Autoscroll.initialDelay"); 
	} catch (Exception e) { 
		// ignore 
	} 
	try { 
		interval = 
			(Integer)t.getDesktopProperty("DnD.Autoscroll.interval"); 
	} catch (Exception e) { 
		// ignore 
	} 
	this.timer  = new Timer(interval.intValue(), this); 
	this.timer.setCoalesce(true); 
	this.timer.setInitialDelay(initial.intValue()); 
	this.locn = p; 
	this.prev = p; 
	this.screenLocation = new Point(p); 
	SwingUtilities.convertPointToScreen(this.screenLocation, c); 
	try { 
		this.hysteresis = 
			((Integer)t.getDesktopProperty("DnD.Autoscroll.cursorHysteresis")).intValue (); 
	} catch (Exception e) { 
		// ignore 
	} 
	this.timer.start(); 
} 

/** 
 * update the geometry of the autoscroll region 
 */ 
private void updateRegion() { 
	Insets    i    = this.autoScroll.getAutoscrollInsets(); 
	Dimension size = this.component.getSize(); 
	if (size.width != this.outer.width || size.height != 
		this.outer.height) 
		this.outer.setBounds(0, 0, size.width, size.height); 
	if (this.inner.x != i.left || this.inner.y != i.top) 
		this.inner.setLocation(i.left, i.top); 
	int newWidth  = size.width -  (i.left + i.right); 
	int newHeight = size.height - (i.top  + i.bottom); 
	if (newWidth != this.inner.width || newHeight != 
		this.inner.height) 
		this.inner.setSize(newWidth, newHeight); 
} 

/** 
 * cause autoscroll to occur 
 * <P> 
 * @param newLocn the <code>Point</code> 
 */ 
@Override
protected synchronized void updateLocation(Point newLocn) { 
	this.prev = this.locn; 
	this.locn = newLocn; 
	this.screenLocation = new Point(this.locn); 
	SwingUtilities.convertPointToScreen(this.screenLocation, this.component); 
	if (Math.abs(this.locn.x - this.prev.x) > this.hysteresis || 
			Math.abs(this.locn.y - this.prev.y) > this.hysteresis) { 
		if (this.timer.isRunning()) { 
			this.timer.stop(); 
		} 
	} else { 
		if (!this.timer.isRunning()) { 
			this.timer.start(); 
		} 
	}
} 

/** 
 * cause autoscrolling to stop 
 */ 
@Override
protected void stop() { 
	this.timer.stop(); 
}

/** 
 * cause autoscroll to occur 
 * <P> 
 * @param e the <code>ActionEvent</code> 
 */ 
@Override
public synchronized void actionPerformed(ActionEvent e) { 
	updateRegion(); 
	Point componentLocation = new Point(this.screenLocation); 
	SwingUtilities.convertPointFromScreen(componentLocation, this.component); 
	if (this.outer.contains(componentLocation) && 
			!this.inner.contains(componentLocation)) { 
		this.autoScroll.autoscroll(componentLocation); 
	} 
} 

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< class FixedDropTargetAutoScroller

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< class FixedDropTarget extends DropTarget
