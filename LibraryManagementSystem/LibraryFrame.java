package Library;

import java.awt.Color;
import java.awt.event.*;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintStream;
import java.util.ArrayList;

import javax.swing.*;

public class LibraryFrame implements ActionListener {
    JFrame s;
    JLabel l0,l1, l2, l3, l4, l5, l6, l7;
    JTextField t1, t2, t3, t4, t5, t6, t7;
    JButton bu1, bu2, bu3, bu4, bu5,bu6;
    ArrayList<Book> b = new ArrayList<Book>();
    ArrayList<Book> lent = new ArrayList<Book>();
    public static void main(String[] args) {
        new LibraryFrame();
    }

    LibraryFrame() {
    	 b.add(new Book(1234567, "Book1","Author1", 10.0f));
         b.add(new Book(2234567, "Book2","Author2", 15.0f));
         b.add(new Book(3234568,"Book3","Author3", 20.0f));
         b.add(new Book(4235678, "Book4", "Author4", 25.0f));
         b.add(new Book(5235562, "Book5", "Author5", 30.0f));
        int x = 0x1F600;
        s = new JFrame(Character.toString(x) + Character.toString(x) + "Simple library managment system" + Character.toString(x) + Character.toString(x));
        s.setSize(1000, 800);
         Color babyGreen = new Color(150, 200, 173);
        s.getContentPane().setBackground(babyGreen);
        s.setLayout(null);
//        l0= new JLabel("Welcome to the Library Management System");
//        set.foreground(0000);
        l0.setBounds(500,20,200,10);
        l1 = new JLabel("NAME");
        l1.setBounds(400, 30, 100, 50);
        s.add(l1);
        t1 = new JTextField();package Library;

import java.awt.Color;
import java.awt.event.*;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintStream;
import java.util.ArrayList;

import javax.swing.*;

        public class LibraryFrame implements ActionListener {
            JFrame s;
            JLabel l0,l1, l2, l3, l4, l5, l6, l7;
            JTextField t1, t2, t3, t4, t5, t6, t7;
            JButton bu1, bu2, bu3, bu4, bu5,bu6;
            ArrayList<Book> b = new ArrayList<Book>();
            ArrayList<Book> lent = new ArrayList<Book>();
            public static void main(String[] args) {
                new Library.LibraryFrame();
            }

            LibraryFrame() {
                b.add(new Book(1234567, "Book1","Author1", 10.0f));
                b.add(new Book(2234567, "Book2","Author2", 15.0f));
                b.add(new Book(3234568,"Book3","Author3", 20.0f));
                b.add(new Book(4235678, "Book4", "Author4", 25.0f));
                b.add(new Book(5235562, "Book5", "Author5", 30.0f));
                int x = 0x1F600;
                s = new JFrame(Character.toString(x) + Character.toString(x) + "Simple library managment system" + Character.toString(x) + Character.toString(x));
                s.setSize(1000, 800);
                Color babyGreen = new Color(150, 200, 173);
                s.getContentPane().setBackground(babyGreen);
                s.setLayout(null);
                l0= new JLabel("Welcome to the Library Management System");
//        set.foreground(0000);
                l0.setBounds(500,20,200,10);
                l1 = new JLabel("NAME");
                l1.setBounds(400, 30, 100, 50);
                s.add(l1);
                t1 = new JTextField();
                t1.setBounds(500, 30, 100, 50);
                s.add(t1);
                l2 = new JLabel("ID");
                l2.setBounds(400, 130, 100, 50);
                s.add(l2);
                t2 = new JTextField();
                t2.setBounds(500, 130, 100, 50);
                s.add(t2);
                l3 = new JLabel("Author");
                l3.setBounds(400, 230, 100, 50);
                s.add(l3);
                t3 = new JTextField();
                t3.setBounds(500, 230, 100, 50);
                s.add(t3);
                l4 = new JLabel("Price");
                l4.setBounds(400, 330, 100, 50);
                s.add(l4);
                t4 = new JTextField();
                t4.setBounds(500, 330, 100, 50);
                s.add(t4);
                int bookEmoji = 0x1F4D5;
                bu1 = new JButton("Add Book  " + Character.toString(bookEmoji));
                bu1.setBounds(450, 430, 120, 50);
                bu1.addActionListener(this);
                s.add(bu1);
                bu2 = new JButton("Display All Books");
                bu2.setBounds(400, 530, 200, 50);
                bu2.addActionListener(this);
                s.add(bu2);
                int searchsym = 0x1F50E;
                l5 = new JLabel("Search book by name");
                l5.setBounds(250, 630, 150, 50);
                s.add(l5);
                t5 = new JTextField();
                t5.setBounds(500, 630, 100, 50);
                s.add(t5);
                bu3 = new JButton("Search " + Character.toString(searchsym));
                bu3.setBounds(650, 630, 100, 50);
                bu3.addActionListener(this);
                s.add(bu3);
                l6 = new JLabel("Search book by id");
                l6.setBounds(250, 705, 110, 50);
                s.add(l6);
                t6 = new JTextField();
                t6.setBounds(500, 705, 100, 50);
                s.add(t6);
                bu4 = new JButton("Search " + Character.toString(searchsym));
                bu4.setBounds(650, 705, 100, 50);
                bu4.addActionListener(this);
                s.add(bu4);
                l7 = new JLabel("Lend book by name");
                l7.setBounds(250, 780, 120, 50);
                s.add(l7);
                t7 = new JTextField();
                t7.setBounds(500, 780, 100, 50);
                s.add(t7);
                bu5 = new JButton("Lend  ");
                bu5.setBounds(650, 780, 90, 50);
                bu5.addActionListener(this);
                s.add(bu5);
                bu6 = new JButton("Display Lent");
                bu6.setBounds(800, 780, 120, 50);
                bu6.addActionListener(this);
                s.add(bu6);
                s.setVisible(true);
            }

            public void actionPerformed(ActionEvent e) {

                if (e.getSource() == bu1) {
                    System.out.println("Book added to list and printed in file");
                    int i = 0;
                    b.add(new Book(Long.parseLong(t2.getText()), t1.getText(), t3.getText(), Float.parseFloat(t4.getText())));
                    File out = new File("C:\\java\\Library.txt");
                    PrintStream ps;
                    try {
                        ps = new PrintStream(out);
                        ps.print(b.get(i));
                        i++;
                    } catch (FileNotFoundException e1) {
                        System.out.println(e1);
                    }
                }
                if (e.getSource() == bu2) {
                    int j=0;
                    System.out.println("----------------------------------");
                    System.out.println("Books in library are:");
                    for(Book b1:b) {
                        System.out.println("Book :"+(j+1));
                        System.out.println(b1);
                        j++;

                    }
                }
                if (e.getSource() == bu3) {
                    String nameTosearch = t5.getText();
                    int i;
                    for (i = 0; i < b.size(); i++) {
                        if (b.get(i).name.equals(nameTosearch)) {
                            System.out.println(" Book Found by " + nameTosearch);
                            break;
                        }
                    }
                    if (i == b.size()) {
                        System.out.println(" Book Not found of name");
                    }
                }
                if (e.getSource() == bu4) {
                    long idTosearch = Long.parseLong(t6.getText());
                    int i;
                    for (i = 0; i < b.size(); i++) {
                        if (b.get(i).id == idTosearch) {
                            System.out.println("book Found by id" + idTosearch);
                            break;
                        }
                    }
                    if (i == b.size()) {
                        System.out.println(" Book Not found of id " + idTosearch);
                    }
                }
                if (e.getSource() == bu5) {
                    int i, k;
                    String booknametoleand = t7.getText();
                    for (i = 0; i < b.size(); i++) {
                        if (b.get(i).name.equals(booknametoleand)) {
                            for (k = 0; k < lent.size(); k++) {
                                if (lent.get(k).name.equals(booknametoleand))
                                {
                                    JOptionPane.showMessageDialog(s, "Book currently not available already lent to others");
                                    System.out.println("Book currently not available already lent to others");
                                    return;
                                }
                            }
                            if (k == lent.size()) {
                                lent.add(b.get(i));
                                System.out.println("Book lent successful");
                                return;
                            }
                        }
                    }
                    JOptionPane.showMessageDialog(s, "Book not found in library");
                    System.out.println("Book not found in library");
                }
                if (e.getSource() == bu6) {
                    System.out.println("----------------------------------");
                    System.out.println("Books lent are");
                    for(Book l:lent)
                        System.out.println(l);
                }
            }
        }

        t1.setBounds(500, 30, 100, 50);
        s.add(t1);
        l2 = new JLabel("ID");
        l2.setBounds(400, 130, 100, 50);
        s.add(l2);
        t2 = new JTextField();
        t2.setBounds(500, 130, 100, 50);
        s.add(t2);
        l3 = new JLabel("Author");
        l3.setBounds(400, 230, 100, 50);
        s.add(l3);
        t3 = new JTextField();
        t3.setBounds(500, 230, 100, 50);
        s.add(t3);
        l4 = new JLabel("Price");
        l4.setBounds(400, 330, 100, 50);
        s.add(l4);
        t4 = new JTextField();
        t4.setBounds(500, 330, 100, 50);
        s.add(t4);
        int bookEmoji = 0x1F4D5;
        bu1 = new JButton("Add Book  " + Character.toString(bookEmoji));
        bu1.setBounds(450, 430, 120, 50);
        bu1.addActionListener(this);
        s.add(bu1);
        bu2 = new JButton("Display All Books");
        bu2.setBounds(400, 530, 200, 50);
        bu2.addActionListener(this);
        s.add(bu2);
        int searchsym = 0x1F50E;
        l5 = new JLabel("Search book by name");
        l5.setBounds(250, 630, 150, 50);
        s.add(l5);
        t5 = new JTextField();
        t5.setBounds(500, 630, 100, 50);
        s.add(t5);
        bu3 = new JButton("Search " + Character.toString(searchsym));
        bu3.setBounds(650, 630, 100, 50);
        bu3.addActionListener(this);
        s.add(bu3);
        l6 = new JLabel("Search book by id");
        l6.setBounds(250, 705, 110, 50);
        s.add(l6);
        t6 = new JTextField();
        t6.setBounds(500, 705, 100, 50);
        s.add(t6);
        bu4 = new JButton("Search " + Character.toString(searchsym));
        bu4.setBounds(650, 705, 100, 50);
        bu4.addActionListener(this);
        s.add(bu4);
        l7 = new JLabel("Lend book by name");
        l7.setBounds(250, 780, 120, 50);
        s.add(l7);
        t7 = new JTextField();
        t7.setBounds(500, 780, 100, 50);
        s.add(t7);
        bu5 = new JButton("Lend  ");
        bu5.setBounds(650, 780, 90, 50);
        bu5.addActionListener(this);
        s.add(bu5);
        bu6 = new JButton("Display Lent");
        bu6.setBounds(800, 780, 120, 50);
        bu6.addActionListener(this);
        s.add(bu6);
        s.setVisible(true);
    }

    public void actionPerformed(ActionEvent e) {

        if (e.getSource() == bu1) {
            System.out.println("Book added to list and printed in file");
            int i = 0;
            b.add(new Book(Long.parseLong(t2.getText()), t1.getText(), t3.getText(), Float.parseFloat(t4.getText())));
            File out = new File("C:\\java\\Library.txt");
            PrintStream ps;
            try {
                ps = new PrintStream(out);
                ps.print(b.get(i));
                i++;
            } catch (FileNotFoundException e1) {
                System.out.println(e1);
            }
        }
        if (e.getSource() == bu2) {
        	int j=0;
        	System.out.println("----------------------------------");
        	System.out.println("Books in library are:");
        	for(Book b1:b) {
        		System.out.println("Book :"+(j+1));
            System.out.println(b1);
            j++;

        	}
        }
        if (e.getSource() == bu3) {
            String nameTosearch = t5.getText();
            int i;
            for (i = 0; i < b.size(); i++) {
                if (b.get(i).name.equals(nameTosearch)) {
                    System.out.println(" Book Found by " + nameTosearch);
                    break;
                }
            }
            if (i == b.size()) {
                System.out.println(" Book Not found of name");
            }
        }
        if (e.getSource() == bu4) {
            long idTosearch = Long.parseLong(t6.getText());
            int i;
            for (i = 0; i < b.size(); i++) {
                if (b.get(i).id == idTosearch) {
                    System.out.println("book Found by id" + idTosearch);
                    break;
                }
            }
            if (i == b.size()) {
                System.out.println(" Book Not found of id " + idTosearch);
            }
        }
        if (e.getSource() == bu5) {
            int i, k;
            String booknametoleand = t7.getText();
            for (i = 0; i < b.size(); i++) {
                if (b.get(i).name.equals(booknametoleand)) {
                    for (k = 0; k < lent.size(); k++) {
                        if (lent.get(k).name.equals(booknametoleand))
                        {
                        	JOptionPane.showMessageDialog(s, "Book currently not available already lent to others");
                            System.out.println("Book currently not available already lent to others");
                            return;
                        }
                    }
                    if (k == lent.size()) {
                        lent.add(b.get(i));
                        System.out.println("Book lent successful");
                        return;
                    }
                }
            }
            JOptionPane.showMessageDialog(s, "Book not found in library");
            System.out.println("Book not found in library");
        }
        if (e.getSource() == bu6) {
        	System.out.println("----------------------------------");
        	System.out.println("Books lent are");
        	for(Book l:lent)
        		System.out.println(l);
        }
    }
}
