package org.porphyry.test;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URISyntaxException;

import org.porphyry.model.Entity;
import org.porphyry.model.HyperTopicException;
import junit.framework.TestCase;

public class EntityTest extends TestCase {

	protected void setUp() throws Exception {
		super.setUp();
	}

	protected void tearDown() throws Exception {
		super.tearDown();
	}

	
	public void httpDelete(){
		
			try {
				Entity entity = new Entity("http://test.hypertopic.org/argos/entity/test/");
				try {
					entity.httpDelete();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					fail("echec delete io");
				} catch (HyperTopicException e) {
					// TODO Auto-generated catch block
					fail("echec delete hypertopic");
				}
			
			} catch (MalformedURLException e) {
				// TODO Auto-generated catch block
				fail("echec malformed");
			} catch (URISyntaxException e) {
				// TODO Auto-generated catch block
				fail("echec urissyntax");
			}
			
	}
	
	
	
	
	
	
	
	public void testHttpPostCreate() {
		/*
		try {
			Entity entity = new Entity("http://test.hypertopic.org/argos/entity/test/");
			entity.addAttribute("WAAZUUUP", "Aaaaaaahhh");
			try {
				entity.httpPut();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				fail("echec put io");
			} catch (HyperTopicException e) {
				// TODO Auto-generated catch block
				fail("echec put hypertopic");
			}
		} catch (MalformedURLException e) {
			// TODO Auto-generated catch block
			fail("echec malformed");
		} catch (URISyntaxException e) {
			// TODO Auto-generated catch block
			fail("echec urissyntax");
		}*/
}

}
