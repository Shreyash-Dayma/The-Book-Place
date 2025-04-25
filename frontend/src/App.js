import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavbarComponent from './components/Navbar';
import BookList from './components/BookList';
import AddBook from './components/AddBook';
import EditBook from './components/EditBook';
import { Container } from 'react-bootstrap';
import './App.css';

function App() {
  return (
    <Router>
      <NavbarComponent />
      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/add" element={<AddBook />} />
          <Route path="/edit/:id" element={<EditBook />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
