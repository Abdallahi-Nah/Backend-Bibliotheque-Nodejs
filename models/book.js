const mongoose = require('mongoose');

const Book = mongoose.model('Book', {
    title: {
        type: String
    },
    author: {
        type: String
    },
    pages: {
        type: Number
    },
    price: {
        type: Number
    },
    image: {
        type: String
    }
});

module.exports = Book;