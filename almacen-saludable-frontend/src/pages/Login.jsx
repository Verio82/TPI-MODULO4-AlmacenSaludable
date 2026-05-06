import React, { useState } from "react";
import axios from "axios";
import { Button, TextField, Box, Typography } from "@mui/material";

function Login() {
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:3000/usuarios/login", {
        nombre,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("rol", res.data.rol); // guardamos rol para condicionar vistas
      // Esperar un tick para asegurar que se guardó
    setTimeout(() => {
      window.location.href = "/productos";
      }, 100);
    } catch (err) {
      alert("Error al iniciar sesión");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <Box p={3}>
      <Typography variant="h5">Login</Typography>
      <TextField
        label="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        fullWidth margin="normal"
      />
      <TextField
        label="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleLogin}>
        Iniciar sesión
      </Button>
      <Button variant="outlined" color="secondary" onClick={handleLogout} sx={{ ml: 2 }}>
        Cerrar sesión
      </Button>
    </Box>
  );
}

export default Login;