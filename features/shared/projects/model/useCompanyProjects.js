"use client";

import { useState, useEffect, useCallback } from "react";
import { projectsApi } from "../api/projectsApi";

export function useCompanyProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = await projectsApi.getCompanyProjects();
      setProjects(data || []);
      setError(null);
    } catch (err) {
      setProjects([]);
      setError(err.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, []);

  const createProject = async (payload) => {
    const newProject = await projectsApi.createCompanyProject(payload);
    setProjects((prev) => [newProject, ...prev]);
    return newProject;
  };

  const updateProject = async (id, payload) => {
    const updated = await projectsApi.updateCompanyProject(id, payload);
    setProjects((prev) =>
      prev.map((p) => (p._id === id || p.id === id ? { ...p, ...updated } : p))
    );
    return updated;
  };

  const deleteProject = async (id) => {
    await projectsApi.deleteCompanyProject(id);
    setProjects((prev) => prev.filter((p) => p._id !== id && p.id !== id));
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    setProjects,
    loading,
    error,
    refetch: fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
}
