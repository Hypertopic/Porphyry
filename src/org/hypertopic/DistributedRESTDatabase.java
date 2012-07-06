/*
HYPERTOPIC - Infrastructure for community-driven knowledge organization systems

OFFICIAL WEB SITE
http://www.hypertopic.org/

Copyright (C) 2012 Aurelien Benel.

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

import org.json.JSONObject;
import java.util.*;

/**
 * Federation of REST databases:
 * reads are scattered among databases, 
 * writes are forwarded to the primary database.
 */
public class DistributedRESTDatabase extends Observable {//>>>>>>>>>>>>>>>>>>>>>

private List<RESTDatabase> databases = new ArrayList();

public DistributedRESTDatabase(String... baseUrls) {
  for (String url : baseUrls) {
    this.databases.add(new RESTDatabase(url));
  }
}

protected RESTDatabase getPrimaryServer() {
  return (RESTDatabase) this.databases.get(0);
}

public JSONObject post(JSONObject object) throws Exception {
  return this.getPrimaryServer().post(object);
}

public synchronized JSONObject getAll(String query) throws Exception {
  Iterator<RESTDatabase> i = this.databases.iterator();
  JSONObject result = i.next().getAll(query);
  while (i.hasNext()) {
    result.putAll(i.next().getAll(query));
  }
  return result;
}

public JSONObject get(String id) throws Exception {
  return this.getPrimaryServer().get(id);
}

public void put(JSONObject object) throws Exception {
  this.getPrimaryServer().put(object);
}

public void delete(JSONObject object) throws Exception {
  this.getPrimaryServer().delete(object);
}

public void startListening() {
  for (RESTDatabase db : this.databases) {
    db.startListening();
  }
}

@Override public void addObserver(Observer o) {
  for (RESTDatabase db : this.databases) {
    db.addObserver(o);
  }
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< DistributedRESTDatabase

