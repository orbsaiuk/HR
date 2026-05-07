import { useState, useEffect } from "react";
import { categoryApi } from "../api/categoryApi";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await categoryApi.getAll();
        setCategories(result.data || []);
      } catch (err) {
        setError(err.message || "An error occurred while fetching categories");
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return {
    categories,
    isLoading,
    error,
  };
};
