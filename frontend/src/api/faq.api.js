import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ENV_BACKEND_URL } from "../config/enviroments.config";

// Obtener FAQ por proceso y categoría
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

// Crear FAQ
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

// Modificar respuesta de FAQ
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

// Activar/desactivar FAQ
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

// Obtener FAQ por proceso y categoría (función directa, no hook)
export async function getFaqByProcessAndCategory(processId, categoryId) {
  const res = await axios.get(`${ENV_BACKEND_URL}/api/faqs/by-process-category`, {
    params: { processId, categoryId }
  });
  return res.data;
}
