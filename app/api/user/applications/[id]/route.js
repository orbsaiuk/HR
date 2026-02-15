import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { client } from "@/sanity/client";
import { candidatePortalService } from "@/features/candidate-portal/services/candidatePortalService";

/**
 * GET /api/user/applications/[id] — Get a single application detail for the current user
 */
export async function GET(request, { params }) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Look up Sanity user by Clerk ID
    const sanityUser = await client.fetch(
      `*[_type == "user" && clerkId == $clerkId][0]{ _id }`,
      { clerkId: user.id }
    );

    if (!sanityUser) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    const application = await candidatePortalService.getUserApplicationById(
      id,
      sanityUser._id
    );

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error("GET /api/user/applications/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch application" },
      { status: 500 }
    );
  }
}
