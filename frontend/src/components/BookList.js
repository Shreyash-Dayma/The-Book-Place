import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button, Table, Spinner, Alert } from 'react-bootstrap';

// Use environment variable with fallback
const API_URL = process.env.REACT_APP_API_URL || 'https://bookstore-q59e.onrender.com';

function BookList() {
    const [books, setBooks] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            console.log('Fetching books from:', `${API_URL}/api/books`);
            const response = await axios.get(`${API_URL}/api/books`);
            setBooks(response.data);
            setError('');
        } catch (error) {
            console.error('Error fetching books:', error);
            setError('Error loading books. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                await axios.delete(`${API_URL}/api/books/${id}`);
                setBooks(books.filter(book => book._id !== id));
                setError('');
            } catch (error) {
                console.error('Error deleting book:', error);
                setError('Error deleting book. Please try again.');
            }
        }
    };

    if (loading) {
        return (
            <div className="text-center">
                <Spinner animation="border" variant="primary" />
                <p>Loading books...</p>
            </div>
        );
    }

    return (
        <div className="book-list">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Books List</h2>
                <Link to="/add">
                    <Button variant="primary">Add New Book</Button>
                </Link>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            {books.length === 0 ? (
                <div className="alert alert-info">No books found. Add some books to get started!</div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Category</th>
                            <th>Published Year</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map(book => (
                            <tr key={book._id}>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td>{book.category}</td>
                                <td>{book.publishedYear}</td>
                                <td>
                                    <Link to={`/edit/${book._id}`} className="btn btn-warning me-2">
                                        Edit
                                    </Link>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDelete(book._id)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
}

export default BookList;
