const request = require("supertest");

require('dotenv').config();
process.env.NODE_ENV = "test";

const app = require("./app");
const db = require("./db");
const Book = require("./models/book");
const Test = require("supertest/lib/test");

const book1Data = {
    "isbn": "0691161518",
    "amazon_url": "http://a.co/eobPtX2",
    "author": "Matthew Lane",
    "language": "english",
    "pages": 264,
    "publisher": "Princeton University Press",
    "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
    "year": 2017
  };

const book2Data = {
    "isbn": "1234567890",
    "amazon_url": "http://testurl.test",
    "author": "Terrence Jones",
    "language": "english",
    "pages": 455,
    "publisher": "Northern Coast Publishing",
    "title": "Financial Planning",
    "year": 2006
  };
  
describe("Auth Routes Test", function () {

  beforeEach(async function () {
    await db.query("DELETE FROM books");

    let book1 = await Book.create(book1Data);
    let book2 = await Book.create(book2Data);

  });

/** GET /books => {books: [book, ...]}  */
  describe("GET /books",()=>{
    test("Get list of all books",async ()=>{
      let response = await request(app).get("/books")
      expect(response.body.books.length).toEqual(2);
      expect(response.body.books).toEqual([book2Data,book1Data]);
    })
  })

/** GET /books/:id => {book: book}  */
  describe("GET /books/:id",()=>{
    test("Get details of a book by isbn.",async ()=>{
      let response = await request(app).get(`/books/${book2Data.isbn}`)
      expect(response.body.book).toEqual(book2Data);

    })

    test("Get details of a book by isbn. Invalid isbn.",async ()=>{
        let response = await request(app).get(`/books/33333333`)
        expect(response.status).toEqual(404);
      })
  
  })

/** POST /books   bookData => {book: newBook}  */
  describe("POST /books", function () {
    test("Adds a new book.", async function () {
      let newBook = {
        "isbn": "9876543210",
        "amazon_url": "http://newbookurl.test",
        "author": "Catherine Robinson",
        "language": "english",
        "pages": 500,
        "publisher": "Fake Company Publishing",
        "title": "Book Title",
        "year": 2024        
      };
        
      let response = await request(app)
        .post("/books")
        .send(newBook);
        expect(response.body.book).toEqual(newBook);
    });

    test("Adds a new book. Missing property.", async function () {
        let newBook = {
          "amazon_url": "http://newbookurl.test",
          "author": "Catherine Robinson",
          "language": "english",
          "pages": 500,
          "publisher": "Fake Company Publishing",
          "year": 2024        
        };
     
        let response = await request(app)
          .post("/books")
          .send(newBook);
          expect(response.status).toEqual(400);
          expect(JSON.parse(response.text).error.message).toEqual([
            "instance requires property \"isbn\"", 
            "instance requires property \"title\""]);
      });

      test("Adds a new book. Invalid property.", async function () {
        let newBook = {
            "isbn": "9876543210",
            "amazon_url": "http://newbookurl.test",
            "author": "Catherine Robinson",
            "language": "english",
            "pages": true,
            "publisher": "Fake Company Publishing",
            "title": "Book Title",
            "year": 2024        
          };
     
        let response = await request(app)
          .post("/books")
          .send(newBook);
          expect(response.status).toEqual(400);
          expect(JSON.parse(response.text).error.message).toEqual([
            "instance.pages is not of a type(s) integer"]);

      });
    
  });

/** PUT /books/:isbn   bookData => {book: updatedBook}  */
describe("PUT /books/:isbn", function () {
    test("Update a book by isbn.", async function () {
      let updateBook = {...book2Data};
      updateBook.pages = 240;
      
      let response = await request(app)
        .put(`/books/${book2Data.isbn}`)
        .send(updateBook);
        expect(response.body.book).toEqual(updateBook);
        expect(response.body.book).not.toEqual(book1Data);

    });

    test("Update a book by isbn. Without reqiring all keys.", async function () {
        let updateBook = {
            "pages": 555            
        };
        
        let response = await request(app)
          .put(`/books/${book2Data.isbn}`)
          .send(updateBook);
          expect(response.body.book).toEqual({...book2Data,...updateBook});
          expect(response.body.book).not.toEqual(book2Data);
  
    });
      
    test("Update a book by isbn. Invalid property.", async function () {
        let updateBook = {    
            "pages": true,
            "year": 2012
        };  

        
        let response = await request(app)
        .put(`/books/${book2Data.isbn}`)
        .send(updateBook);

        expect(response.status).toEqual(400);
        expect(JSON.parse(response.text).error.message).toEqual([
            "instance.pages is not of a type(s) integer"]);

    });
    
  });

/** DELETE /[isbn]   => {message: "Book deleted"} */
  describe("DELETE /books/:isbn",()=>{
    test("Delete a book by isbn.",async ()=>{
        let response = await request(app).delete(`/books/${book1Data.isbn}`);
        expect(response.body.message).toEqual("Book deleted");        

        let response2 = await request(app).get("/books")
        expect(response2.body.books).toEqual([book2Data]);
  
    })

    test("Delete a book by invalid isbn.",async ()=>{
        let response = await request(app).delete(`/books/333333`);
        expect(response.status).toEqual(404);        

        let response2 = await request(app).get("/books")
        expect(response2.body.books).toEqual([book2Data,book1Data]);
  
    })
    
  })


});

afterAll(async function () {
  await db.end();
});