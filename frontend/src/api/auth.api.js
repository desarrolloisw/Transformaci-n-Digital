import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ENV_BACKEND_URL } from "../config/enviroments.config";

// Decodificar JWT y extraer datos del usuario
function extractUserDataFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      userTypeId: payload.userTypeId ? String(payload.userTypeId) : null,
      username: payload.username || "",
      id: payload.id ? String(payload.id) : null
    };
  } catch {
    return { userTypeId: null, username: "" };
  }
}

// Guardar y obtener el token y rol del localStorage
export const setAuthToken = (token) => {
  localStorage.setItem("token", token);
  const { id, userTypeId, username } = extractUserDataFromToken(token);
  if (userTypeId) localStorage.setItem("role", userTypeId);
  if (username) localStorage.setItem("username", username);
  if (id) localStorage.setItem("userId", id);
};
export const getAuthToken = () => {
  return localStorage.getItem("token");
};
export const removeAuthToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};
export const getUserRole = () => {
  return localStorage.getItem("role");
};

export const getUsername = () => {
  return localStorage.getItem("username");
}

export const getUserId = () => {
  return Number(localStorage.getItem("userId")) || null;  
}

// Interceptor para agregar el token a todas las peticiones
axios.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 1. Login
export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await axios.post(`${ENV_BACKEND_URL}/api/auth/login`, data);
      // El token está en res.data.user.token
      if (res.data.user && res.data.user.token) setAuthToken(res.data.user.token); // Guardar token y extraer userTypeId
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};

// 2. Logout
export const logout = () => {
  removeAuthToken();
};

// 3. Register (opcional, si tienes registro desde frontend)
export const useRegister = () => {
  return useMutation({
    mutationFn: async (data) => {
      console.log("Registering user with data:", data);
      const res = await axios.post(`${ENV_BACKEND_URL}/api/auth/register`, data);
      console.log(res)
      return res.data;
    },
  });
};
