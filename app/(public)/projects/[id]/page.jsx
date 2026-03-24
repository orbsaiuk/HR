"use client";

import { use } from "react";
import { ProjectDetailPage } from "@/features/projects";

export default function Page({ params }) {
  const { id } = use(params);
  return <ProjectDetailPage projectId={id} />;
}
