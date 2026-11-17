const express = require('express');

const app = express();
const PORT = 3000;


app.use(express.json());


let books = [
    {
        id: 101,
        title: "Wings of Fire",
        author: "A.P.J. Abdul Kalam",
        genre: "Autobiography",
        publishedYear: 1999,
        available: true
    },
    {
        id: 102,
        title: "The Alchemist",
        author: "Paulo Coelho",
        genre: "Fiction",
        publishedYear: 1988,
        available: true
    },
    {
        id: 103,
        title: "Harry Potter",
        author: "J.K. Rowling",
        genre: "Fantasy",
        publishedYear: 1997,
        available: false
    }
];


function isValidBook(book) {
    return (
        typeof book.title === "string" &&
        book.title.trim() !== "" &&
        typeof book.author === "string" &&
        book.author.trim() !== "" &&
        typeof book.genre === "string" &&
        book.genre.trim() !== "" &&
        typeof book.publishedYear === "number" &&
        Number.isInteger(book.publishedYear) &&
        typeof book.available === "boolean"
    );
}


app.get('/api/books', (req, res) => {
    res.status(200).json(books);
});


app.post('/api/books', (req, res) => {

    const { title, author, genre, publishedYear, available } = req.body;

    if (!isValidBook(req.body)) {
        return res.status(400).json({
            message: "Invalid input. All fields are required."
        });
    }

    
    const newId = books.length > 0
        ? Math.max(...books.map(book => book.id)) + 1
        : 101;

    const newBook = {
        id: newId,
        title,
        author,
        genre,
        publishedYear,
        available
    };

    books.push(newBook);

    res.status(201).json(newBook);
});
app.get('/api/books/:id', (req, res) => {

    const id = Number(req.params.id);

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.status(200).json(book);
});


app.put('/api/books/:id', (req, res) => {

    const id = Number(req.params.id);

    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const updatedBook = {
        ...books[index],
        ...req.body,
        id: id
    };

    if (!isValidBook(updatedBook)) {
        return res.status(400).json({
            message: "Invalid book data"
        });
    }

    books[index] = updatedBook;

    res.status(200).json(updatedBook);
});

app.delete('/api/books/:id', (req, res) => {

    const id = Number(req.params.id);

    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    books.splice(index, 1);

    res.status(200).json({
        message: "Book deleted successfully"
    });
});


app.get('/api/books/filter', (req, res) => {

    const author = req.query.author;

    if (!author) {
        return res.status(400).json({
            message: "Author query is required"
        });
    }

    const filteredBooks = books.filter(book =>
        book.author.toLowerCase() === author.toLowerCase()
    );

    res.status(200).json(filteredBooks);
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
