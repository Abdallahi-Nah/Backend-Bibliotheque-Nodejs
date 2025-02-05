const express = require('express');
const router = express.Router();
const book = require('../models/book');
const multer = require('multer');

filename = '';

const myStorage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, redirect) => {
        const date = Date.now();
        const fl = date + '.' + file.mimetype.split('/')[1];
        redirect(null, fl);
        filename = fl;
    }    
});

const upload = multer({storage: myStorage});

router.post( '/addBook', upload.any('file') ,(req, res) => {
    data = req.body;
    bk = new book(data);
    bk.image = filename;
    bk.save()
      .then((dataBook) => {
        res.send(dataBook);
      })
      .catch((err) => {
        res.send(err);
      });
    filename = '';
});

router.post( '/addBookAsyncAwait', upload.any('file') ,async(req, res) => {
    try{
        data = req.body;
        bk = new book(data);
        bk.image = filename;
        savedBk = await bk.save();
        filename = '';
        res.send(savedBk);
    }catch(err){
        res.send(err);
    }
});

router.get( '/getallBooks', (req, res) => {
    book.find()
        .then(
            (books) => {
                res.send(books);
            }
        )
        .catch(
            (error) => {
                res.send(error);
            }
        )
});

router.get( '/getallBooksAsyncAwait', async (req, res) => {
    try {
        books = await book.find();
        res.send(books);
    } catch (error) {
        res.send(error);
    }
});

router.get( '/getBookById/:id', (req, res) => {
    bookId = req.params.id;
    book.findById(bookId)
        .then(
            (book) => {
                res.send(book);
            }
        )
        .catch(
            (error) => {
                res.send(error);
            }
        )
});

router.get( '/getBookByIdAsyncAwait/:id', async (req, res) => {
    try {
        bookId = req.params.id;
        bk = await book.findById(bookId);
        res.send(bk);
    } catch (error) {
        res.send(error);
    }
});

router.put( '/updateBook/:id', (req, res) => {
    bookId = req.params.id;
    newBookInfos = req.body;

    book.findByIdAndUpdate(bookId, newBookInfos)
        .then(
            () => {
                res.send("book updated successfully");
            }
        )
        .catch(
            (error) => {
                res.send(error);
            }
        )
});

router.put( '/updateBookAsyncAwait/:id', async (req, res) => {
    try {
        bookId = req.params.id;
        newBookInfos = req.body;

        updatedBook = await book.findByIdAndUpdate(bookId, newBookInfos);
        res.send(updatedBook);
    } catch (error) {
        res.send(error);
    }   
});

router.delete( '/deleteBook/:id', (req, res) => {
    bookId = req.params.id;
    book.findByIdAndDelete(bookId)
        .then(
            () => {
                res.send("book deleted successfully");
            }
        )
        .catch(
            (error) => {
                res.send(error);
            }
        )
});

router.delete( '/deleteBookAsyncAwait/:id', async (req, res) => {
    try {
        bookId = req.params.id;
        await book.findByIdAndDelete(bookId);
        res.send("book deleted successfully");
    } catch (error) {
        res.send(error);
    }
});

module.exports = router;