//Importamos mongoose para conectar a la base de datos
const mongoose = require('mongoose');

//Modulo dotenv para leer las variables de entorno desde el archivo .env
require('dotenv').config();

//Definimos una funcion asincrona para conectar a la base de datos
const connectDB = async () => {
    //intentamos conectar a la base de datos usando mongoose.connect con la URI de conexion obtenida de las variables de entorno
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log('Conectado a MongoDB')
    } catch (error) {
        console.error('Error de conexion a MongoDB:', error);
        process.exit(1);

    }
}

//Exportamos la funcion para usarla en otros archivos
module.exports = connectDB;    