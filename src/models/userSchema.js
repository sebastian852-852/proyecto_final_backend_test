const { Schema, model } = require('mongoose');

const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
const passwordRegex = /(?=.*[0-9])(?=.*[a-zA-Z]).{8,}/;

const userSchema = new Schema(
    {
        name: { type: String, required: true },
        email: {
            type: String, required: true,
            unique: true,
            validate: {
                validator: email => emailRegex.test(email),
                message: props => `${props.value} no es un email valido`
            }
        },
        password: { type: String,
            required: true,
            minlength: 8,
            validate: {
                validator: password => passwordRegex.test(password),
                message: "La contraseña debe contener al menos un número y por lo menos una letra"
            }
        },
        books_sold: [{ type: Schema.Types.ObjectId, ref: "Book" }],
        books_purchased: [{ type: Schema.Types.ObjectId, ref: "Book" }],
        deleted: { type: Boolean, default: false },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

const User = model('User', userSchema);

module.exports = User;