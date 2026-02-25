/**
 * Audit Logs API client
 * Handles all audit-log-related API calls from the frontend.
 */

import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const auditApi = {
    async getLogs({ category, actor, startDate, endDate, page, pageSize } = {}) {
        const params = new URLSearchParams();
        if (category) params.set("category", category);
        if (actor) params.set("actor", actor);
        if (startDate) params.set("startDate", startDate);
        if (endDate) params.set("endDate", endDate);
        if (page) params.set("page", String(page));
        if (pageSize) params.set("pageSize", String(pageSize));

        const query = params.toString();
        const url = query
            ? `${API_ENDPOINTS.AUDIT_LOGS}?${query}`
            : API_ENDPOINTS.AUDIT_LOGS;

        return apiClient.get(url);
    },

    getExportUrl({ format = "csv", category, startDate, endDate } = {}) {
        const params = new URLSearchParams();
        params.set("format", format);
        if (category) params.set("category", category);
        if (startDate) params.set("startDate", startDate);
        if (endDate) params.set("endDate", endDate);

        return `${API_ENDPOINTS.AUDIT_LOGS}/export?${params.toString()}`;
    },
};
