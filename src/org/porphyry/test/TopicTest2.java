package src.org.porphyry.test;

import java.io.IOException;
import java.net.MalformedURLException;

import javax.xml.parsers.ParserConfigurationException;

import org.xml.sax.SAXException;

import src.org.porphyry.model.HyperTopicException;
import src.org.porphyry.model.Topic;
import src.org.porphyry.model.Viewpoint;
import junit.framework.TestCase;

public class TopicTest extends TestCase {

	protected void setUp() throws Exception {
	}

	protected void tearDown() throws Exception {
	}

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
		/*
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
		
	
		*/
		
	}

}
