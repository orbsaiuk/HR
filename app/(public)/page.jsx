import { auth } from "@clerk/nextjs/server";
import { LandingPage } from "@/features/landing";

export default async function HomePage() {
    const { userId, orgId } = await auth();

    return (
        <main>
            <LandingPage isTeamMember={Boolean(userId && orgId)} isSignedIn={Boolean(userId)} />
        </main>
    );
}
