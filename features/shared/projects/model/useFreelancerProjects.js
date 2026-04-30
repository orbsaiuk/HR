"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { projectsApi } from "../api/projectsApi";

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const PROJECTS_PER_PAGE = 6;

function getDaysSince(dateString) {
  if (!dateString) return 0;
  const startedAt = new Date(dateString);
  const today = new Date();

  const startAtMidnight = new Date(
    startedAt.getFullYear(),
    startedAt.getMonth(),
    startedAt.getDate(),
  );
  const todayAtMidnight = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  return Math.max(
    0,
    Math.floor((todayAtMidnight - startAtMidnight) / DAY_IN_MS),
  );
}

export function useFreelancerProjects() {
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = await projectsApi.getFreelancerProjects();
      setAllProjects(data || []);
      setError(null);
    } catch (err) {
      setAllProjects([]);
      setError(err.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const counts = useMemo(() => {
    const active = allProjects.filter(
      (project) => project.projectStatus === "ongoing" || project.projectStatus === "open",
    ).length;
    const completed = allProjects.filter(
      (project) => project.projectStatus === "completed",
    ).length;

    return {
      all: allProjects.length,
      active,
      completed,
    };
  }, [allProjects]);

  const projects = useMemo(() => {
    if (activeTab === "active") {
      return allProjects.filter(
        (project) => project.projectStatus === "ongoing" || project.projectStatus === "open",
      );
    }

    if (activeTab === "completed") {
      return allProjects.filter(
        (project) => project.projectStatus === "completed",
      );
    }

    return allProjects;
  }, [activeTab, allProjects]);

  const totalPages = Math.max(
    1,
    Math.ceil(projects.length / PROJECTS_PER_PAGE),
  );

  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
    return projects.slice(startIndex, startIndex + PROJECTS_PER_PAGE);
  }, [projects, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  useEffect(() => {
    setCurrentPage((previous) => Math.min(previous, totalPages));
  }, [totalPages]);

  const getProgress = (startDate, totalDays) => {
    if (!startDate || !totalDays) return { percent: 0, remainingDays: 0, elapsedDays: 0 };
    const safeTotalDays = Math.max(totalDays, 1);
    const elapsedDays = Math.min(getDaysSince(startDate), safeTotalDays);
    const remainingDays = Math.max(safeTotalDays - elapsedDays, 0);
    const percent = Math.min(
      Math.round((elapsedDays / safeTotalDays) * 100),
      100,
    );

    return {
      percent,
      remainingDays,
      elapsedDays,
    };
  };

  return {
    activeTab,
    setActiveTab,
    currentPage,
    setCurrentPage,
    totalPages,
    projectsPerPage: PROJECTS_PER_PAGE,
    counts,
    projects,
    paginatedProjects,
    getProgress,
    loading,
    error,
  };
}
