// Import the Express library, which is a popular Node.js web application framework.
const express = require('express');
// Create an instance of the Express application.
const app = express();
// Define the port number on which the server will listen for incoming requests.
const PORT = 3000;

// Middleware: Enable Express to parse JSON formatted request bodies.
// This is crucial for handling POST and PUT requests where data is sent as JSON.
app.use(express.json());

// In-memory data store for books.
// In a real application, this would be replaced by a database (e.g., MongoDB, PostgreSQL).
let books = [
    { id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
    { id: '2', title: '1984', author: 'George Orwell' },
    { id: '3', title: 'To Kill a Mockingbird', author: 'Harper Lee' }
];

// Helper function to generate a unique ID for new books.
// In a real application, a database would typically handle ID generation.
const generateId = () => {
    // Find the maximum ID currently in the books array.
    const maxId = books.length > 0
        ? Math.max(...books.map(book => parseInt(book.id)))
        : 0;
    // Return a new ID by incrementing the maximum ID.
    return (maxId + 1).toString();
};

// --- API Endpoints ---

// GET /books: Retrieve all books.
// This endpoint returns the entire list of books stored in memory.
app.get('/books', (req, res) => {
    console.log('GET /books request received.');
    // Send the books array as a JSON response.
    res.json(books);
});

// GET /books/:id: Retrieve a single book by its ID.
// This endpoint extracts the ID from the URL parameters and searches for the corresponding book.
app.get('/books/:id', (req, res) => {
    // Get the book ID from the request parameters.
    const { id } = req.params;
    console.log(`GET /books/${id} request received.`);
    // Find the book in the array.
    const book = books.find(b => b.id === id);

    // If the book is found, send it as a JSON response.
    if (book) {
        res.json(book);
    } else {
        // If no book is found with the given ID, send a 404 Not Found status.
        res.status(404).json({ message: `Book with ID ${id} not found.` });
    }
});

// POST /books: Add a new book.
// This endpoint expects a JSON body with 'title' and 'author' properties.
app.post('/books', (req, res) => {
    // Destructure title and author from the request body.
    const { title, author } = req.body;
    console.log('POST /books request received.', req.body);

    // Basic validation: Check if title and author are provided.
    if (!title || !author) {
        // If not, send a 400 Bad Request status with an error message.
        return res.status(400).json({ message: 'Title and author are required.' });
    }

    // Create a new book object with a unique ID.
    const newBook = {
        id: generateId(),
        title,
        author
    };

    // Add the new book to the in-memory array.
    books.push(newBook);
    console.log('New book added:', newBook);
    // Send a 201 Created status and the newly created book object as a JSON response.
    res.status(201).json(newBook);
});

// PUT /books/:id: Update an existing book by its ID.
// This endpoint expects a JSON body with updated 'title' and/or 'author' properties.
app.put('/books/:id', (req, res) => {
    // Get the book ID from the request parameters.
    const { id } = req.params;
    // Get the updated title and author from the request body.
    const { title, author } = req.body;
    console.log(`PUT /books/${id} request received.`, req.body);

    // Find the index of the book to be updated.
    const bookIndex = books.findIndex(b => b.id === id);

    // If the book is found (index is not -1).
    if (bookIndex !== -1) {
        // Update the book's properties.
        // Use the existing book data as a base and override with new data from the request body.
        books[bookIndex] = {
            ...books[bookIndex], // Keep existing properties
            title: title || books[bookIndex].title, // Update title if provided, else keep old
            author: author || books[bookIndex].author // Update author if provided, else keep old
        };
        console.log('Book updated:', books[bookIndex]);
        // Send the updated book object as a JSON response.
        res.json(books[bookIndex]);
    } else {
        // If no book is found, send a 404 Not Found status.
        res.status(404).json({ message: `Book with ID ${id} not found.` });
    }
});

// DELETE /books/:id: Remove a book by its ID.
// This endpoint removes the book with the specified ID from the array.
app.delete('/books/:id', (req, res) => {
    // Get the book ID from the request parameters.
    const { id } = req.params;
    console.log(`DELETE /books/${id} request received.`);

    // Find the initial length of the books array.
    const initialLength = books.length;
    // Filter out the book to be deleted, creating a new array.
    books = books.filter(b => b.id !== id);

    // If the length of the array changed, it means a book was deleted.
    if (books.length < initialLength) {
        // Send a 204 No Content status, indicating successful deletion with no response body.
        res.status(204).send();
        console.log(`Book with ID ${id} deleted.`);
    } else {
        // If no book was deleted (ID not found), send a 404 Not Found status.
        res.status(404).json({ message: `Book with ID ${id} not found.` });
    }
});

// Start the server and listen for incoming requests on the defined PORT.
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Use Postman or a similar tool to test the API endpoints:');
    console.log('GET /books');
    console.log('GET /books/:id');
    console.log('POST /books (with JSON body: {"title": "New Title", "author": "New Author"})');
    console.log('PUT /books/:id (with JSON body: {"title": "Updated Title"})');
    console.log('DELETE /books/:id');
});