import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

import { getUserByClerkId } from "@/features/shared/auth/services/userService";
import { freelancerProfileService } from "@/features/freelancer/profile/services";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export async function POST(request) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sanityUser = await getUserByClerkId(user.id);

    if (!sanityUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (sanityUser.accountType !== "freelancer") {
      return NextResponse.json(
        {
          error:
            "Portfolio image upload is only available for freelancer accounts",
        },
        { status: 403 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") || formData.get("image");

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid image type. Allowed: JPG, PNG, WEBP, GIF." },
        { status: 400 },
      );
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: "Image too large. Maximum size is 5MB." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploaded = await freelancerProfileService.uploadPortfolioImage(
      buffer,
      file.name,
    );

    return NextResponse.json(uploaded);
  } catch (error) {
    console.error("POST /api/freelancer/profile/portfolio-image error:", error);
    return NextResponse.json(
      { error: "Failed to upload portfolio image" },
      { status: 500 },
    );
  }
}
