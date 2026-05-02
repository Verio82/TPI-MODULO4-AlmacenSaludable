//Importamos express
const express = require('express');

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

//Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

