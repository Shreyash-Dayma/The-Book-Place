import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Form, Spinner, Alert } from 'react-bootstrap';

// Use environment variable with fallback
const API_URL = process.env.REACT_APP_API_URL || 'https://book-directory-backend.onrender.com';

// Configure axios defaults
axios.defaults.timeout = 15000; // 15 seconds timeout

function AddBook() {
    const navigate = useNavigate();
    const [book, setBook] = useState({
        title: '',
        author: '',
        category: '',
        publishedYear: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setBook({ ...book, [e.target.name]: e.target.value });
        setError(''); // Clear error when user makes changes
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.log('Sending request to:', `${API_URL}/api/books`);
            console.log('Book data:', book);

            const response = await axios.post(`${API_URL}/api/books`, book, {
                headers: {
                    'Content-Type': 'application/json'
                },
                validateStatus: function (status) {
                    return status >= 200 && status < 500;
                }
            });

            if (response.status === 201) {
                navigate('/');
            } else {
                throw new Error(response.data.message || 'Failed to add book');
            }
        } catch (error) {
            console.error('Error adding book:', error);

            if (error.code === 'ECONNABORTED') {
                setError('Connection timed out. The server might be starting up, please try again in a minute.');
            } else if (!error.response) {
                setError('Unable to connect to the server. Please check your internet connection and try again.');
            } else {
                setError(error.response?.data?.message || 'Failed to add book. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-book container mt-5">
            <h2>Add New Book</h2>

            {/* Show error message if there is one */}
            {error && (
                <Alert variant="danger" className="my-3">
                    {error}
                </Alert>
            )}

            {/* Form to add new book */}
            <Form onSubmit={handleSubmit}>
                {/* Title Input */}
                <Form.Group controlId="formTitle" className="mb-3">
                    <Form.Label>Title:</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        value={book.title}
                        onChange={handleChange}
                        required
                        placeholder="Enter book title"
                    />
                </Form.Group>

                {/* Author Input */}
                <Form.Group controlId="formAuthor" className="mb-3">
                    <Form.Label>Author:</Form.Label>
                    <Form.Control
                        type="text"
                        name="author"
                        value={book.author}
                        onChange={handleChange}
                        required
                        placeholder="Enter book author"
                    />
                </Form.Group>

                {/* Category Input */}
                <Form.Group controlId="formCategory" className="mb-3">
                    <Form.Label>Category:</Form.Label>
                    <Form.Control
                        type="text"
                        name="category"
                        value={book.category}
                        onChange={handleChange}
                        required
                        placeholder="Enter book category"
                    />
                </Form.Group>

                {/* Published Year Input */}
                <Form.Group controlId="formPublishedYear" className="mb-3">
                    <Form.Label>Published Year:</Form.Label>
                    <Form.Control
                        type="number"
                        name="publishedYear"
                        value={book.publishedYear}
                        onChange={handleChange}
                        min="1000"
                        max={new Date().getFullYear()}
                        required
                        placeholder="Enter published year"
                    />
                </Form.Group>

                {/* Buttons */}
                <div className="form-buttons">
                    <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? (
                            <Spinner animation="border" size="sm" />
                        ) : (
                            'Add Book'
                        )}
                    </Button>

                    <Button
                        variant="secondary"
                        type="button"
                        onClick={() => navigate('/')}
                        disabled={loading}
                        className="ms-2"
                    >
                        Cancel
                    </Button>
                </div>
            </Form>
        </div>
    );
}

export default AddBook;
