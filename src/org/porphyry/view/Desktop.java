//Emulates the java.awt.Desktop class included in Java 6.0
//source : Dem Pilafian, 2005, Public domain
package org.porphyry.view;

import java.lang.reflect.Method;
import java.net.URI;

public class Desktop {

public static Desktop getDesktop() {
	return new Desktop();
}
	
public void browse(URI uri) throws Exception {
	String osName = System.getProperty("os.name");
	if (osName.startsWith("Mac OS")) {
		Class fileMgr = Class.forName("com.apple.eio.FileManager");
		Method openURL = fileMgr.getDeclaredMethod(
			"openURL",
			new Class[] {String.class}
		);
		openURL.invoke(null, new Object[] {uri.toString()});
	} else if (osName.startsWith("Windows")) {
		Runtime.getRuntime().exec("rundll32 url.dll,FileProtocolHandler " + uri);
	} else { //assume Unix or Linux
		String[] browsers = { "firefox", "opera", "konqueror", 
			"epiphany", "mozilla", "netscape" };
		String browser = null;
		for (int count = 0; count < browsers.length && browser == null; count++) {
			if (Runtime.getRuntime().exec(
				new String[] {"which", browsers[count]}
			).waitFor() == 0) {
				browser = browsers[count];
			}
		}
		if (browser == null)
			throw new Exception( "Could not find web browser");
		Runtime.getRuntime().exec(new String[] {browser, uri.toString()});
	}
}

}

