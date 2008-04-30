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

public class ItemSet implements Cloneable {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

public static final int SOURCE = -1;
public static final int FRAGMENT = -2;
public static final Comparator<URL> comparator = new Comparator<URL>() {
	public int compare(URL one, URL other) {
		return one.toString().compareTo(other.toString());	
	}
	public boolean equals(Object o) {
		return false;
	}
};

private final Map<URL, WholeItem> wholeItems = new HashMap<URL, WholeItem>();

private static final Pattern parentPattern = 
	Pattern.compile("(.*/entity/.*)/(.+)"); //TODO use relative URL ".."?

//TODO a new data structure to optimize getSize(level)?

public Set<URL> getAll() {
	Set<URL> c = new TreeSet<URL>(comparator);
	for(Map.Entry<URL, WholeItem> entry : this.wholeItems.entrySet()) {
		c.add(entry.getKey());
		WholeItem item = entry.getValue();
		c.addAll(item.getAll());
	}
	return c;
}

public void add(URL url) {
	String urlString = url.toString();
	if (urlString.endsWith("/")) {
		this.addFolder(url);
	} else if (urlString.contains("+")) {
		this.addFragment(url);
	} else {
		this.addSource(url);
	}
}

public void addAll(Collection<URL> items) {
	for (URL url : items) {
		this.add(url);
	}
}

/**
* @return folder level (0 for a folder with no superfolder).
*/
protected int addFolder(URL url) {
	int level;
	Matcher matcher = parentPattern.matcher(url.toString());
	if (matcher.matches()) {
		level = 1 + this.addFolder(
			ItemSet.createSafeURL(matcher.group(1)+"/")
		);
	} else {
		level = 0;
	}
	if (!this.wholeItems.containsKey(url)) {
		this.wholeItems.put(url, new WholeItem(url, level));
	}
	return level;
}

protected WholeItem addSource(URL url) {
	WholeItem item = this.wholeItems.get(url);
	if (item==null) {
		Matcher matcher = parentPattern.matcher(url.toString());
		if (matcher.matches()) { //Should always work
			this.addFolder(
				createSafeURL(matcher.group(1)+"/")
			);
		} 
		item = new WholeItem(url, SOURCE);
		this.wholeItems.put(url, item);
	}
	return item;
}

protected void addFragment(URL url) {
	Matcher matcher = parentPattern.matcher(url.toString());
	if (matcher.matches()) {
		this.addSource(
			ItemSet.createSafeURL(matcher.group(1))
		).add(matcher.group(2));
	}
}

public void addAll(ItemSet that) {
	for (Map.Entry<URL, WholeItem> thatEntry : that.wholeItems.entrySet()) {
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
	Iterator <Map.Entry<URL, WholeItem>> i = 
		this.wholeItems.entrySet().iterator();
	while (i.hasNext()) {
		Map.Entry<URL, WholeItem> thisEntry = i.next();
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
//@Override
public Object clone() {
	ItemSet newSet = new ItemSet();
	for (Map.Entry<URL, WholeItem> oldItem : this.wholeItems.entrySet()) {
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

public static URL createSafeURL(String string) {
	URL url = null;
	try {
		url = new URL(string);
	} catch (MalformedURLException e) { //Should never go there
		e.printStackTrace();
	}
	return url;
}

public boolean isEmpty() {
	return this.wholeItems.isEmpty();
}

//@Override
public String toString() {
	return this.wholeItems.toString();
}

class WholeItem implements Cloneable {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

private final URL url;

private final HashSet<Fragment> fragments = new HashSet<Fragment>();

private int level;

public WholeItem(URL url, int level) {
	this.url = url;
	this.level = level;
}

public boolean isASource() {
	return this.level==SOURCE;
}

public int getLevel() {
	return this.level;
}

public Set<URL> getAll() {
	final Set<URL> c = new HashSet<URL>();
		for (Fragment f : this.fragments) {
			c.add(
				ItemSet.createSafeURL(
					this.url.toString()+"/"+f
				)
			);	
		}
	return c;
}

public void add(String coordinates) {
	this.add(this.createFragment(coordinates));
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
					thatFragment.createUnion(thisFragment);
				found = true;
			}
		}
		if (found) {
			this.fragments.add(thisFragment);
		}
	}
}

//@Override
public Object clone() {
	WholeItem newItem = new WholeItem(this.url, this.level);
	newItem.fragments.addAll(this.fragments);
	return newItem;
}

public Fragment createFragment(String coordinatesString) {
	String coords[] = coordinatesString.split("\\+");
	switch (coords.length) {
		case 2: 
			return new TextFragment(
				Integer.parseInt(coords[0]), 
				Integer.parseInt(coords[1])
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

/**
* @return the fragment parameters as formatted in a URL 
**/
//@Override
abstract public String toString();

//@Override
abstract public boolean equals(Object that);

//@Override 
abstract public Object clone();

abstract public boolean intersects(Fragment that);

abstract public Fragment createUnion(Fragment that);

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Fragment

class TextFragment extends Fragment {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

final int begin;
final int end;

/**
* @precondition begin LT end
*/
public TextFragment(int begin, int end) {
	this.begin = begin;
	this.end = end;
}

//@Override
public boolean intersects(Fragment that) {
	return that instanceof TextFragment && (
		this.begin<=((TextFragment) that).begin
		&& ((TextFragment) that).begin<=this.end
		||
		this.begin<=((TextFragment) that).end
		&& ((TextFragment) that).end<=this.end
	);
}

//@Override
public Fragment createUnion(Fragment that) {
	return new TextFragment(
		Math.min(this.begin, ((TextFragment) that).begin),
		Math.max(this.end, ((TextFragment) that).end)
	);
}

//@Override
public String toString() {
	return ""+this.begin+"+"+this.end;
}

//@Override
public boolean equals(Object that) {
	return that instanceof TextFragment
		&& ((TextFragment) that).begin==this.begin
		&& ((TextFragment) that).end==this.end;
}

//@Override 
public Object clone() {
	return new TextFragment(this.begin, this.end);
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< TextFragment

class ImageFragment extends Fragment {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

final Rectangle rectangle; 

/**
* @precondition x1 LT x2
* @precondition y1 LT y2
*/
public ImageFragment(int x1, int y1, int x2, int y2) {
	this.rectangle = new Rectangle(x1, y1, x2-x1, y2-y1);
}

public ImageFragment(Rectangle2D rectangle) {
	this.rectangle = rectangle.getBounds();
}

//@Override
public boolean intersects(Fragment that) {
	return that instanceof ImageFragment 
		&& this.rectangle.intersects(((ImageFragment) that).rectangle);
}

//@Override
public Fragment createUnion(Fragment that) {
	return new ImageFragment(
		this.rectangle.createUnion(((ImageFragment) that).rectangle)
	);
}

//@Override
public String toString() {
	return "" + this.rectangle.x
		+ "+" + this.rectangle.y
		+ "+" + (this.rectangle.x + this.rectangle.width)
		+ "+" + (this.rectangle.y + this.rectangle.height);
}

//@Override
public boolean equals(Object that) {
	return that instanceof ImageFragment
		&& ((ImageFragment) that).rectangle.equals(this.rectangle);
}

//@Override 
public Object clone() {
	return new ImageFragment(this.rectangle);
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ImageFragment

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< WholeItem

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ItemSet

