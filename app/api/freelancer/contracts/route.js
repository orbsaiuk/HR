import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

import { getUserByClerkId } from "@/features/shared/auth/services/userService";
import { freelancerContractService } from "@/features/freelancer/contracts/services/freelancerContractService";

function ensureFreelancer(sanityUser) {
  return sanityUser?.accountType === "freelancer";
}

export async function GET() {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sanityUser = await getUserByClerkId(clerkUser.id);

    if (!sanityUser || !ensureFreelancer(sanityUser)) {
      return NextResponse.json(
        { error: "Freelancer access only" },
        { status: 403 },
      );
    }

    const contracts = await freelancerContractService.getContractsByFreelancer(
      clerkUser.id,
    );

    return NextResponse.json(contracts);
  } catch (error) {
    console.error("GET /api/freelancer/contracts error:", error?.message, error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch contracts" },
      { status: 500 },
    );
  }
}

