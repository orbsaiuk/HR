import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { EditProfilePage } from "@/features/user/profile";
import { getUserByClerkId } from "@/features/shared/auth/services/userService";
import { countActiveRequestsByUser } from "@/features/public/organization-requests/repositories/orgRequestRepository";

export default async function Page() {
  const { userId } = await auth();

  if (userId) {
    try {
      const sanityUser = await getUserByClerkId(userId);
      if (sanityUser?._id) {
        const activeRequestsCount = await countActiveRequestsByUser(
          sanityUser._id,
        );
        if (activeRequestsCount > 0) {
          redirect("/");
        }
      }
    } catch (error) {
      console.error(
        "[EditProfilePage] Failed to load organization request status",
        error,
      );
    }
  }

  return <EditProfilePage />;
}
