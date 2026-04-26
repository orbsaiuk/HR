"use client";

import { useEffect, useMemo, useState } from "react";

import { freelancerProjectsMock } from "./freelancerProjectsMock";

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const PROJECTS_PER_PAGE = 6;

function getDaysSince(dateString) {
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

  const counts = useMemo(() => {
    const active = freelancerProjectsMock.filter(
      (project) => project.status === "active",
    ).length;
    const completed = freelancerProjectsMock.filter(
      (project) => project.status === "completed",
    ).length;

    return {
      all: freelancerProjectsMock.length,
      active,
      completed,
    };
  }, []);

  const projects = useMemo(() => {
    if (activeTab === "active") {
      return freelancerProjectsMock.filter(
        (project) => project.status === "active",
      );
    }

    if (activeTab === "completed") {
      return freelancerProjectsMock.filter(
        (project) => project.status === "completed",
      );
    }

    return freelancerProjectsMock;
  }, [activeTab]);

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
  };
}
