package Library;
import java.util.*;
class Book {
	long id;
	String name;
	String author;
	float price;
	Book(long id, String name, String author, float price) {
		this.id = id;
		this.name = name;
		this.author = author;
		this.price = price;
	}

	public String toString() {
		return "Book [id=" + id + ", name=" + name + ", author=" + author + ", price=" + price + "]\n";
	}	
}
public class BookMain {
	 ArrayList<Book> b=new ArrayList<Book>();
	ArrayList<Book> lent=new ArrayList<Book>();
	public static void main(String[] args) {
	int ch;
	BookMain bm=new BookMain();
	  bm.b.add(new Book(1, "Book1","Author1", 10.0f));
      bm.b.add(new Book(2, "Book2","Author2", 15.0f));
      bm.b.add(new Book(3,"Book3","Author3", 20.0f));
      bm.b.add(new Book(4, "Book4", "Author4", 25.0f));
      bm.b.add(new Book(5, "Book5", "Author5", 30.0f));
  	Scanner sc=new Scanner(System.in);
	System.out.println("======= Welcome To Library Management System ======");
		while(true) {
			System.out.println(" To Add Book Details Please Enter 1"+"\n"+"To Display the books in the Library Please Enter 2\n"+"To Search a book by its name please enter 3\n"+"To Search a book by its ID please enter 4\n"+"To lend a book Please Enter 5\n"+"To display previously lent books Please Enter 6\n"+"Enter any other number To exit the System"+"\n");
			System.out.println("Please Enter Your Choice");
			ch=sc.nextInt();
			switch(ch){
			case 1:bm.addbook();
			break;
			case 2:bm.display();
			break;
			case 3:System.out.println("Enter Name to Search");
				String nameTosearch=sc.next();

			    bm.searchbyname(nameTosearch);
			    break;
			case 4:System.out.println("Enter ID to search");
			long idTosearch=sc.nextLong();
			bm.searchbyid(idTosearch);
			break;
			case 5:bm.LendBook();
			break;
			case 6:bm.display_lent();
			break;
			default:System.exit(1);
			break;
			}
		}
	}
	void display_lent() {
		System.out.println(lent);
	}
	void LendBook() {
		System.out.println("Enter Name of the Book you want to borrow");
		Scanner sc=new Scanner(System.in);
		int i,k;
		String booknametoleand=sc.next();
		 for(i=0;i<b.size();i++) {
			 if(b.get(i).name.equals(booknametoleand)) {
				 for(k=0;k<lent.size();k++) {
					 if(lent.get(k).name.equals(booknametoleand)) {
						 System.out.println("The Book You Want is currently is being used  by others.");
						 return;
					 }
					 }
					 if(k==lent.size()) {
						 //book not in lent
							lent.add(b.get(i));
							System.out.println("Book available :lent successful");
							return;
					 }
					 
				 }
			 }
		System.out.println("Book not found in library");
	}
	void addbook(){
		Scanner sc=new Scanner(System.in);
		System.out.println("Enter details  id, name ,author ,price of"+(b.size()+1));
		b.add(new Book(sc.nextInt(),sc.next(),sc.next(),sc.nextFloat()));
	
	}
	 void display() {
		System.out.println(b);
	}
	 void searchbyname(String nameTosearch) {
		 int i;
		 for(i=0;i<b.size();i++) {
		
		 if(b.get(i).name.equals(nameTosearch)) {
			 System.out.println(" Book Found by "+nameTosearch);
			 return;
			
		 }
		 }
		 if(i==b.size()) {
			 System.out.println(" Book Not found of name"+nameTosearch);
		 }
	 }
	 void searchbyid(long id) {
		 int i;
		 for(i=0;i<b.size();i++) {
		
		 if(b.get(i).id==id) {
			 System.out.println(" Book book Found by id"+id);
			 break;
		 }
		 }
		 if(i==b.size()) {
			 System.out.println(" Book Not found of id"+id);
		 }
	 }
	}


