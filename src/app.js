const express=require('express');
const cors=require('cors');

const app=express();

// Middlewares
app.use(cors());
app.use(express.json());

// Configuracion
app.set('port',process.env.PORT || 3000);

// Routes
app.use('/api/auth',require('./routes/auth.routes'));
app.use('/api/users',require('./routes/user.routes'));
app.use('/api/books',require('./routes/books.routes'));
app.use('/api/orders',require('./routes/order.routes'));

module.exports=app;