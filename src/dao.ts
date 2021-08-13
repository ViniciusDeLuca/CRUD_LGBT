import lowdb from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import { nanoid } from "nanoid";
import { Book } from "./model/Book";

class DAO {
  
  db = lowdb(new FileSync("db.json"));

  constructor() {
    this.db.defaults({ books: [] }).write();
  }

  listProducts(): Book[] {
    return sortByName(this.db.get("books").value());
  }

  findProduct(id: string): Book {
    // @ts-ignore
    return this.db.get("books").find({ id }).value();
  }

  createProduct(data: any): void {
    // @ts-ignore
    this.db.get("books").push(new Book(nanoid(), data.name, data.author))
      .write();
  }

  updateProduct(book: Book): void {
    // @ts-ignore
    this.db.get("books").find({ id: book.id })
      .assign({ name: book.name, author: book.author })
      .write();
  }

  deleteProduct(id: string): void {
    // @ts-ignore
    this.db.get("books").remove({ id: id }).write();
  }
}

function sortByName(books: Book[]): Book[] {
  return books.sort((a: Book, b: Book) =>
    a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
  );
}

let dao: DAO = new DAO();
export default dao;
