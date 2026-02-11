"use client";

import { useParams } from "next/navigation";
import { JobPositionEditPage } from "@/features/job-positions";

export default function Page() {
  const params = useParams();
  return <JobPositionEditPage positionId={params.id} />;
}
