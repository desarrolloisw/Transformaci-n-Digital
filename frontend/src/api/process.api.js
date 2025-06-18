/**
 * Process API utilities and hooks
 *
 * Provides React Query hooks for CRUD operations and queries related to processes.
 * Handles fetching, creating, updating, enabling/disabling, and listing processes.
 *
 * Exports:
 *   - useGetProcesses(params): Fetch all processes (optionally filtered by name or search)
 *   - useGetProcess(id): Fetch a process by ID
 *   - useCreateProcess(): Mutation to create a process
 *   - useUpdateProcess(): Mutation to update a process
 *   - useToggleProcessActive(): Mutation to enable/disable a process
 *   - useDisableProcess(): Mutation to disable a process
 *   - useEnableProcess(): Mutation to enable a process
 */
import axios from "axios";
import { ENV_BACKEND_URL } from "../config/enviroments.config";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Get all processes (optionally filtered by name or search)
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

// Get a process by ID
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

// Create a process
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

// Update a process
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

// Enable/disable a process
export const useToggleProcessActive = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isActive }) => {
      const res = await axios.put(`${ENV_BACKEND_URL}/api/processes/${id}/toggle-active`, { isActive });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["processes"]);
    },
  });
};

// Disable a process
export const useDisableProcess = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, userId }) => {
      const res = await axios.put(
        `${ENV_BACKEND_URL}/api/processes/${id}/toggle-active`,
        { isActive: false, userId }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["processes"]);
    },
  });
};

// Enable a process
export const useEnableProcess = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, userId }) => {
      const res = await axios.put(
        `${ENV_BACKEND_URL}/api/processes/${id}/toggle-active`,
        { isActive: true, userId }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["processes"]);
    },
  });
};