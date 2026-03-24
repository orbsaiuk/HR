import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  getUserByClerkId,
  setAccountType,
} from "@/features/auth/services/userService";

const VALID_ACCOUNT_TYPES = ["jobSeeker", "freelancer", "orgMember"];

export async function POST(req) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { accountType } = body;

  if (!accountType || !VALID_ACCOUNT_TYPES.includes(accountType)) {
    return NextResponse.json(
      {
        error:
          "Invalid accountType. Must be 'jobSeeker', 'freelancer', or 'orgMember'.",
      },
      { status: 400 },
    );
  }

  // Check if user already has an account type set (one-time selection)
  const existingType = user.publicMetadata?.accountType;
  if (existingType) {
    return NextResponse.json(
      { error: "Account type already set. This selection is permanent." },
      { status: 409 },
    );
  }

  // Find the Sanity user document
  const sanityUser = await getUserByClerkId(user.id);
  if (!sanityUser) {
    return NextResponse.json(
      { error: "User not found in database" },
      { status: 404 },
    );
  }

  // Guard: also check Sanity doc (belt-and-suspenders)
  if (sanityUser.accountType) {
    return NextResponse.json(
      { error: "Account type already set." },
      { status: 409 },
    );
  }

  // Set account type in Sanity
  await setAccountType(sanityUser._id, accountType);

  // Set account type in Clerk publicMetadata (preserving existing metadata)
  const clerk = await clerkClient();
  await clerk.users.updateUserMetadata(user.id, {
    publicMetadata: {
      ...user.publicMetadata,
      accountType,
    },
  });

  return NextResponse.json({ success: true, accountType });
}
