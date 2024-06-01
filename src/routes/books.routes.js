const {Router}= require('express');
const { getBooks, getBook, createBook, updateBook, deleteBook } = require('../controllers/book/books.controller');
const { verifyToken } = require('../controllers/auth/auth.controller');

const router=Router();

router.get("/", getBooks); //Obtener todos los libros
router.get("/:id", getBook); //Obtener un libro
router.post("/", verifyToken, createBook); //Crear un libro
router.patch("/update/:id", verifyToken, updateBook); //Actualizar un libro
router.delete("/delete/:id", verifyToken, deleteBook); //Eliminar un libro

module.exports=router;