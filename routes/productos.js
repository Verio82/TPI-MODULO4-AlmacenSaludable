const express = require("express");
const Producto = require("../models/Producto");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

const router = express.Router();

// Middleware: verificar token
function verificarToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token requerido" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, nombre, rol }
    next();
  } catch (error) {
    res.status(403).json({ error: "Token inválido o expirado" });
  }
}

// Middleware: verificar rol
function verificarRol(rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user || !rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ error: "No tienes permisos para esta acción" });
    }
    next();
  };
}

// 📌 Crear producto (solo administrador)
router.post("/", verificarToken, verificarRol(["administrador"]), 
 [
    body("nombre")
      .notEmpty().withMessage("El nombre del producto es obligatorio"),
    body("stock")
      .isInt({ min: 0 }).withMessage("El stock debe ser un número entero positivo"),
    body("precio")
      .isFloat({ min: 0 }).withMessage("El precio debe ser un número positivo"),
    body("categoria")
      .optional()
      .isString().withMessage("La categoría debe ser texto"),
    body("proveedor")
      .notEmpty().withMessage("El proveedor es obligatorio")
  ], 
 async (req, res) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }

  try {
    const nuevoProducto = new Producto(req.body);
    await nuevoProducto.save();
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(400).json({ error: "Error al crear producto" });
  }
});

// 📌 Listar todos los productos (consulta y administrador)
router.get("/", verificarToken, verificarRol(["consulta", "administrador"]), async (req, res) => {
  const productos = await Producto.find();
  res.json(productos);
});

// 📌 Ver producto por ID (consulta y administrador)
router.get("/:id", verificarToken, verificarRol(["consulta", "administrador"]), async (req, res) => {
  const producto = await Producto.findById(req.params.id);
  if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
  res.json(producto);
});

// 📌 Actualizar producto (solo administrador)
router.put("/:id", verificarToken, verificarRol(["administrador"]),
[
    body("nombre")
      .optional()
      .notEmpty().withMessage("El nombre no puede estar vacío"),
    body("stock")
      .optional()
      .isInt({ min: 0 }).withMessage("El stock debe ser un número entero positivo"),
    body("precio")
      .optional()
      .isFloat({ min: 0 }).withMessage("El precio debe ser un número positivo"),
    body("categoria")
      .optional()
      .isString().withMessage("La categoría debe ser texto"),
    body("proveedor")
      .optional()
      .notEmpty().withMessage("El proveedor no puede estar vacío")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
  try {
    const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(producto);
  } catch (error) {
    res.status(400).json({ error: "Error al actualizar producto" });
  }
});

// 📌 Eliminar producto (solo administrador)
router.delete("/:id", verificarToken, verificarRol(["administrador"]), async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(400).json({ error: "Error al eliminar producto" });
  }
});

module.exports = router;