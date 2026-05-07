import useSWR from "swr";
import { categoryApi } from "../api/categoryApi";
import { API_ENDPOINTS } from "../api/endpoints";

export const useCategories = () => {
  const { data, error, isLoading } = useSWR(
    API_ENDPOINTS.CATEGORIES || "/api/categories",
    () => categoryApi.getAll().then((res) => res.data),
  );

  return {
    categories: data || [],
    isLoading,
    error: error
      ? error.message || "An error occurred while fetching categories"
      : null,
  };
};
