"use client";

import { useParams } from "next/navigation";
import { TeamMemberProfilePage } from "@/features/team-members";

export default function Page() {
  const params = useParams();
  return <TeamMemberProfilePage teamMemberId={params.id} />;
}
