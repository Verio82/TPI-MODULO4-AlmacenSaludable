//Importamos express
const express = require('express');

//Importamos morgan y winston para el logging
const morgan = require('morgan');
const winston = require('winston');
const path = require("path");

//Importar la funcion de conexion a la base de datos
const connectDB = require('./database');

//Importamos dotenv
require('dotenv').config();

//Importar las rutas de usuarios y productos
const usuariosRoutes = require('./routes/usuarios');
const productosRoutes = require('./routes/productos');

//Crear una instancia de express
const app = express();

//Importamos cors
const cors = require('cors');

//Definimos el puerto
const PORT = process.env.PORT || 3000;    

//Llamamos a la conexion para la BD
connectDB();

// 📌 Configuración de Winston (logs de errores y eventos)
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" })
  ]
});

// 📌 Configuración de Morgan (logs de peticiones HTTP)
app.use(morgan("combined", {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

//Middleware de express
app.use(express.json());

//Definimos una ruta de prueba para verificar que el servidor funciona
app.get('/', (req, res) => {
    res.send('API funcionando 🚀');
});

app.use(cors());

//Rutas
app.use('/usuarios', usuariosRoutes);
app.use('/productos', productosRoutes);

// Middleware de manejo de errores (captura excepciones)
app.use((err, req, res, next) => {
  logger.error(`${err.message} - ${req.originalUrl}`);
  res.status(500).json({ error: "Error interno del servidor" });
});

//Iniciar el servidor
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});

module.exports.logger = logger; // Exportamos el logger para usarlo en otras partes de la app