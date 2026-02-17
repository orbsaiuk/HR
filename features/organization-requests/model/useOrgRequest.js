"use client";

import { useState, useEffect, useCallback } from "react";
import { orgRequestApi } from "../api/orgRequestApi";

/**
 * Hook to submit organization registration requests and fetch the user's requests.
 */
export function useOrgRequest(enabled = false) {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchRequests = useCallback(async () => {
        if (!enabled) {
            setRequests([]);
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const data = await orgRequestApi.getMyRequests();
            setRequests(data);
        } catch (err) {
            setError(err.message || "Failed to load organization requests");
        } finally {
            setLoading(false);
        }
    }, [enabled]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    /**
     * Submit a new organization registration request.
     * @param {object} data - Request data (orgName, contactEmail, etc.)
     */
    const submitRequest = useCallback(async (data) => {
        try {
            setSubmitting(true);
            setError(null);
            const result = await orgRequestApi.submitRequest(data);
            // Refresh the list after submission
            await fetchRequests();
            return result;
        } catch (err) {
            setError(err.message || "Failed to submit organization request");
            throw err;
        } finally {
            setSubmitting(false);
        }
    }, [fetchRequests]);

    return {
        requests,
        loading,
        error,
        submitting,
        submitRequest,
        refetch: fetchRequests,
    };
}
