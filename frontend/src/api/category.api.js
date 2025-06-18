import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ENV_BACKEND_URL } from "../config/enviroments.config";

// 1. Obtener todas las categorías (opcional: filtro por nombre)
export const useGetCategories = (params = {}) => {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: async () => {
      const res = await axios.get(`${ENV_BACKEND_URL}/api/categories`, { params });
      return res.data;
    },
    refetchOnWindowFocus: false,
  });
};

// 2. Obtener una categoría por ID
export const useGetCategory = (id) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: async () => {
      const res = await axios.get(`${ENV_BACKEND_URL}/api/categories/${id}`);
      return res.data;
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

// 3. Crear categoría
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await axios.post(`${ENV_BACKEND_URL}/api/categories`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
    },
  });
};

// 4. Actualizar categoría
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      const res = await axios.put(`${ENV_BACKEND_URL}/api/categories/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
    },
  });
};

// 5. Eliminar categoría
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await axios.delete(`${ENV_BACKEND_URL}/api/categories/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
    },
  });
};

// 6. Activar/desactivar categoría
export const useToggleCategoryActive = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await axios.put(`${ENV_BACKEND_URL}/api/categories/${id}/toggle-active`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
    },
  });
};

// 6b. Deshabilitar categoría
export const useDisableCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, userId }) => {
      const res = await axios.put(
        `${ENV_BACKEND_URL}/api/categories/${id}/toggle-active`,
        { isActive: false, userId }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
    },
  });
};

// 6c. Habilitar categoría
export const useEnableCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, userId }) => {
      const res = await axios.put(
        `${ENV_BACKEND_URL}/api/categories/${id}/toggle-active`,
        { isActive: true, userId }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
    },
  });
};

// 7. Obtener categorías por proceso
export const useGetCategoriesByProcess = (processId, params = {}) => {
  return useQuery({
    queryKey: ["categoriesByProcess", processId, params],
    queryFn: async () => {
      const res = await axios.get(`${ENV_BACKEND_URL}/api/categories/by-process/${processId}`, { params });
      return res.data;
    },
    enabled: !!processId,
    refetchOnWindowFocus: false,
  });
};

// 8. Obtener categorías que no están en un proceso (solo id y name)
export const useGetCategoriesNotInProcess = (processId, params = {}) => {
  return useQuery({
    queryKey: ["categoriesNotInProcess", processId, params],
    queryFn: async () => {
      const res = await axios.get(`${ENV_BACKEND_URL}/api/categories/not-in-process/${processId}`, { params });
      return res.data;
    },
    enabled: !!processId,
    refetchOnWindowFocus: false,
  });
};
