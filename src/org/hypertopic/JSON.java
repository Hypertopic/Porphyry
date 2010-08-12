/*
HYPERTOPIC - Infrastructure for community-driven knowledge organization systems

OFFICIAL WEB SITE
http://www.hypertopic.org/

Copyright (C) 2010 Aurelien Benel.

LEGAL ISSUES
This library is free software; you can redistribute it and/or modify it under
the terms of the GNU Lesser General Public License as published by the Free 
Software Foundation, either version 3 of the license, or (at your option) any
later version.
This library is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details:
http://www.gnu.org/licenses/lgpl.html
*/

package org.hypertopic;

import org.json.*;

public class JSON {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

/**
 * @return the index of the first occurrence of the specified value
 * or -1 if the array does not contain the element.
 */
public static int indexOf(JSONArray array, String value) 
	throws JSONException
{
	int i = 0;
	boolean found = false;
	while (i<array.length() && !found) {
		found = array.getString(i).equals(value);
		i++;
	}
	return (found)?i-1:-1;
}

public static boolean contains(JSONArray array, String value) 
	throws JSONException
{
	return indexOf(array, value)>-1;
}

/**
 * Inverse function of JSONObject.append
 */
public static void remove(JSONObject object, String key, String value) 
	throws JSONException
{
	JSONArray array = object.getJSONArray(key);
	int i = indexOf(array, value);
	if (i>-1) array.remove(i); 
	if (array.length()==0) {
		object.remove(key);
	} 
}

/**
 * @return the existing value, or a new empty one
 */
public static JSONObject getOrCreate(JSONObject object, String key)
	throws JSONException
{
	JSONObject o = object.optJSONObject(key);
	if (o == null) {
		o = new JSONObject();
		object.put(key, o);
	}
	return o;
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< JSON
