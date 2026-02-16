import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
});

/**
 * Generate a URL for a Sanity image asset.
 * @param {object} source - Sanity image field value
 * @returns {import("@sanity/image-url/lib/types/builder").ImageUrlBuilder}
 */
export function urlFor(source) {
    return builder.image(source);
}
