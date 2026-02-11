"use client";

import { useParams } from "next/navigation";
import { JobPositionDetailPage } from "@/features/job-positions";

export default function Page() {
  const params = useParams();
  return <JobPositionDetailPage positionId={params.id} />;
}
