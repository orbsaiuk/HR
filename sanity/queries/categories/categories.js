export const categoryQueries = {
  // Get all categories, ordered by order field
  getAll: `*[_type == "category"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    subcategories[]{
      title,
      "slug": slug.current
    },
    order
  }`,

  // Get a single category by slug
  getBySlug: `*[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    subcategories[]{
      title,
      "slug": slug.current
    },
    order
  }`,
};
