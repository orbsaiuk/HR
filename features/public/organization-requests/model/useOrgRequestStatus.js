"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { orgRequestApi } from "../api/orgRequestApi";


export function useOrgRequestStatus(requestId, options = {}) {
    const { pollInterval } = options;
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const intervalRef = useRef(null);

    const fetchStatus = useCallback(async () => {
        if (!requestId) return;

        try {
            setLoading(true);
            setError(null);
            const data = await orgRequestApi.getRequestById(requestId);
            setRequest(data);

            // Stop polling if request is no longer pending
            if (data?.status !== "pending" && intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        } catch (err) {
            setError(err.message || "Failed to fetch request status");
        } finally {
            setLoading(false);
        }
    }, [requestId]);

    useEffect(() => {
        fetchStatus();

        // Set up polling if interval is provided and request is pending
        if (pollInterval && requestId) {
            intervalRef.current = setInterval(fetchStatus, pollInterval);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [fetchStatus, pollInterval, requestId]);

    return {
        request,
        loading,
        error,
        isPending: request?.status === "pending",
        isApproved: request?.status === "approved",
        isRejected: request?.status === "rejected",
        refetch: fetchStatus,
    };
}
