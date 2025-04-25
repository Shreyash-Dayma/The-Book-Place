const express = require('express');
const router = express.Router();
const { 
    getAllBooks,
    createBook,
    getBook,
    updateBook,
    deleteBook
} = require('../controllers/bookController');

// Get all books and create new book
router.route('/').get(getAllBooks).post(createBook);

// Get single book, update book and delete book
router.route('/:id')
    .get(getBook)
    .put(updateBook)
    .delete(deleteBook);

module.exports = router;