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

package org.porphyry.presenter;

import java.net.*;
import java.util.*;
import java.util.regex.*;
import java.awt.Rectangle;
import java.awt.geom.Rectangle2D;
import org.porphyry.model.LabeledURL;

public class ItemSet implements Cloneable {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

public static final int SOURCE = -1;
public static final int FRAGMENT = -2;
public static final Comparator<LabeledURL> comparator = new Comparator<LabeledURL>() {
	public int compare(LabeledURL one, LabeledURL other) {
		return one.getURL().toString().compareTo(other.getURL().toString());	
	}
	/*
	@Override
	public boolean equals(Object o) {
		return false;
	}
	*/
};

private final Map<LabeledURL, WholeItem> wholeItems = new HashMap<LabeledURL, WholeItem>();

private static final Pattern parentPattern = 
	Pattern.compile("(.*/entity/.*)/(.+)"); //TODO use relative URL ".."?

//TODO a new data structure to optimize getSize(level)?

public Set<LabeledURL> getAll() {
	Set<LabeledURL> c = new TreeSet<LabeledURL>(comparator);
	for(Map.Entry<LabeledURL, WholeItem> entry : this.wholeItems.entrySet()) {
		c.add(entry.getKey());
		WholeItem item = entry.getValue();
		c.addAll(item.getAll());
	}
	return c;
}

public void add(LabeledURL url) {
	String urlString = url.getURL().toString();
	switch (org.porphyry.model.Entity.getDocumentType(urlString)) {
		case FOLDER:
			this.addFolder(url);
			break;
		case SOURCE:
			this.addSource(url);
			break;
		case FRAGMENT:
			this.addFragment(url);
	}
}

public void addAll(Collection<LabeledURL> items) {
	for (LabeledURL url : items) {
		this.add(url);
	}
}

/**
* @return folder level (0 for a folder with no superfolder).
*/
protected int addFolder(LabeledURL url) {
	int level;
	Matcher matcher = parentPattern.matcher(url.getURL().toString());
	if (matcher.matches()) {
		level = 1 + this.addFolder(
			ItemSet.createSafeLabeledURL(
				matcher.group(1)+"/", 
				null
			)
		);
	} else {
		level = 0;
	}
	if (!this.wholeItems.containsKey(url)) {
		this.wholeItems.put(url, new WholeItem(url, level));
	}
	return level;
}

protected WholeItem addSource(LabeledURL url) {
	WholeItem item = this.wholeItems.get(url);
	if (item==null) {
		Matcher matcher = parentPattern.matcher(url.getURL().toString());
		if (matcher.matches()) { //Should always work
			this.addFolder(
				ItemSet.createSafeLabeledURL(
					matcher.group(1)+"/", 
					null
				)
			);
		} 
		item = new WholeItem(url, SOURCE);
		this.wholeItems.put(url, item);
	}
	return item;
}

protected void addFragment(LabeledURL url) {
	Matcher matcher = parentPattern.matcher(url.getURL().toString());
	if (matcher.matches()) {
		this.addSource(
			ItemSet.createSafeLabeledURL(
					matcher.group(1), 
					null
			)
		).add(matcher.group(2), url.getLabel());
	}
}

public void addAll(ItemSet that) {
	for (Map.Entry<LabeledURL, WholeItem> thatEntry : that.wholeItems.entrySet()) {
		WholeItem thisItem = this.wholeItems.get(thatEntry.getKey());
		if (thisItem==null) {
			this.wholeItems.put(
				thatEntry.getKey(), 
				(WholeItem) thatEntry.getValue().clone()
			);
		} else {
			thisItem.addAll(thatEntry.getValue());
		}
	}
}

public void retainAll(ItemSet that) {
	Iterator <Map.Entry<LabeledURL, WholeItem>> i = 
		this.wholeItems.entrySet().iterator();
	while (i.hasNext()) {
		Map.Entry<LabeledURL, WholeItem> thisEntry = i.next();
		WholeItem thatItem = that.wholeItems.get(thisEntry.getKey());
		if (thatItem==null) {
			i.remove();
		} else {
			thisEntry.getValue().retainAll(thatItem);
		}
	}
}

public void clear() {
	this.wholeItems.clear();
}

/**
* Deep and efficient copy.
*/
@Override
public Object clone() {
	ItemSet newSet = new ItemSet();
	for (Map.Entry<LabeledURL, WholeItem> oldItem : this.wholeItems.entrySet()) {
		newSet.wholeItems.put(
			oldItem.getKey(), 
			(WholeItem) oldItem.getValue().clone()
		);
	}
	return newSet;
}

/**
* @param level 
* Portfolio.SOURCE for sources
* Portfolio.FRAGMENT for fragments
* 0 for first folder level, 1 for second, etc.
*/
public int size(int level) {
	int count = 0;
	switch (level) {
		case FRAGMENT:
			for (WholeItem w : this.wholeItems.values()) {
				count+=w.size();
			}
			break;
		case SOURCE:
			for (WholeItem w : this.wholeItems.values()) {
				if (w.isASource()) {
					count++;
				} 
			}
			break;
		default:
			for (WholeItem w : this.wholeItems.values()) {
				if (w.getLevel()==level) {
					count++;
				} 
			}
	}
	return count;
}

public static LabeledURL createSafeLabeledURL(String urlString, String label) {
	LabeledURL labeledURL = null;
	try {
		labeledURL = new LabeledURL(urlString, label);
	} catch (MalformedURLException e) { //Should never go there
		e.printStackTrace();
	}
	return labeledURL;
}

public boolean isEmpty() {
	return this.wholeItems.isEmpty();
}

@Override
public String toString() {
	return this.wholeItems.toString();
}

class WholeItem implements Cloneable {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

private final LabeledURL url;

private final HashSet<Fragment> fragments = new HashSet<Fragment>();

private int level;

public WholeItem(LabeledURL url, int level) {
	this.url = url;
	this.level = level;
}

public boolean isASource() {
	return this.level==SOURCE;
}

public int getLevel() {
	return this.level;
}

public Set<LabeledURL> getAll() {
	final Set<LabeledURL> c = new HashSet<LabeledURL>();
		for (Fragment f : this.fragments) {
			c.add(
				ItemSet.createSafeLabeledURL( 
					this.url.getURL().toString()+"/"+f,
					f.getLabel()
				)
			);	
		}
	return c;
}

public void add(String coordinates, String label) {
	this.add(this.createFragment(coordinates, label));
}

public void add(Fragment newFragment) {
	for (Fragment oldFragment : (Set<Fragment>) this.fragments.clone()) {
		if (oldFragment.intersects(newFragment)) {
			newFragment = newFragment.createUnion(oldFragment);
			this.fragments.remove(oldFragment);
		}
	}
	this.fragments.add(newFragment);
}

public void addAll(WholeItem that) {
	for (Fragment newFragment : that.fragments) {
		this.add(newFragment);
	}
}

public void retainAll(WholeItem that) {
	for (Fragment thisFragment : (Set<Fragment>) this.fragments.clone()) {
		this.fragments.remove(thisFragment);
		boolean found = false;
		for (Fragment thatFragment : that.fragments) {
			if (thatFragment.intersects(thisFragment)) {
				thisFragment = 
					thisFragment.createUnion(thatFragment);
				found = true;
			}
		}
		if (found) {
			this.fragments.add(thisFragment);
		}
	}
}

@Override
public Object clone() {
	WholeItem newItem = new WholeItem(this.url, this.level);
	newItem.fragments.addAll(this.fragments);
	return newItem;
}

public Fragment createFragment(String coordinatesString, String label) {
	String coords[] = coordinatesString.split("\\+");
	switch (coords.length) {
		case 2: 
			return new TextFragment(
				Integer.parseInt(coords[0]), 
				Integer.parseInt(coords[1]),
				label
			);
		case 4: 
			return new ImageFragment(
				Integer.parseInt(coords[0]), 
				Integer.parseInt(coords[1]), 
				Integer.parseInt(coords[2]), 
				Integer.parseInt(coords[3])
			);
		default: 
			return null;
	}
}

public int size() {
	return this.fragments.size();
}

abstract class Fragment implements Cloneable {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

private String label;

public Fragment(String label){
	this.label = label;
}

/**
* @return the fragment parameters as formatted in a URL 
**/
@Override
abstract public String toString();

@Override
abstract public boolean equals(Object that);

@Override 
abstract public Object clone();

abstract public boolean intersects(Fragment that);

abstract public Fragment createUnion(Fragment that);

public String getLabel() {
	return this.label;
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Fragment

class TextFragment extends Fragment {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

final int begin;
final int end;

/**
* @precondition begin LT end
*/
public TextFragment(int begin, int end, String label) {
	super(label);
	this.begin = begin;
	this.end = end;
}

@Override
public boolean intersects(Fragment that) {
	return that instanceof TextFragment && (
		this.begin<=((TextFragment) that).begin
		&& ((TextFragment) that).begin<=this.end
		||
		this.begin<=((TextFragment) that).end
		&& ((TextFragment) that).end<=this.end
	);
}

@Override
public Fragment createUnion(Fragment that) {
	String thisLabel = this.getLabel();
	String thatLabel = that.getLabel();	
	TextFragment thatTextFragment = (TextFragment) that;
	return new TextFragment(
		Math.min(this.begin, thatTextFragment.begin),
		Math.max(this.end, thatTextFragment.end),
		thisLabel + "<br/>" + thatLabel
	);
}

@Override
public String toString() {
	return ""+this.begin+"+"+this.end;
}

@Override
public boolean equals(Object that) {
	return that instanceof TextFragment
		&& ((TextFragment) that).begin==this.begin
		&& ((TextFragment) that).end==this.end;
}

@Override 
public Object clone() {
	return new TextFragment(this.begin, this.end, this.getLabel());
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< TextFragment

class ImageFragment extends Fragment {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

final Rectangle rectangle; 

/**
* @precondition x1 LT x2
* @precondition y1 LT y2
*/
public ImageFragment(int x1, int y1, int x2, int y2) {
	super("");
	this.rectangle = new Rectangle(x1, y1, x2-x1, y2-y1);
}

public ImageFragment(Rectangle2D rectangle) {
	super("");
	this.rectangle = rectangle.getBounds();
}

@Override
public boolean intersects(Fragment that) {
	return that instanceof ImageFragment 
		&& this.rectangle.intersects(((ImageFragment) that).rectangle);
}

@Override
public Fragment createUnion(Fragment that) {
	return new ImageFragment(
		this.rectangle.createUnion(((ImageFragment) that).rectangle)
	);
}

@Override
public String toString() {
	return "" + this.rectangle.x
		+ "+" + this.rectangle.y
		+ "+" + (this.rectangle.x + this.rectangle.width)
		+ "+" + (this.rectangle.y + this.rectangle.height);
}

@Override
public boolean equals(Object that) {
	return that instanceof ImageFragment
		&& ((ImageFragment) that).rectangle.equals(this.rectangle);
}

@Override 
public Object clone() {
	return new ImageFragment(this.rectangle);
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ImageFragment

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< WholeItem

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ItemSet

