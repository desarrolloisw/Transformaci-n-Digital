import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ENV_BACKEND_URL } from "../config/enviroments.config";

/**
 * Authentication API utilities and hooks
 *
 * Provides functions and React Query hooks for authentication, user info, and token management.
 * Handles JWT decoding, localStorage management, and axios token injection.
 *
 * Exports:
 *   - setAuthToken(token): Stores token and user info in localStorage
 *   - getAuthToken(): Retrieves token from localStorage
 *   - removeAuthToken(): Removes token and role from localStorage
 *   - getUserRole(): Gets user role from localStorage
 *   - getUsername(): Gets username from localStorage
 *   - getUserId(): Gets user ID from localStorage
 *   - useLogin(): React Query mutation for login
 *   - logout(): Removes token and user info
 *   - useRegister(): React Query mutation for registration
 */

// Decode JWT and extract user data
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

// Store and retrieve token and role from localStorage
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

// Interceptor to add the token to all requests
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
      // The token is in res.data.user.token
      if (res.data.user && res.data.user.token) setAuthToken(res.data.user.token); // Store token and extract userTypeId
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

// 3. Register (optional, if you have frontend registration)
export const useRegister = () => {
  return useMutation({
    mutationFn: async (data) => {
      const res = await axios.post(`${ENV_BACKEND_URL}/api/auth/register`, data);
      return res.data;
    },
  });
};
