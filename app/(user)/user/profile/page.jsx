import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserProfilePage } from "@/features/user-profile";
import { getUserByClerkId } from "@/features/auth/services/userService";
import { countActiveRequestsByUser } from "@/features/organization-requests/repositories/orgRequestRepository";

export default async function Page() {
    const { userId } = await auth();

    if (userId) {
        try {
            const sanityUser = await getUserByClerkId(userId);
            if (sanityUser?._id) {
                const activeRequestsCount = await countActiveRequestsByUser(sanityUser._id);
                if (activeRequestsCount > 0) {
                    redirect("/");
                }
            }
        } catch (error) {
            console.error("[UserProfilePage] Failed to load organization request status", error);
        }
    }

    return <UserProfilePage />;
}
