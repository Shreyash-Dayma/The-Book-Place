import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, Form, Spinner, Alert } from 'react-bootstrap';

const API_URL = process.env.REACT_APP_API_URL || 'https://book-directory-backend-3h6l.onrender.com';

function EditBook() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [book, setBook] = useState({
        title: '',
        author: '',
        category: '',
        publishedYear: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch the book details when the component is mounted
    useEffect(() => {
        const fetchBook = async () => {
            try {
                console.log('Fetching book details from:', `${API_URL}/api/books/${id}`);
                const response = await axios.get(`${API_URL}/api/books/${id}`);
                setBook(response.data);
                setError('');
            } catch (error) {
                console.error('Error fetching book:', error);
                setError('Error loading book details. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchBook();
    }, [id]);

    // Handle form input changes
    const handleChange = (e) => {
        setBook({ ...book, [e.target.name]: e.target.value });
    };

    // Handle form submission (update the book details)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            console.log('Updating book at:', `${API_URL}/api/books/${id}`);
            await axios.put(`${API_URL}/api/books/${id}`, book);
            navigate('/');  // Navigate to the home page after successful update
        } catch (error) {
            console.error('Error updating book:', error);
            setError(error.response?.data?.message || 'Error updating book. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Show loading message while fetching book data
    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" />
                <p>Loading book details...</p>
            </div>
        );
    }

    return (
        <div className="edit-book container mt-5">
            <h2>Edit Book</h2>

            {/* Error message display */}
            {error && <Alert variant="danger" className="my-3">{error}</Alert>}

            {/* Form for editing book */}
            <Form onSubmit={handleSubmit}>
                {/* Title input */}
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

                {/* Author input */}
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

                {/* Category input */}
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

                {/* Published Year input */}
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

                {/* Buttons for submitting the form or cancelling */}
                <div className="form-buttons">
                    <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : 'Update Book'}
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

export default EditBook;
