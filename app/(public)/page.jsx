import { auth } from "@clerk/nextjs/server";
import {
  LandingPage,
  CompanyLandingPage,
  UserLandingPage,
  FreelancerLandingPage,
} from "@/features/public/landing";
import { getUserByClerkId } from "@/features/shared/auth/services/userService";
import { countActiveRequestsByUser } from "@/features/public/organization-requests/repositories/orgRequestRepository";

export default async function HomePage() {
  const { userId, orgId, sessionClaims } = await auth();
  const isTeamMember = Boolean(userId && orgId);
  const isSignedIn = Boolean(userId);
  const accountType = sessionClaims?.metadata?.accountType;
  const hasAccountType = Boolean(accountType);
  let hasActiveOrgRequest = false;

  if (isSignedIn && !isTeamMember) {
    try {
      const sanityUser = await getUserByClerkId(userId);
      if (sanityUser?._id) {
        const activeRequestsCount = await countActiveRequestsByUser(
          sanityUser._id,
        );
        hasActiveOrgRequest = activeRequestsCount > 0;
      }
    } catch (error) {
      console.error(
        "[HomePage] Failed to load organization request status",
        error,
      );
    }
  }

  return (
    <main>
      {isTeamMember ? (
        <CompanyLandingPage />
      ) : isSignedIn && hasAccountType && !hasActiveOrgRequest ? (
        accountType === "freelancer" ? (
          <FreelancerLandingPage />
        ) : (
          <UserLandingPage />
        )
      ) : (
        <LandingPage isTeamMember={false} isSignedIn={isSignedIn} />
      )}
    </main>
  );
}
