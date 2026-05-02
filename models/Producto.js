const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  precio: {
    type: Number,
    required: true,
    min: 0
  },
  categoria: {
    type: String,
    default: "General"
  },
  proveedor: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Producto", productoSchema);
