import { client } from "@/sanity/client";
import { categoryQueries } from "@/sanity/queries";

/**
 * Helper to parse comma separated string into an array of trimmed strings
 */
const parseSubcategories = (subcategoriesStr) => {
  if (!subcategoriesStr) return [];
  return subcategoriesStr
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

/**
 * Map sanity category object to application category object
 */
const mapCategory = (category) => {
  if (!category) return null;
  return {
    ...category,
    subcategories: parseSubcategories(category.subcategories),
  };
};

export const categoryService = {
  /**
   * Get all categories from Sanity
   */
  getAllCategories: async () => {
    try {
      const categories = await client.fetch(categoryQueries.getAll);
      return categories.map(mapCategory);
    } catch (error) {
      console.error("Error fetching categories from Sanity:", error);
      return [];
    }
  },

  /**
   * Get a single category by its slug
   */
  getCategoryBySlug: async (slug) => {
    if (!slug) return null;
    try {
      const category = await client.fetch(categoryQueries.getBySlug, { slug });
      return mapCategory(category);
    } catch (error) {
      console.error(
        `Error fetching category with slug ${slug} from Sanity:`,
        error,
      );
      return null;
    }
  },
};
