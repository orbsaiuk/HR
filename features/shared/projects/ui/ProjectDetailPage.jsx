"use client";

import { useEffect } from "react";
import { useProjectDetail } from "../model/useProjectDetail";
import { Error } from "@/shared/components/feedback/Error";
import { ProjectDetailSkeleton } from "./ProjectDetailSkeleton";
import {
  ProjectDetailHeader,
  ProjectDetailContent,
  ProjectDetailSidebar,
} from "./project-detail";

export function ProjectDetailPage({ projectId }) {
  const { project, loading, error } = useProjectDetail(projectId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [projectId]);

  if (loading) return <ProjectDetailSkeleton />;
  if (error) return <Error message={error} />;
  if (!project) return <Error message="المشروع غير موجود" />;

  return (
    <div className="min-h-screen bg-gray-50">
      <ProjectDetailHeader project={project} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <ProjectDetailContent project={project} />

          <ProjectDetailSidebar project={project} projectId={projectId} />
        </div>
      </div>
    </div>
  );
}
