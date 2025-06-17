import axios from "axios";
import { ENV_BACKEND_URL } from "../config/enviroments.config";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// GET: Obtener todos los procesos (con filtro opcional por nombre o búsqueda)
export const useGetProcesses = (params = {}) => {
  return useQuery({
    queryKey: ["processes", params],
    queryFn: async () => {
      const res = await axios.get(`${ENV_BACKEND_URL}/api/processes`, { params });
      return res.data;
    },
    refetchOnWindowFocus: false,
  });
};

// GET: Obtener un proceso por ID
export const useGetProcess = (id) => {
  return useQuery({
    queryKey: ["process", id],
    queryFn: async () => {
      const res = await axios.get(`${ENV_BACKEND_URL}/api/processes/${id}`);
      return res.data;
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

// POST: Crear un proceso
export const useCreateProcess = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await axios.post(`${ENV_BACKEND_URL}/api/processes`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["processes"]);
    },
  });
};

// PUT: Actualizar un proceso
export const useUpdateProcess = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await axios.put(`${ENV_BACKEND_URL}/api/processes/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["processes"]);
    },
  });
};

// PATCH: Habilitar/deshabilitar un proceso
export const useToggleProcessActive = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isActive }) => {
      const res = await axios.patch(`${ENV_BACKEND_URL}/api/processes/${id}/toggle-active`, { isActive });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["processes"]);
    },
  });
};