import { ApplicationDetailPage } from "@/features/applications";

export default async function Page({ params }) {
  const { id, appId } = await params;
  return <ApplicationDetailPage applicationId={appId} positionId={id} />;
}
