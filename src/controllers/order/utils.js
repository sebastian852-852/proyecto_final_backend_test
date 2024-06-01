const Book = require('../../models/bookSchema');
const User=require('../../models/userSchema');
const { returnStatusBooksMongo } = require('../book/utils');

async function verifyOnlySalesman(books_ids) {
    const books = await Book.find({ _id: { $in: books_ids } });
    const firstSalesman = books[0].propietario;
    const isUnique = books.every((book) => book.propietario.equals(firstSalesman));

    if (!isUnique) return;

    return firstSalesman;
}

async function getBooksTotalPrice(books_ids) {
    const books = await Book.find({ _id: { $in: books_ids } });
    return books.reduce((acc, book) => acc + book.precio, 0);
}

async function changeStatusBooksMongo(libros_ids) {
    const books = await Book.find({ _id: { $in: libros_ids } });
    books.every(async (book) => await Book.findByIdAndUpdate(book._id, { disponible:false }));
}

async function putOrderInUser(userId, orderId, type) {
    const user = await User.findById(userId);
    type === 0
        ? user.books_purchased.push(orderId)
        : user.books_sold.push(orderId);
    await user.save();
}

async function updateOrderCompradorMongo(order, estado) {
    if (estado !== "cancelar") {
        throw new Error("El estado proporcionado no es válido.");
    }
    await returnStatusBooksMongo(order.libros_ids);
    order.estado = estado;
    await order.save();
    return order;
}

async function updateOrderVendedorMongo(order, estado) {
    if (estado !== "cancelar" && estado !== "completar") {
        throw new Error (400, "El estado proporcionado no es válido.");
    }
    if (estado === "cancelar") {
        await returnStatusBooksMongo(order.libros_ids);
    }
    order.estado = estado;
    await order.save();
    return order;
}

module.exports = { verifyOnlySalesman, getBooksTotalPrice, changeStatusBooksMongo, putOrderInUser, updateOrderCompradorMongo, updateOrderVendedorMongo};