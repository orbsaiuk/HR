"use client";

import { useState, useEffect, useCallback } from "react";
import { rolesApi } from "../api/rolesApi";

export function useRoles() {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRoles = useCallback(async () => {
        try {
            setLoading(true);
            const data = await rolesApi.getAll();
            setRoles(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    const createRole = useCallback(async (roleData) => {
        const newRole = await rolesApi.create(roleData);
        setRoles((prev) => [...prev, newRole]);
        return newRole;
    }, []);

    const updateRole = useCallback(async (key, updates) => {
        const updated = await rolesApi.update(key, updates);
        setRoles((prev) =>
            prev.map((r) => (r._key === key ? { ...r, ...updates } : r))
        );
        return updated;
    }, []);

    const deleteRole = useCallback(async (key) => {
        await rolesApi.delete(key);
        setRoles((prev) => prev.filter((r) => r._key !== key));
    }, []);

    return {
        roles,
        loading,
        error,
        refetch: fetchRoles,
        createRole,
        updateRole,
        deleteRole,
    };
}
