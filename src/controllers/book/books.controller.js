const Book = require('../../models/bookSchema');
const User = require('../../models/userSchema');

const getBooks = async (req, res) => {
    try {
        filters = { ...req.query, disponible: true }

        const books = await Book.find(filters);
        const numBooks = await Book.countDocuments(filters);

        res.status(200).json({ numBooks, books });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        res.status(200).json(book);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const createBook = async (req, res) => {

    const { titulo, autor, genero, fecha_publicacion, casa_editorial, precio} = req.body;
    req.body.propietario = req.userId;
    const newBook = new Book(req.body);
    const propietario= await User.findById(req.userId)

    if (!propietario||propietario.deleted) return res.status(403).json({ message: "Usuario no autorizado" });

    if (!titulo || !autor || !genero || !fecha_publicacion || !casa_editorial || !precio) return res.status(400).json({ message: "Por favor complete todos los campos" });

    try {
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: "Libro no encontrado" });

        if (!book.propietario.equals(req.userId)) return res.status(401).json({ message: "No puedes editar este libro" });

        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedBook);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: "Libro no encontrado" });

        if (!book.propietario.equals(req.userId)) return res.status(401).json({ message: "No puedes eliminar este libro" });

        book.disponible = false;
        await book.save();
        res.status(200).json({ book, message: "Libro eliminado" });
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

module.exports = { getBooks, getBook, createBook, updateBook, deleteBook };