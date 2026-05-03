const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");
const Usuario = require("../models/Usuario");

const router = express.Router();

//// Middleware: rate limit para login (máx 5 intentos cada 15 min por IP)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos
  message: "Demasiados intentos de login, espera un rato"
});

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

// 📌 Registro de usuario (solo administrador puede crear)
router.post("/", verificarToken, verificarRol(["administrador"]),
[
    body("nombre")
      .notEmpty().withMessage("El nombre es obligatorio")
      .isLength({ min: 3 }).withMessage("El nombre debe tener al menos 3 caracteres"),
    body("password")
      .notEmpty().withMessage("La contraseña es obligatoria")
      .isLength({ min: 4 }).withMessage("La contraseña debe tener al menos 4 caracteres"),
    body("rol")
      .isIn(["administrador", "consulta"]).withMessage("Rol inválido"),
    body("email")
      .optional()
      .isEmail().withMessage("Formato de email inválido")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }

    try {
      const { nombre, password, rol } = req.body;

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

    const nuevoUsuario = new Usuario({
      nombre,
      password: hashedPassword,
      rol
    });
      await nuevoUsuario.save();
      res.status(201).json({ message: "Usuario creado correctamente" });
  } catch (error) {
    res.status(400).json({ error: "Error al crear usuario" });
  }
});

// 📌 Login (acceso público)
router.post("/login", loginLimiter,
  [
    body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
    body("password").notEmpty().withMessage("La contraseña es obligatoria")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    const { nombre, password } = req.body;

    try {
      const usuario = await Usuario.findOne({ nombre });
      if (!usuario) return res.status(400).json({ error: "Usuario no encontrado" });

      const esValida = await bcrypt.compare(password, usuario.password);
      if (!esValida) return res.status(400).json({ error: "Contraseña incorrecta" });

      const token = jwt.sign(
        { id: usuario._id, nombre: usuario.nombre, rol: usuario.rol },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.json({ message: "Login exitoso", token });
  } catch (error) {
    res.status(500).json({ error: "Error en el login" });
  }
});

// 📌 Listar usuarios (solo administrador)
router.get("/", verificarToken, verificarRol(["administrador"]), async (req, res) => {
  const usuarios = await Usuario.find();
  res.json(usuarios);
});

// 📌 Ver usuario por ID (solo administrador)
router.get("/:id", verificarToken, verificarRol(["administrador"]), async (req, res) => {
  const usuario = await Usuario.findById(req.params.id);
  if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
  res.json(usuario);
});

// 📌 Actualizar usuario (solo administrador)
router.put("/:id", verificarToken, verificarRol(["administrador"]), 
  [
    body("nombre")
      .optional()
      .isLength({ min: 3 }).withMessage("El nombre debe tener al menos 3 caracteres"),
    body("password")
      .optional()
      .isLength({ min: 4 }).withMessage("La contraseña debe tener al menos 4 caracteres"),
    body("rol")
      .optional()
      .isIn(["administrador", "consulta"]).withMessage("Rol inválido"),
    body("email")
      .optional()
      .isEmail().withMessage("Formato de email inválido")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }

    try {
      const usuarioActualizado = await Usuario.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!usuarioActualizado) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      res.json(usuarioActualizado);
    } catch (error) {
      res.status(400).json({ error: "Error al actualizar usuario" });
    }
  }
);

// 📌 Eliminar usuario (solo administrador)
router.delete("/:id", verificarToken, verificarRol(["administrador"]), async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.params.id);
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(400).json({ error: "Error al eliminar usuario" });
  }
});

module.exports = router;