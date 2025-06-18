/**
 * FAQ API utilities and hooks
 *
 * Provides React Query hooks and direct functions for FAQ operations by process and category.
 * Handles fetching, creating, updating, and toggling FAQ active state.
 *
 * Exports:
 *   - useGetFaqByProcessAndCategory(processId, categoryId): Fetch FAQ by process and category
 *   - useCreateFaq(): Mutation to create a FAQ
 *   - useUpdateFaqResponse(): Mutation to update FAQ response
 *   - useToggleFaqActive(): Mutation to toggle FAQ active state
 *   - getFaqByProcessAndCategory(processId, categoryId): Direct function to fetch FAQ by process and category
 */
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ENV_BACKEND_URL } from "../config/enviroments.config";

// Fetch FAQ by process and category
export const useGetFaqByProcessAndCategory = (processId, categoryId) => {
  return useQuery({
    queryKey: ["faq", processId, categoryId],
    queryFn: async () => {
      const res = await axios.get(`${ENV_BACKEND_URL}/api/faqs/by-process-category`, {
        params: { processId, categoryId }
      });
      return res.data;
    },
    enabled: !!processId && !!categoryId,
    refetchOnWindowFocus: false,
  });
};

// Create FAQ
export const useCreateFaq = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await axios.post(`${ENV_BACKEND_URL}/api/faqs`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["faq"]);
    },
  });
};

// Update FAQ response
export const useUpdateFaqResponse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await axios.put(`${ENV_BACKEND_URL}/api/faqs/update-response`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["faq"]);
    },
  });
};

// Toggle FAQ active state
export const useToggleFaqActive = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await axios.put(`${ENV_BACKEND_URL}/api/faqs/toggle-active`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["faq"]);
    },
  });
};

// Fetch FAQ by process and category (direct function, not a hook)
export async function getFaqByProcessAndCategory(processId, categoryId) {
  const res = await axios.get(`${ENV_BACKEND_URL}/api/faqs/by-process-category`, {
    params: { processId, categoryId }
  });
  return res.data;
}
