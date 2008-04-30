package org.porphyry.test;

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

	/* From CEDRICOOP
	public void testdeletetopic() {
		
		try {
			Topic topic= new Topic("http://test.hypertopic.org/argos/viewpoint/3/topic/114/");
			try {
				topic.httpDelete();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				fail("delete io echec");
			} catch (HyperTopicException e) {
				// TODO Auto-generated catch block
				fail("delete hypertopic echec");
			}
		} catch (MalformedURLException e) {
			// TODO Auto-generated catch block
			fail("init echec");
		}
	
	}
	
	public void testHttpPostCreate() {
		try {
			Topic topic= new Topic("http://test.hypertopic.org/argos/viewpoint/3/topic/");
			topic.setName("tagadatsointsoin3");
			try {
				topic.httpPostCreate();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				fail("io echec");
			} catch (HyperTopicException e) {
				// TODO Auto-generated catch block
				fail("Création hypertopic echec");
			}
			try {
				topic.httpGet(false);
			} catch (HyperTopicException e) {
				// TODO Auto-generated catch block
				fail("get echec hypertopic");
			} catch (IOException e) {
				// TODO Auto-generated catch block
				fail("get echec io");
			} catch (SAXException e) {
				// TODO Auto-generated catch block
				fail("get echec saxe");
			} catch (ParserConfigurationException e) {
				// TODO Auto-generated catch block
				fail("get echec parser");
			}
		} catch (MalformedURLException e) {
			// TODO Auto-generated catch block
			fail("initialisation echec");
		}		
	}*/
	
	/* From COLINFRA
	@Before
	public void setUp() throws Exception {
		vp = new Viewpoint("http://test.hypertopic.org/argos/viewpoint/");
		vp.httpPostCreate();
		t1 = new Topic(vp.getURL() + "topic/");
		t1.setName("Topic n°1");
		t1.httpPostCreate();
		vp.addTopic(t1.getURL().toString());
		
		t2 = new Topic(vp.getURL() + "topic/");
		t2.setName("Topic n°2");
		t2.httpPostCreate();
		t2.addRelatedTopic("Relation", t1.getURL().toString());
		vp.addTopic(t2.getURL().toString());
		
	}

	@After
	public void tearDown() throws Exception {
	}

	@Test
	public void testHttpGet() {
		
		// Test : le topic est-il bien conforme à son schéma XML ?
		try {
			t1.httpGet(false);	// TODO: Réparer Java (le test fait tout planter)
		} catch (HyperTopicException e) {
			fail("Erreur HyperTopicException");
			e.printStackTrace();
		} catch (IOException e) {
			fail ("Erreur IOException");
			e.printStackTrace();
		} catch (SAXException e) {
			fail("Résultat non valide");
			e.printStackTrace();
		} catch (ParserConfigurationException e) {
			fail("Impossible de trouver le fichier de validation");
			e.printStackTrace();
		}
		
		// Test : Le viewpoint existe-t-il ?
		try {
			vp.httpGet(false);
		} catch (Exception e) {
			fail("Viewpoint introuvable");
			e.printStackTrace();
		}
		
		// Test : Les relations entre topics sont-elles bonnes ?
		System.out.println("== T1 " + t1.getURL().toString() + " ==");
		System.out.println(t1.toXML());
		System.out.println("== T2 " + t2.getURL().toString() + " ==");
		System.out.println(t2.toXML());
		if(!t2.getRelatedTopics("Relation").contains(t1.getURL())) {
			System.out.println("Relations : " + t2.getRelatedTopics("Relation").toString());
			fail("t2 ne contient pas t1");
		}
	}*/
}
