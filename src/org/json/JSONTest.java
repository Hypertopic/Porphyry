package org.json;

import org.junit.*;
import static org.junit.Assert.*;

public class JSONTest {

private final JSONArray array= new JSONArray();
private final JSONObject object = new JSONObject();

@Before public void setUp() throws Exception {
	// {"A":{}, "B":["one","two","three"]}
	this.object.append("A", new JSONObject());
	this.object.append("B", "one");
	this.object.append("B", "two");
	this.object.append("B", "three");
}

@Test public void getAllJSONObjects() throws Exception {
	assertEquals(1, this.object.getAllJSONObjects("A").size());
}

@Test public void removeKeyValue() throws Exception {
	this.object.remove("B","two");
	this.object.remove("B","one");
	assertEquals(1, this.object.getJSONArray("B").length());
	this.object.remove("B","three");
	assertEquals(1, this.object.length());
}

@Test public void indexOf() throws Exception {
	assertEquals(1, this.object.getJSONArray("B").indexOf("two"));
}

@Test public void contains() throws Exception {
	assertTrue(this.object.getJSONArray("B").contains("two"));
	assertFalse(this.object.getJSONArray("B").contains("four"));
}

@Test public void removeValue() throws Exception {
	this.object.getJSONArray("B").remove("two");
	assertFalse(this.object.getJSONArray("B").contains("two"));
}

}
