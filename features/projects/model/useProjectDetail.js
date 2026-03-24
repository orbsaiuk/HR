"use client";

import { useState, useEffect } from "react";
import { projectsApi } from "../api/projectsApi";

export function useProjectDetail(id) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function fetchProject() {
      try {
        setLoading(true);
        setError(null);
        const data = await projectsApi.getById(id);
        if (!data) {
          setError("المشروع غير موجود");
        } else {
          setProject(data);
        }
      } catch (err) {
        setError(err.message || "فشل في تحميل المشروع");
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [id]);

  return { project, loading, error };
}
