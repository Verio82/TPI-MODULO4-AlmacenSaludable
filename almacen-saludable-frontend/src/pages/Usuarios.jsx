import React, { useState, useEffect } from "react";
import api from "../axiosConfig";
import {
  Button,
  TextField,
  Box,
  Typography,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("");

  const [openEdit, setOpenEdit] = useState(false);
  const [usuarioEdit, setUsuarioEdit] = useState(null);

  const token = localStorage.getItem("token");
  const rolUsuario = localStorage.getItem("rol");

  useEffect(() => {
    if (rolUsuario === "administrador") {
      fetchUsuarios();
    }
  }, []);

  const fetchUsuarios = async () => {
    try {
      const res = await api.get("/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(res.data);
    } catch {
      alert("Error al cargar usuarios");
    }
  };

  const crearUsuario = async () => {
    try {
      await api.post(
        "/usuarios",
        { nombre, password, rol },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNombre(""); setPassword(""); setRol("");
      fetchUsuarios();
    } catch (err) {
      if (err.response?.data?.errores) {
        alert(err.response.data.errores.map(e => e.msg).join("\n"));
      } else {
        alert("Error al crear usuario");
      }
    }
  };

  const eliminarUsuario = async (id) => {
    try {
      await api.delete(`/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsuarios();
    } catch {
      alert("Error al eliminar usuario");
    }
  };

  const abrirEdicion = (usuario) => {
    setUsuarioEdit(usuario);
    setOpenEdit(true);
  };

  const guardarEdicion = async () => {
    try {
      await api.put(
        `/usuarios/${usuarioEdit._id}`,
        {
          nombre: usuarioEdit.nombre,
          password: usuarioEdit.password,
          rol: usuarioEdit.rol,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOpenEdit(false);
      setUsuarioEdit(null);
      fetchUsuarios();
    } catch (err) {
      if (err.response?.data?.errores) {
        alert(err.response.data.errores.map(e => e.msg).join("\n"));
      } else {
        alert("Error al editar usuario");
      }
    }
  };

  if (rolUsuario !== "administrador") {
    return <Typography>No tienes acceso a esta página</Typography>;
  }

  return (
    <Box p={3}>
      <Typography variant="h5">Usuarios</Typography>
      <TextField label="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      <TextField label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Select value={rol} onChange={(e) => setRol(e.target.value)} displayEmpty>
        <MenuItem value="" disabled>Seleccionar rol</MenuItem>
        <MenuItem value="administrador">Administrador</MenuItem>
        <MenuItem value="consulta">Consulta</MenuItem>
      </Select>
      <Button variant="contained" color="primary" onClick={crearUsuario}>
        Crear Usuario
      </Button>

      {usuarios.map((u) => (
        <Box key={u._id} display="flex" justifyContent="space-between" mt={2}>
          <Typography>{u.nombre} - {u.rol}</Typography>
          <Box>
            <Button variant="contained" color="primary" onClick={() => abrirEdicion(u)}>Editar</Button>
            <Button variant="contained" color="error" onClick={() => eliminarUsuario(u._id)} sx={{ ml: 1 }}>Eliminar</Button>
          </Box>
        </Box>
      ))}

      {/* Modal de edición */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Editar Usuario</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre"
            value={usuarioEdit?.nombre || ""}
            onChange={(e) => setUsuarioEdit({ ...usuarioEdit, nombre: e.target.value })}
            fullWidth margin="dense"
          />
          <TextField
            label="Contraseña"
            type="password"
            value={usuarioEdit?.password || ""}
            onChange={(e) => setUsuarioEdit({ ...usuarioEdit, password: e.target.value })}
            fullWidth margin="dense"
          />
          <Select
            value={usuarioEdit?.rol || ""}
            onChange={(e) => setUsuarioEdit({ ...usuarioEdit, rol: e.target.value })}
            fullWidth
          >
            <MenuItem value="administrador">Administrador</MenuItem>
            <MenuItem value="consulta">Consulta</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancelar</Button>
          <Button variant="contained" color="primary" onClick={guardarEdicion}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Usuarios;