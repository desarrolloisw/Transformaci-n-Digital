/**
 * User API utilities and hooks
 *
 * Provides React Query hooks for CRUD operations and queries related to users.
 * Handles fetching, updating, enabling/disabling users, and retrieving user types.
 *
 * Exports:
 *   - useGetUsers(params): Fetch all users (optionally filtered)
 *   - useGetUser(id): Fetch a user by ID
 *   - useUpdateCompleteName(): Mutation to update user's full name
 *   - useUpdateEmail(): Mutation to update user's email
 *   - useUpdateUsername(): Mutation to update user's username
 *   - useUpdatePassword(): Mutation to update user's password
 *   - useToggleUserEnabled(): Mutation to enable/disable a user
 *   - useGetUserTypes(): Fetch available user types
 */
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ENV_BACKEND_URL } from "../config/enviroments.config";

// Get all users
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

// Get a user by ID
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

// Update user's full name
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

// Update user's email
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

// Update user's username
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

// Update user's password
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

// Enable/disable a user
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

// Get available user types
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
