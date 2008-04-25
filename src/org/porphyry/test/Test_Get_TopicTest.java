package test;

import static org.junit.Assert.fail;

import java.io.IOException;

import javax.xml.parsers.ParserConfigurationException;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.porphyry.model.HyperTopicException;
import org.porphyry.model.Topic;
import org.porphyry.model.Viewpoint;
import org.xml.sax.SAXException;

public class Test_Get_TopicTest {
	Viewpoint vp;
	Topic t1, t2;

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
	}

}
