const {Schema, model} = require('mongoose');

const schemaLibro = new Schema(
  {
    titulo: { type: String, required: true },
    autor: { type: String, required: true },
    genero: { type: String, required: true },
    fecha_publicacion: { type: Date, required: true },
    casa_editorial: { type: String, required: true },
    propietario: { type: Schema.Types.ObjectId, ref: "User"},
    precio: { type: Number, required: true },
    disponible: { type: Boolean, default: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Book = model("Book", schemaLibro);

module.exports = Book;