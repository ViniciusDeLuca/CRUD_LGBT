import express, { Request, Response } from 'express';
import dao from './dao';
import { Book } from './model/Book';

const router = express.Router();

router.get('/', function(req: Request, res: Response) {
  let books: Book[] = dao.listProducts(); 
  if (req.query.search == undefined || req.query.search == '') {
    res.render(__dirname + '/pages/index.ejs', { books });  
  } else {
    let query: string = String(req.query.search).toLowerCase();
    let queryProducts: Book[] = [];
    for (let book of books) {
      if (book.name.toLowerCase().includes(query)) {
        queryProducts.push(book);
      }
    }
    res.render(__dirname + '/pages/index.ejs', { books: queryProducts });  
  }  
});

router.get('/create', function(req: Request, res: Response) {  
  res.render(__dirname + '/pages/create.ejs');  
});

router.get('/update', function(req: Request, res: Response) {  
  let book: Book = JSON.parse(String(req.query.book));
  res.render(__dirname + '/pages/update.ejs', { book });  
});

router.post('/books/create', function (req: Request, res: Response) {          
  let book: Book = new Book(req.body.id, req.body.name, req.body.author);
  dao.createProduct(book);
  res.redirect('/create');
});

router.post('/books/update', function (req: Request, res: Response) {  
  let book: Book = new Book(req.body.id, req.body.name, req.body.author);
  dao.updateProduct(book);
  res.redirect('/');
});

router.post('/books/author-change', function (req: Request, res: Response) {  
  let books: Book[] = dao.listProducts(); 
  for (let book of books) {
    let author = book.author;
    book.author = author;
    dao.updateProduct(book);
  }  
  res.redirect('/');
});

router.post('/books/delete', function (req: Request, res: Response) {  
  let book: Book = JSON.parse(req.body.book);
  dao.deleteProduct(book.id);
  res.redirect('/');
});

export default router;