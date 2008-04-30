/*
* Based on source code by Romain Vimont on developpez.com
* TODO replace with the single instance framework provided by javax.jnlp 
* in Java 6, especially ServiceManager, SingleInstanceListener,
* SingleInstanceService
*/
package org.porphyry.view;

import java.io.*;
import java.net.*;
import java.util.*;
import java.util.logging.Logger;

public abstract class SingleInstance {//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

private int port;
private String message;

public SingleInstance(int port, String message) {
	assert port > 0 && port < 1 << 16 : "Port must be in the range 1-65535";
	assert message != null : "The message shouldn't be null";
	this.port = port;
	this.message = message;
}

protected String getMessage() {
	return this.message;
}

protected abstract void runOnReceive();

public boolean isUnique() {
	boolean unique;
	try {
		final ServerSocket server = new ServerSocket(this.port);
		unique = true;
		Thread portListenerThread = new Thread("UniqueInstance-PortListenerThread") {
			{
				setDaemon(true);
			}
			@Override public void run() {
				while (true) {
					try {
						final Socket socket = server.accept();
						new Thread("UniqueInstance-SocketReceiver") {
							{
								setDaemon(true);
							}
							@Override public void run() {
								receive(socket);
							}
						}.start();
					} catch(IOException e) {
						Logger.getLogger("UniqueInstance").warning("Socket binding timeout.");
					}
				}
			}
		};
		portListenerThread.start();
	} catch(IOException e) {
		unique = false;
		send();
	}
	return unique;
}

private void send() {
	PrintWriter pw = null;
	try {
		Socket socket = new Socket("localhost", this.port);
		pw = new PrintWriter(socket.getOutputStream());
		pw.write(this.message);
	} catch(IOException e) {
		Logger.getLogger("UniqueInstance").warning("Socket writing failure.");
	} finally {
		if(pw != null)
			pw.close();
	}
}

private void receive(Socket socket) {
	Scanner sc = null;
	try {
		socket.setSoTimeout(5000);
		sc = new Scanner(socket.getInputStream());
		if (sc.hasNextLine()) {
			this.message = sc.nextLine();
		}
		this.runOnReceive(); 
	} catch(IOException e) {
		Logger.getLogger("UniqueInstance").warning("Socket reading failure.");
	} finally {
		if(sc != null)
			sc.close();
	}
}

}//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< class SingleInstance
