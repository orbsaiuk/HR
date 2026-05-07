import { client } from "@/sanity/client";
import { categoryQueries } from "@/sanity/queries";

/**
 * Map sanity category object to application category object
 */
const mapCategory = (category) => {
  if (!category) return null;
  return {
    ...category,
    subcategories: category.subcategories || [],
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
