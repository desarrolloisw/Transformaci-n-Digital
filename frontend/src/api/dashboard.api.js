import { ENV_BACKEND_URL } from "../config/enviroments.config";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

// 1. Conteo de procesos
export const useGetProcessCount = (params) => {
  return useQuery({
    queryKey: ["processCount", params],
    queryFn: async () => {
      try {
        const res = await axios.get(`${ENV_BACKEND_URL}/api/dashboard/logs/process-count`, { params });
        return res.data.data || [];
      } catch (error) {
        throw new Error(error?.response?.data?.message || "Error al obtener el conteo de procesos");
      }
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

// 2. Conteo de categorías
export const useGetCategoryCount = (params) => {
  return useQuery({
    queryKey: ["categoryCount", params],
    queryFn: async () => {
      try {
        const res = await axios.get(`${ENV_BACKEND_URL}/api/dashboard/logs/category-count`, { params });
        return res.data.data || [];
      } catch (error) {
        throw new Error(error?.response?.data?.message || "Error al obtener el conteo de categorías");
      }
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

// 3. Conteo de categorías por proceso
export const useGetCategoryCountByProcess = (params) => {
  return useQuery({
    queryKey: ["categoryCountByProcess", params],
    queryFn: async () => {
      try {
        const res = await axios.get(`${ENV_BACKEND_URL}/api/dashboard/logs/category-count-by-process`, { params });
        return res.data.data || [];
      } catch (error) {
        throw new Error(error?.response?.data?.message || "Error al obtener el conteo de categorías por proceso");
      }
    },
    enabled: !!params?.processId, // Solo requiere processId
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

// 4. Total de preguntas (consultas)
export const useGetTotalQuestions = (params) => {
  return useQuery({
    queryKey: ["totalQuestions", params],
    queryFn: async () => {
      try {
        const res = await axios.get(`${ENV_BACKEND_URL}/api/dashboard/logs/total-questions`, { params });
        return res.data;
      } catch (error) {
        throw new Error(error?.response?.data?.message || "Error al obtener el total de preguntas");
      }
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

// 5. Fecha del primer log
export const useGetFirstLogDate = () => {
  return useQuery({
    queryKey: ["firstLogDate"],
    queryFn: async () => {
      try {
        const res = await axios.get(`${ENV_BACKEND_URL}/api/dashboard/logs/first-log-date`);
        return res.data;
      } catch (error) {
        throw new Error(error?.response?.data?.message || "Error al obtener la fecha del primer log");
      }
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

// 6. Total de preguntas por proceso
export const useGetTotalQuestionsByProcess = (params) => {
  return useQuery({
    queryKey: ["totalQuestionsByProcess", params],
    queryFn: async () => {
      try {
        const res = await axios.get(`${ENV_BACKEND_URL}/api/dashboard/logs/total-questions-by-process`, { params });
        return res.data;
      } catch (error) {
        throw new Error(error?.response?.data?.message || "Error al obtener el total de preguntas por proceso");
      }
    },
    enabled: !!params?.processId,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};