const Book = require('../models/Book');

// Get all books
exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        res.status(200).json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ message: 'Failed to fetch books', error: error.message });
    }
};

// Create a new book
exports.createBook = async (req, res) => {
    try {
        // Validate required fields
        const { title, author, category, publishedYear } = req.body;
        
        if (!title || !author || !category || !publishedYear) {
            return res.status(400).json({ 
                message: 'Missing required fields',
                details: {
                    title: !title ? 'Title is required' : null,
                    author: !author ? 'Author is required' : null,
                    category: !category ? 'Category is required' : null,
                    publishedYear: !publishedYear ? 'Published Year is required' : null
                }
            });
        }

        // Validate published year
        const year = parseInt(publishedYear);
        if (isNaN(year) || year < 1000 || year > new Date().getFullYear()) {
            return res.status(400).json({ 
                message: 'Invalid published year',
                error: 'Published year must be a valid year'
            });
        }

        console.log('Creating new book:', req.body);
        const newBook = await Book.create({
            title,
            author,
            category,
            publishedYear: year
        });
        
        console.log('Book created successfully:', newBook);
        res.status(201).json(newBook);
    } catch (error) {
        console.error('Error creating book:', error);
        res.status(400).json({ 
            message: 'Failed to create book', 
            error: error.message 
        });
    }
};

// Get a single book
exports.getBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(book);
    } catch (error) {
        console.error('Error fetching book:', error);
        res.status(500).json({ message: 'Failed to fetch book', error: error.message });
    }
};

// Update a book
exports.updateBook = async (req, res) => {
    try {
        const { title, author, category, publishedYear } = req.body;
        
        // Validate published year if provided
        if (publishedYear) {
            const year = parseInt(publishedYear);
            if (isNaN(year) || year < 1000 || year > new Date().getFullYear()) {
                return res.status(400).json({ 
                    message: 'Invalid published year',
                    error: 'Published year must be a valid year'
                });
            }
        }

        const book = await Book.findByIdAndUpdate(
            req.params.id, 
            { title, author, category, publishedYear },
            { new: true, runValidators: true }
        );

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(book);
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(400).json({ message: 'Failed to update book', error: error.message });
    }
};

// Delete a book
exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ message: 'Failed to delete book', error: error.message });
    }
};