import { clientRead } from "@/sanity/client";
import { organizationQueries } from "@/sanity/queries/organizations";

/**
 * Get all public companies with open position counts.
 */
export async function getPublicCompanies() {
    return clientRead.fetch(organizationQueries.getPublicCompanies);
}

/**
 * Get a single company by slug with its open positions.
 */
export async function getPublicCompanyBySlug(slug) {
    return clientRead.fetch(organizationQueries.getPublicCompanyBySlug, { slug });
}

/**
 * Get platform-wide stats.
 */
export async function getPlatformStats() {
    return clientRead.fetch(organizationQueries.getPlatformStats);
}

/**
 * Get featured positions for the landing page.
 */
export async function getFeaturedPositions() {
    return clientRead.fetch(organizationQueries.getFeaturedPositions);
}

export const companyService = {
    getPublicCompanies,
    getPublicCompanyBySlug,
    getPlatformStats,
    getFeaturedPositions,
};
