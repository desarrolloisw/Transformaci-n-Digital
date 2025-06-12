import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ENV_BACKEND_URL } from "../config/enviroments.config";

// 1. Obtener todos los usuarios
export const useGetUsers = (params = {}) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: async () => {
      const res = await axios.get(`${ENV_BACKEND_URL}/api/users`, { params });
      return res.data;
    },
    refetchOnWindowFocus: false,
  });
};

// 2. Obtener usuario por ID
export const useGetUser = (id) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const res = await axios.get(`${ENV_BACKEND_URL}/api/users/${id}`);
      return res.data;
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

// 3. Actualizar nombre completo
export const useUpdateCompleteName = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      const res = await axios.put(`${ENV_BACKEND_URL}/api/users/${id}/complete-name`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });
};

// 4. Actualizar email
export const useUpdateEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      const res = await axios.put(`${ENV_BACKEND_URL}/api/users/${id}/email`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });
};

// 5. Actualizar username
export const useUpdateUsername = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      const res = await axios.put(`${ENV_BACKEND_URL}/api/users/${id}/username`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });
};

// 6. Actualizar contraseña
export const useUpdatePassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      const res = await axios.put(`${ENV_BACKEND_URL}/api/users/${id}/password`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });
};

// 7. Habilitar/deshabilitar usuario
export const useToggleUserEnabled = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      const res = await axios.put(`${ENV_BACKEND_URL}/api/users/${id}/toggle-enabled`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });
};

// 8. Obtener tipos de usuario
export const useGetUserTypes = () => {
  return useQuery({
    queryKey: ["userTypes"],
    queryFn: async () => {
      const res = await axios.get(`${ENV_BACKEND_URL}/api/users/user-types`);
      return res.data;
    },
    refetchOnWindowFocus: false,
  });
};
