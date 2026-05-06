import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import Usuarios from "./pages/Usuarios";
import Productos from "./pages/Productos";
import Login from "./pages/Login";

function App() {
  return (
    <>
      <AppBar position="static" style={{ backgroundColor: "#4caf50" }}>
        <Toolbar>
          <Typography variant="h5" style={{ flexGrow: 1, fontFamily: "'Pacifico', cursive" }}>
            🌿 Almacén Saludable
          </Typography>
          <Button color="inherit" component={Link} to="/login">Login</Button>
          <Button color="inherit" component={Link} to="/usuarios">Usuarios</Button>
          <Button color="inherit" component={Link} to="/productos">Productos</Button>
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/productos" element={<Productos />} />
      </Routes>
    </>
  );
}

export default App;