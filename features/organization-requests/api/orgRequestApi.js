import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const orgRequestApi = {
    async submitRequest(data) {
        const hasFile = data?.orgLogo instanceof File;

        if (!hasFile) {
            return apiClient.post(API_ENDPOINTS.ORG_REQUESTS, data);
        }

        // Use FormData when there's a file to upload
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value === undefined || value === null || value === "") return;
            if (key === "orgLogo" && value instanceof File) {
                formData.append(key, value);
                return;
            }
            formData.append(key, String(value));
        });

        const response = await fetch(API_ENDPOINTS.ORG_REQUESTS, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(
                error.error || error.message || "Failed to create organization request",
            );
        }

        return response.json();
    },

    async getMyRequests() {
        return apiClient.get(API_ENDPOINTS.ORG_REQUESTS);
    },

    async getRequestById(id) {
        return apiClient.get(API_ENDPOINTS.ORG_REQUEST_BY_ID(id));
    },
};
