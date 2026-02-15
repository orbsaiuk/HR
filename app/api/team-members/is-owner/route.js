import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";

export async function GET() {
  try {
    const { orgRole } = await resolveOrgContext();
    // In the multi-tenant model, "owner" maps to org:admin role
    return NextResponse.json({ isOwner: orgRole === "org:admin" });
  } catch (error) {
    console.error("Error checking owner status:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to check owner status" },
      { status },
    );
  }
}
