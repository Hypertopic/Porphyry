package org.porphyry.view;


import java.awt.EventQueue;
import java.awt.LayoutManager;

import javax.swing.JFrame;
import javax.swing.JPanel;
import java.awt.BorderLayout;

import javax.swing.DefaultListModel;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import java.awt.event.ActionListener;
import java.awt.event.ActionEvent;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;

import javax.swing.JList;

import org.porphyry.model.Portfolio;


public class Launcher {

	public JFrame frame;
	private JTextField textFieldUser;
	private JTextField textField_1;

	/**
	 * Launch the application.
	 */
	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
					Launcher window = new Launcher();
					window.frame.setVisible(true);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		});
	}

	/**
	 * Create the application.
	 */
	public Launcher() {
		initialize();
	}

	public  String getListofServer(DefaultListModel<String> dm){
		if (dm.isEmpty()) {
			return textField_1.getText();
		} else {
			String s = new String();
			for (int i = 0; i < dm.getSize(); i++) {
				s+=dm.getElementAt(i);
				System.out.println("Serveur");
				System.out.println(s);
			}
			
			return s;
			
		}
		
	}
	
	/**
	 * Initialize the contents of the frame.
	 */
	private void initialize() {
		frame = new JFrame();
		frame.setBounds(100, 100, 450, 300);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		
		JPanel panel = new JPanel();
		frame.getContentPane().add(panel, BorderLayout.NORTH);
		
		JPanel panel_1 = new JPanel();
		frame.getContentPane().add(panel_1, BorderLayout.SOUTH);
		
		JButton btnNewButton_1 = new JButton("Lancer");
		panel_1.add(btnNewButton_1);
		
		final DefaultListModel dm = new DefaultListModel();

		
		btnNewButton_1.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent arg0) {
				String servers = getListofServer(dm);
				System.out.println("serveur : "+servers+",");
				
				if (servers.isEmpty()) {
					JFrame frame = new PortfolioFrame(new Portfolio(textFieldUser.getText()));
					frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
					frame.setBounds(0, 0, 800, 600);
					frame.setVisible(true);
				} else {
					JFrame frame = new PortfolioFrame(new Portfolio(textFieldUser.getText(),servers));
					frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
					frame.setBounds(0, 0, 800, 600);
					frame.setVisible(true);
				}			
			}
		});
		
		JButton btnNewButton = new JButton("Fermer");
		btnNewButton.addActionListener(new ActionListener() {
			
			@Override
			public void actionPerformed(ActionEvent arg0) {
				frame.dispose();
				
			}
		});
		
		panel_1.add(btnNewButton);
		
		JPanel panel_2 = new JPanel();
		frame.getContentPane().add(panel_2, BorderLayout.CENTER);

		JLabel lblNewLabel = new JLabel("Utilisateur :");
		panel_2.add(lblNewLabel, "1, 2, right, default");
		
		textFieldUser = new JTextField();
		panel_2.add(textFieldUser, "2, 2, fill, default");
		textFieldUser.setColumns(10);
		
		JLabel lblNewLabel_1 = new JLabel("Serveurs :");
		panel_2.add(lblNewLabel_1, "1, 4, right, default");
		
		textField_1 = new JTextField();
		panel_2.add(textField_1, "2, 4, fill, default");
		textField_1.setColumns(10);
		final JList list = new JList();

		
		list.addKeyListener(new KeyListener() {
			
			public void keyTyped(KeyEvent arg0) {
				// TODO Auto-generated method stub
				
			}
			
			public void keyReleased(KeyEvent arg0) {
				// TODO Auto-generated method stub
				
			}
			
			public void keyPressed(KeyEvent e) {
				// TODO Auto-generated method stub
				if (e.getKeyCode() == KeyEvent.VK_DELETE) {
					if (!dm.isEmpty()) {
						dm.remove(list.getSelectedIndex());
	                    list.revalidate();
					}
                    
                }
				
			}
		});
		
		panel_2.add(list, "2, 8, fill, fill");
		JButton btnNewButton_3 = new JButton("Ajouter un serveur");
		btnNewButton_3.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent arg0) {
				dm.addElement(textField_1.getText());
				list.setModel(dm);
			}
		});
		panel_2.add(btnNewButton_3, "4, 4");
		

	}

}
