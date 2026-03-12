import { auth } from "@clerk/nextjs/server";
import {
  LandingPage,
  CompanyLandingPage,
  UserLandingPage,
} from "@/features/landing";

export default async function HomePage() {
  const { userId, orgId, sessionClaims } = await auth();
  const isTeamMember = Boolean(userId && orgId);
  const isSignedIn = Boolean(userId);
  const accountType = sessionClaims?.metadata?.accountType;
  const hasAccountType = Boolean(accountType);

  return (
    <main>
      {isTeamMember ? (
        <CompanyLandingPage />
      ) : isSignedIn && hasAccountType ? (
        <UserLandingPage />
      ) : (
        <LandingPage isTeamMember={false} isSignedIn={isSignedIn} />
      )}
    </main>
  );
}
