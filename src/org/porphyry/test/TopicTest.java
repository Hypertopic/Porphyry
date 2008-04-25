package test;

import static org.junit.Assert.*;

import javax.print.DocFlavor.URL;

import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;
import org.porphyry.model.*;

public class TopicTest {
	static Topic t;
	static Viewpoint v;
	
	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
		v = new Viewpoint("http://test.hypertopic.org/argos/viewpoint/");
		v.setName("monviewpoint");
		v.httpPostCreate();
		
		java.net.URL u = v.getURL();
		
		t = new Topic(u.toString()+"topic/");
	}

	@AfterClass
	public static void tearDownAfterClass() throws Exception {
		System.out.println(((java.net.URL)t.getURL()).toString());
		//t.httpDelete();
		//v.httpDelete();
	}

	@Test
	public void testHttpGet() {
		try {
			
			t.setName("montopic");
			t.httpPostCreate();		
			t.httpGet(true);
			
		} catch (Exception e) {
			fail(e.toString());
		}
	}

}
