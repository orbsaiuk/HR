import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/features/shared/auth/services/userService";
import { getFreelancerDashboardStats } from "@/features/freelancer/dashboard/services/dashboardService";

export async function GET(request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sanityUser = await getUserByClerkId(user.id);
    if (!sanityUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const stats = await getFreelancerDashboardStats(sanityUser._id);

    return NextResponse.json(stats);
  } catch (error) {
    console.error("GET /api/freelancer/dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
