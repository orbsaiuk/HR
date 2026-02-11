import { use } from "react";
import { PositionApplicationsPage } from "@/features/applications";

export default function PositionApplicationsRoute({ params }) {
  const { id } = use(params);
  return <PositionApplicationsPage positionId={id} />;
}
