/**
 * Dashboard API utilities and hooks
 *
 * Provides React Query hooks for dashboard analytics and statistics.
 * Handles fetching process/category counts, total questions, and log dates for dashboard visualizations.
 *
 * Exports:
 *   - useGetProcessCount(params): Fetch process count data
 *   - useGetCategoryCount(params): Fetch category count data
 *   - useGetCategoryCountByProcess(params): Fetch category count by process
 *   - useGetTotalQuestions(params): Fetch total questions
 *   - useGetFirstLogDate(): Fetch the date of the first log
 *   - useGetTotalQuestionsByProcess(params): Fetch total questions by process
 */
import { ENV_BACKEND_URL } from "../config/enviroments.config";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

// 1. Get process count
export const useGetProcessCount = (params) => {
  return useQuery({
    queryKey: ["processCount", params],
    queryFn: async () => {
      try {
        const res = await axios.get(`${ENV_BACKEND_URL}/api/dashboard/logs/process-count`, { params });
        return res.data.data || [];
      } catch (error) {
        throw new Error(error?.response?.data?.message || "Error fetching process count");
      }
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

// 2. Get category count
export const useGetCategoryCount = (params) => {
  return useQuery({
    queryKey: ["categoryCount", params],
    queryFn: async () => {
      try {
        const res = await axios.get(`${ENV_BACKEND_URL}/api/dashboard/logs/category-count`, { params });
        return res.data.data || [];
      } catch (error) {
        throw new Error(error?.response?.data?.message || "Error fetching category count");
      }
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

// 3. Get category count by process
export const useGetCategoryCountByProcess = (params) => {
  return useQuery({
    queryKey: ["categoryCountByProcess", params],
    queryFn: async () => {
      try {
        const res = await axios.get(`${ENV_BACKEND_URL}/api/dashboard/logs/category-count-by-process`, { params });
        return res.data.data || [];
      } catch (error) {
        throw new Error(error?.response?.data?.message || "Error fetching category count by process");
      }
    },
    enabled: !!params?.processId, // Only requires processId
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

// 4. Get total questions
export const useGetTotalQuestions = (params) => {
  return useQuery({
    queryKey: ["totalQuestions", params],
    queryFn: async () => {
      try {
        const res = await axios.get(`${ENV_BACKEND_URL}/api/dashboard/logs/total-questions`, { params });
        return res.data;
      } catch (error) {
        throw new Error(error?.response?.data?.message || "Error fetching total questions");
      }
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

// 5. Get the date of the first log
export const useGetFirstLogDate = () => {
  return useQuery({
    queryKey: ["firstLogDate"],
    queryFn: async () => {
      try {
        const res = await axios.get(`${ENV_BACKEND_URL}/api/dashboard/logs/first-log-date`);
        return res.data;
      } catch (error) {
        throw new Error(error?.response?.data?.message || "Error fetching first log date");
      }
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

// 6. Get total questions by process
export const useGetTotalQuestionsByProcess = (params) => {
  return useQuery({
    queryKey: ["totalQuestionsByProcess", params],
    queryFn: async () => {
      try {
        const res = await axios.get(`${ENV_BACKEND_URL}/api/dashboard/logs/total-questions-by-process`, { params });
        return res.data;
      } catch (error) {
        throw new Error(error?.response?.data?.message || "Error fetching total questions by process");
      }
    },
    enabled: !!params?.processId,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};