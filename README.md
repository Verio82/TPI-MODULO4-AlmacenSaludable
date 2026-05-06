# 🛒 Almacén Saludable - Módulo 4

Proyecto final del **Módulo 4**, donde se desarrolla una aplicación utilizando:

- ⚛️ React + Vite (Frontend)
- 🚀 Node.js + Express (Backend)
- 🍃 MongoDB Atlas (Base de datos)
- 🔐 JWT para autenticación
- ☁️ Render para despliegue

---

## 📌 Descripción del proyecto

El sistema permite gestionar un **almacén saludable**, implementando funcionalidades completas de administración y consulta.

### 🔑 Características principales

- 🔐 Autenticación de usuarios mediante JSON Web Tokens (JWT)
- 👥 Sistema de roles:
  - Administrador → acceso completo (CRUD)
  - Consulta → solo lectura
- 🥑 Gestión de productos:
  - Crear
  - Listar
  - Editar
  - Eliminar
- 👤 Gestión de usuarios (solo admin)
- 🎨 Interfaz moderna con Material UI
- 🔗 API REST con Express + MongoDB

---

## 🌐 Deploy en producción

Aplicación desplegada en Render:

- 🔗 Frontend  
  https://tpi-modulo4-almacensaludable-1.onrender.com/  

- 🔗 Backend  
  https://tpi-modulo4-almacensaludable.onrender.com  

---

## ⚙️ Instalación y Ejecución Local

Sigue estos pasos para correr el proyecto localmente:

### 1. Clonar el repositorio

git clone https://github.com/Verio82/TPI-MODULO4-AlmacenSaludable
cd TPI-ALMACENSALUDABLE

### 2. Backend

cd backend
npm install

Crear archivo .env con:

PORT=3000
MONGO_URI=mongodb+srv://node_user:node_password@clusteralmacen.6vxxtsq.mongodb.net/almacen-saludable
JWT_SECRET=clave_secreta_para_jwt

Ejecutar:
npm start

### 3. Frontend

cd almacen-saludable-frontend
npm install
npm run dev

Abrir en navegador: http://localhost:5173

---

## 🔗 Endpoints disponibles (Backend)

### 🔐 Autenticación
* POST /usuarios/login → Login de usuario (devuelve token y rol)

### 👤 Usuarios (solo administrador)
* POST /usuarios → Crear usuario
* GET /usuarios → Listar usuarios
* GET /usuarios/:id → Ver usuario por ID
* PUT /usuarios/:id → Actualizar usuario
* DELETE /usuarios/:id → Eliminar usuario

### 🥑 Productos
* GET /productos → Listar productos
* POST /productos → Crear producto (admin)
* PUT /productos/:id → Actualizar producto (admin)
* DELETE /productos/:id → Eliminar producto (admin)

---

## 🎨 Ejemplo de uso

### Login
POST /usuarios/login
Content-Type: application/json

{
  "nombre": "admin",
  "password": "1234"
}

### Respuesta
{
  "message": "Login exitoso",
  "token": "JWT_TOKEN",
  "rol": "administrador"
}

## 👩‍💻 Tecnologías utilizadas

### 🎨 Frontend
* React
* Vite
* Material UI
* Axios

### 🚀 Backend
* Node.js
* Express
* MongoDB Atlas
* JWT
* bcrypt

### ☁️ Deploy
* Render

---

## 📌 Notas finales
* Las rutas protegidas requieren token **JWT** en headers:
  `Authorization: Bearer TU_TOKEN`
* Solo los usuarios con rol **administrador** pueden modificarTienes razón, el bloque de código se cerró accidentalmente en el paso anterior. Aquí tienes el contenido completo, desde el inicio hasta el final, correctamente estructurado dentro de un único bloque de formato **Markdown** listo para copiar y pegar:

---

## 👩‍💻 Créditos

Este trabajo fue realizado por **Veronica Muzzio** como proyecto final de la carrera **Desarrollo Back End** en **ADA ITW**.