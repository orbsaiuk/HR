/**
 * Audit Logs API client
 * Handles all audit-log-related API calls from the frontend.
 */

import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const auditApi = {
    async getLogs({ category, actor, limit } = {}) {
        const params = new URLSearchParams();
        if (category) params.set("category", category);
        if (actor) params.set("actor", actor);
        if (limit) params.set("limit", String(limit));

        const query = params.toString();
        const url = query
            ? `${API_ENDPOINTS.AUDIT_LOGS}?${query}`
            : API_ENDPOINTS.AUDIT_LOGS;

        return apiClient.get(url);
    },
};
