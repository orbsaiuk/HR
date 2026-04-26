"use client";

import { use } from "react";
import { ProjectDetailPage } from "@/features/shared/projects";

export default function Page({ params }) {
  const { id } = use(params);
  return <ProjectDetailPage projectId={id} />;
}
