const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    enum: ["consulta", "administrador"], // solo acepta estos dos valores
    default: "consulta"
  }
}, { timestamps: true });

module.exports = mongoose.model("Usuario", usuarioSchema);
