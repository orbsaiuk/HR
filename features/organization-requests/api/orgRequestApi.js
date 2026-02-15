import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const orgRequestApi = {
    async submitRequest(data) {
        return apiClient.post(API_ENDPOINTS.ORG_REQUESTS, data);
    },

    async getMyRequests() {
        return apiClient.get(API_ENDPOINTS.ORG_REQUESTS);
    },

    async getRequestById(id) {
        return apiClient.get(API_ENDPOINTS.ORG_REQUEST_BY_ID(id));
    },
};
