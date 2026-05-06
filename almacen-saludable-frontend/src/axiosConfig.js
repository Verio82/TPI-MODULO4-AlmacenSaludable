import axios from "axios";

// Crear una instancia de Axios
const api = axios.create({
  baseURL: "http://localhost:3000", // tu backend
});

// Interceptor global de respuestas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.data &&
      error.response.data.error === "Token inválido o expirado"
    ) {
      // 🔑 Si el token está vencido o inválido → logout automático
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
