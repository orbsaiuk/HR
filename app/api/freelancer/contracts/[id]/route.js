import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

import { getUserByClerkId } from "@/features/shared/auth/services/userService";
import { freelancerContractService } from "@/features/freelancer/contracts/services/freelancerContractService";

function ensureFreelancer(sanityUser) {
  return sanityUser?.accountType === "freelancer";
}

/**
 * GET /api/freelancer/contracts/[id]
 * Fetch a single contract by ID for the authenticated freelancer.
 */
export async function GET(request, { params }) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sanityUser = await getUserByClerkId(clerkUser.id);

    if (!sanityUser || !ensureFreelancer(sanityUser)) {
      return NextResponse.json({ error: "Freelancer access only" }, { status: 403 });
    }

    const { id } = await params;
    const contract = await freelancerContractService.getContractById(id, clerkUser.id);

    if (!contract) {
      return NextResponse.json({ error: "Contract not found" }, { status: 404 });
    }

    return NextResponse.json(contract);
  } catch (error) {
    console.error("GET /api/freelancer/contracts/[id] error:", error?.message, error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch contract" },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/freelancer/contracts/[id]
 * Update the freelancer-facing status of a contract.
 */
export async function PATCH(request, { params }) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sanityUser = await getUserByClerkId(clerkUser.id);

    if (!sanityUser || !ensureFreelancer(sanityUser)) {
      return NextResponse.json({ error: "Freelancer access only" }, { status: 403 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "status is required" },
        { status: 400 },
      );
    }

    const { id } = await params;
    const updated = await freelancerContractService.updateContractFreelancerStatus(
      id,
      clerkUser.id,
      status,
    );

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/freelancer/contracts/[id] error:", error?.message, error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error?.message || "Failed to update contract status" },
      { status },
    );
  }
}
