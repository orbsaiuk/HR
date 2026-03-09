import { auth } from "@clerk/nextjs/server";
import { LandingPage, CompanyLandingPage } from "@/features/landing";

export default async function HomePage() {
    const { userId, orgId } = await auth();
    const isTeamMember = Boolean(userId && orgId);

    return (
        <main>
            {isTeamMember ? (
                <CompanyLandingPage />
            ) : (
                <LandingPage isTeamMember={isTeamMember} isSignedIn={Boolean(userId)} />
            )}
        </main>
    );
}
