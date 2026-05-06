import React, { useState, useEffect } from "react";
import api from "../axiosConfig";
import {
  Button,
  TextField,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

function Productos() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [categoria, setCategoria] = useState("");
  const [proveedor, setProveedor] = useState("");

  const [openEdit, setOpenEdit] = useState(false);
  const [productoEdit, setProductoEdit] = useState(null);

  const token = localStorage.getItem("token");
  const rolUsuario = localStorage.getItem("rol");

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await api.get("/productos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProductos(res.data);
    } catch {
      alert("Error al cargar productos");
    }
  };

  const crearProducto = async () => {
    try {
      await api.post(
        "/productos",
        { 
          nombre, 
          precio: parseFloat(precio), 
          stock: parseInt(stock), 
          categoria, 
          proveedor 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNombre(""); setPrecio(""); setStock(""); setCategoria(""); setProveedor("");
      fetchProductos();
    } catch (err) {
      if (err.response?.data?.errores) {
        alert(err.response.data.errores.map(e => e.msg).join("\n"));
      } else {
        alert("Error al crear producto");
      }
    }
  };

  const eliminarProducto = async (id) => {
    try {
      await api.delete(`/productos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProductos();
    } catch {
      alert("Error al eliminar producto");
    }
  };

  const abrirEdicion = (producto) => {
    setProductoEdit(producto);
    setOpenEdit(true);
  };

  const guardarEdicion = async () => {
    try {
      await api.put(
        `/productos/${productoEdit._id}`,
        {
          nombre: productoEdit.nombre,
          precio: parseFloat(productoEdit.precio),
          stock: parseInt(productoEdit.stock),
          categoria: productoEdit.categoria,
          proveedor: productoEdit.proveedor,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOpenEdit(false);
      setProductoEdit(null);
      fetchProductos();
    } catch (err) {
      if (err.response?.data?.errores) {
        alert(err.response.data.errores.map(e => e.msg).join("\n"));
      } else {
        alert("Error al editar producto");
      }
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5">Productos</Typography>

      {rolUsuario === "administrador" && (
        <>
          <TextField label="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          <TextField label="Precio" type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
          <TextField label="Stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
          <TextField label="Categoría" value={categoria} onChange={(e) => setCategoria(e.target.value)} required />
          <TextField label="Proveedor" value={proveedor} onChange={(e) => setProveedor(e.target.value)} required />
          <Button variant="contained" color="primary" onClick={crearProducto}>
            Agregar Producto
          </Button>
        </>
      )}

      {productos.map((p) => (
        <Box key={p._id} display="flex" justifyContent="space-between" mt={2}>
          <Typography>
            {p.nombre} - ${p.precio} - Stock: {p.stock} - Categoría: {p.categoria} - Proveedor: {p.proveedor}
          </Typography>
          {rolUsuario === "administrador" && (
            <Box>
              <Button variant="contained" color="primary" onClick={() => abrirEdicion(p)}>Editar</Button>
              <Button variant="contained" color="error" onClick={() => eliminarProducto(p._id)} sx={{ ml: 1 }}>Eliminar</Button>
            </Box>
          )}
        </Box>
      ))}

      {/* Modal de edición */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Editar Producto</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre"
            value={productoEdit?.nombre || ""}
            onChange={(e) => setProductoEdit({ ...productoEdit, nombre: e.target.value })}
            fullWidth margin="dense"
          />
          <TextField
            label="Precio"
            type="number"
            value={productoEdit?.precio || ""}
            onChange={(e) => setProductoEdit({ ...productoEdit, precio: e.target.value })}
            fullWidth margin="dense"
          />
          <TextField
            label="Stock"
            type="number"
            value={productoEdit?.stock || ""}
            onChange={(e) => setProductoEdit({ ...productoEdit, stock: e.target.value })}
            fullWidth margin="dense"
          />
          <TextField
            label="Categoría"
            value={productoEdit?.categoria || ""}
            onChange={(e) => setProductoEdit({ ...productoEdit, categoria: e.target.value })}
            fullWidth margin="dense"
          />
          <TextField
            label="Proveedor"
            value={productoEdit?.proveedor || ""}
            onChange={(e) => setProductoEdit({ ...productoEdit, proveedor: e.target.value })}
            fullWidth margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancelar</Button>
          <Button variant="contained" color="primary" onClick={guardarEdicion}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Productos;