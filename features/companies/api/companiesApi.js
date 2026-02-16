import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

/**
 * Client-side API calls for the companies feature.
 */
export const companiesApi = {
    /**
     * Get a single company by slug.
     */
    async getBySlug(slug) {
        return apiClient.get(API_ENDPOINTS.COMPANY_BY_SLUG(slug));
    },

    /**
     * Get platform stats.
     */
    async getPlatformStats() {
        return apiClient.get(API_ENDPOINTS.PLATFORM_STATS);
    },

    /**
     * Get featured positions.
     */
    async getFeaturedPositions() {
        return apiClient.get(API_ENDPOINTS.FEATURED_POSITIONS);
    },
};
