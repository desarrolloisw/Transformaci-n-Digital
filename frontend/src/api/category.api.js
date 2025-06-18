/**
 * Category API utilities and hooks
 *
 * Provides React Query hooks for CRUD operations and queries related to categories.
 * Handles fetching, creating, updating, enabling/disabling, and listing categories by process.
 *
 * Exports:
 *   - useGetCategories(params): Fetch all categories (optionally filtered by name)
 *   - useGetCategory(id): Fetch a category by ID
 *   - useCreateCategory(): Mutation to create a category
 *   - useUpdateCategory(): Mutation to update a category
 *   - useDeleteCategory(): Mutation to delete a category
 *   - useToggleCategoryActive(): Mutation to toggle category active state
 *   - useDisableCategory(): Mutation to disable a category
 *   - useEnableCategory(): Mutation to enable a category
 *   - useGetCategoriesByProcess(processId, params): Fetch categories by process
 *   - useGetCategoriesNotInProcess(processId, params): Fetch categories not in a process
 */
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ENV_BACKEND_URL } from "../config/enviroments.config";

// 1. Get all categories (optional: filter by name)
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

// 2. Get a category by ID
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

// 3. Create category
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

// 4. Update category
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

// 5. Delete category
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

// 6. Toggle category active state
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

// 6b. Disable category
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

// 6c. Enable category
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

// 7. Get categories by process
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

// 8. Get categories not in a process (only id and name)
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
