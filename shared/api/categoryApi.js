import { API_ENDPOINTS } from "./endpoints";

export const categoryApi = {
  /**
   * Fetch all categories
   */
  getAll: async () => {
    const response = await fetch(API_ENDPOINTS.CATEGORIES);
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    return response.json();
  },

  /**
   * Fetch a specific category by slug
   */
  getBySlug: async (slug) => {
    const response = await fetch(`${API_ENDPOINTS.CATEGORIES}?slug=${slug}`);
    if (!response.ok) {
      throw new Error("Failed to fetch category");
    }
    return response.json();
  },
};
