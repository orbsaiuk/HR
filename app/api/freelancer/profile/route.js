import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

import { getUserByClerkId } from "@/features/shared/auth/services/userService";
import { freelancerProfileService } from "@/features/freelancer/profile/services";

function ensureFreelancer(sanityUser) {
  return sanityUser?.accountType === "freelancer";
}

export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sanityUser = await getUserByClerkId(user.id);

    if (!sanityUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!ensureFreelancer(sanityUser)) {
      return NextResponse.json(
        {
          error: "Freelancer profile is only available for freelancer accounts",
        },
        { status: 403 },
      );
    }

    const profile = await freelancerProfileService.getOrCreateFreelancerProfile(
      user.id,
    );

    if (!profile) {
      return NextResponse.json(
        { error: "Freelancer profile not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("GET /api/freelancer/profile error:", error?.message, error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch freelancer profile" },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sanityUser = await getUserByClerkId(user.id);

    if (!sanityUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!ensureFreelancer(sanityUser)) {
      return NextResponse.json(
        {
          error: "Freelancer profile is only available for freelancer accounts",
        },
        { status: 403 },
      );
    }

    const data = await request.json();
    const updated = await freelancerProfileService.updateFreelancerProfile(
      user.id,
      data,
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Freelancer profile not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/freelancer/profile error:", error?.message, error);
    return NextResponse.json(
      { error: error?.message || "Failed to update freelancer profile" },
      { status: 500 },
    );
  }
}
