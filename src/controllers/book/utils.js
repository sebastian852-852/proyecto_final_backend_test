const Book=require('../../models/bookSchema');

async function returnStatusBooksMongo(libros_ids) {
    const books = await Book.find({ _id: { $in: libros_ids } });
    books.every((book) => {
        book.disponible = true;
        book.save();
    });
}


module.exports = { returnStatusBooksMongo };