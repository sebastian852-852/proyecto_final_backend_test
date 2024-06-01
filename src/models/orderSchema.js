const {Schema, model} = require('mongoose');

const schemaPedido = new Schema(
  {
    comprador: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    vendedor: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    libros_ids: [
      { type: Schema.Types.ObjectId, ref: "Book", required: true },
    ],
    direccion_envio: { type: String, required: true },
    total: { type: Number, required: true },
    estado: { type: String, default: "en progreso" },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Order = model("Order", schemaPedido);

module.exports = Order;