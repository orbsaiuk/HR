import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const userProfileApi = {
    /**
     * Get the current user's full profile
     */
    async getProfile() {
        return apiClient.get(API_ENDPOINTS.USER_PROFILE);
    },

    /**
     * Update profile fields
     * @param {object} data - Profile fields to update
     */
    async updateProfile(data) {
        return apiClient.put(API_ENDPOINTS.USER_PROFILE, data);
    },

    /**
     * Upload a resume file.
     * Uses raw fetch because apiClient.post JSON-stringifies the body.
     * @param {FormData} formData - Must contain a "file" field
     */
    async uploadResume(formData) {
        const response = await fetch(API_ENDPOINTS.USER_PROFILE_RESUME, {
            method: "POST",
            body: formData,
            // Let the browser set the multipart Content-Type with boundary
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error || error.message || "Resume upload failed");
        }

        return response.json();
    },

    /**
     * Get profile completion status
     */
    async getCompleteness() {
        return apiClient.get(API_ENDPOINTS.USER_PROFILE_COMPLETENESS);
    },
};

