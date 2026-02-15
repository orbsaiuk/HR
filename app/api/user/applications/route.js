import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/features/auth/services/userService";
import { candidatePortalService } from "@/features/candidate-portal/services/candidatePortalService";

/**
 * GET /api/user/applications — Get all applications for the current user
 */
export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Look up Sanity user by Clerk ID
    const sanityUser = await getUserByClerkId(user.id);

    if (!sanityUser) {
      return NextResponse.json([], { status: 200 });
    }

    const applications = await candidatePortalService.getUserApplications(
      sanityUser._id,
    );

    return NextResponse.json(applications);
  } catch (error) {
    console.error("GET /api/user/applications error:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 },
    );
  }
}
