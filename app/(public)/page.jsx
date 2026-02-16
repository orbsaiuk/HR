import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { LandingPage } from "@/features/landing";

export default async function HomePage() {
    const { userId, orgId } = await auth();

    // If user is signed in and has an active org, redirect to dashboard
    if (userId && orgId) {
        redirect("/dashboard");
    }

    return (
        <main>
            <LandingPage />
        </main>
    );
}
