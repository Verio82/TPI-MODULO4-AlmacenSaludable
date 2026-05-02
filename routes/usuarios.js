const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

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

// 📌 Registro de usuario (solo administrador puede crear)
router.post("/", verificarToken, verificarRol(["administrador"]), async (req, res) => {
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
router.post("/login", async (req, res) => {
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
router.put("/:id", verificarToken, verificarRol(["administrador"]), async (req, res) => {
  try {
    const { nombre, password, rol } = req.body;
    const updateData = { nombre, rol };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(usuario);
  } catch (error) {
    res.status(400).json({ error: "Error al actualizar usuario" });
  }
});

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