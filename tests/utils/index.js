require('dotenv').config({ path: '.env.test' });
const connect = require('../../src/database')

connect()

const app = require('../../src/app');
const request = require('supertest');

const testApp = request(app);

const testUser = [{
    name: "Alice Smith",
    email: "alice.smith@example.com",
    password: "Password123",
    books_sold: [],
    books_purchased: [],
    deleted: false
},
{
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    password: "SecurePass456",
    books_sold: [],
    books_purchased: [],
    deleted: false
},
{   
    _id: "60d0fe4f5311236168a109ca",
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    password: "MyPassword789",
    books_sold: ["60d0fe4f5311236168a109ca", "60d0fe4f5311236168a109cb"],
    books_purchased: ["60d0fe4f5311236168a109cc"],
    deleted: true
},
{
    name: "Alice Smith",
    email: "alice.smith1@example.com",
    password: "Password123",
    books_sold: [],
    books_purchased: [],
    deleted: false
}];

const testBook = [{
    titulo: "The Great Gatsby",
    autor: "F. Scott Fitzgerald",
    genero: "Fiction",
    fecha_publicacion: new Date('1925-04-10'),
    casa_editorial: "Scribner",
    propietario: "60d0fe4f5311236168a109ca",
    precio: 15.99,
    disponible: true
},
{
    titulo: "1984",
    autor: "George Orwell",
    genero: "Dystopian",
    fecha_publicacion: new Date('1949-06-08'),
    casa_editorial: "Secker & Warburg",
    propietario: "60d0fe4f5311236168a109cb",
    precio: 12.99,
    disponible: true
},
{
    titulo: "To Kill a Mockingbird",
    autor: "Harper Lee",
    genero: "Fiction",
    fecha_publicacion: new Date('1960-07-11'),
    casa_editorial: "J.B. Lippincott & Co.",
    propietario: "60d0fe4f5311236168a109cc",
    precio: 18.99,
    disponible: false
}];

const testOrder = [{
    comprador: "60d0fe4f5311236168a109ca",
    vendedor: "60d0fe4f5311236168a109cb",
    libros_ids: ["60d0fe4f5311236168a109cd", "60d0fe4f5311236168a109ce"],
    direccion_envio: "123 Main St, Springfield",
    total: 28.98,
    estado: "en progreso"
},
{
    comprador: "60d0fe4f5311236168a109cc",
    vendedor: "60d0fe4f5311236168a109ca",
    libros_ids: ["60d0fe4f5311236168a109cf"],
    direccion_envio: "456 Elm St, Shelbyville",
    total: 18.99,
    estado: "en progreso"
},
{
    comprador: "60d0fe4f5311236168a109cb",
    vendedor: "60d0fe4f5311236168a109cc",
    libros_ids: ["60d0fe4f5311236168a109d0"],
    direccion_envio: "789 Oak St, Capital City",
    total: 15.99,
    estado: "completado"
}];

module.exports = { testApp, testUser, testBook, testOrder };