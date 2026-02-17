import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/features/auth/services/userService";
import { careerService } from "@/features/careers/services/careerService";
import { userProfileService } from "@/features/user-profile/services/userProfileService";

/**
 * Build a profileSnapshot object from a full user profile.
 * This captures the applicant's profile at the time of application.
 */
function buildProfileSnapshot(profile) {
  if (!profile) return null;
  return {
    headline: profile.headline || "",
    bio: profile.bio || "",
    phone: profile.phone || "",
    location: profile.location || "",
    resumeUrl: profile.uploadedResumeUrl || profile.resumeUrl || "",
    skills: profile.skills || [],
    linkedinUrl: profile.linkedinUrl || "",
    portfolioUrl: profile.portfolioUrl || "",
    workExperience: (profile.workExperience || []).map((w) => ({
      company: w.company || "",
      title: w.title || "",
      startDate: w.startDate || "",
      endDate: w.endDate || "",
      isCurrent: w.isCurrent || false,
      description: w.description || "",
    })),
    education: (profile.education || []).map((e) => ({
      institution: e.institution || "",
      degree: e.degree || "",
      fieldOfStudy: e.fieldOfStudy || "",
      startDate: e.startDate || "",
      endDate: e.endDate || "",
    })),
  };
}

/**
 * POST /api/careers/[id]/apply — Submit an application (requires auth)
 */
export async function POST(request, { params }) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: "You must be signed in to apply" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { answers, formId } = body;

    // Look up Sanity user by Clerk ID
    const sanityUser = await getUserByClerkId(user.id);

    if (!sanityUser) {
      return NextResponse.json(
        { error: "User profile not found. Please sign in again." },
        { status: 400 },
      );
    }

    // Fetch the position to check applicationMethod
    const position = await careerService.getPublicPositionById(id);
    if (!position) {
      return NextResponse.json(
        { error: "Position not found or no longer open" },
        { status: 404 },
      );
    }

    const applicationMethod = position.applicationMethod || "form";

    // Build profile snapshot if needed (profile or both)
    let profileSnapshot = null;
    if (applicationMethod === "profile" || applicationMethod === "both") {
      const profile = await userProfileService.getProfileById(sanityUser._id);
      if (!profile) {
        return NextResponse.json(
          { error: "User profile not found. Please complete your profile first." },
          { status: 400 },
        );
      }

      // Validate profile completeness for profile-based applications
      const hasMinimumProfile =
        profile.name && (profile.headline || profile.bio || (profile.skills && profile.skills.length > 0));
      if (!hasMinimumProfile) {
        return NextResponse.json(
          { error: "Please complete your profile before applying. At minimum, add a headline, bio, or skills." },
          { status: 400 },
        );
      }

      profileSnapshot = buildProfileSnapshot(profile);
    }

    // Fetch the form to get field metadata for structuring answers
    let processedAnswers = [];
    if (
      (applicationMethod === "form" || applicationMethod === "both") &&
      formId &&
      answers &&
      typeof answers === "object"
    ) {
      const { getFormFields } =
        await import("@/features/forms/services/formService");
      const form = await getFormFields(formId);

      processedAnswers = Object.entries(answers).map(([key, value]) => {
        const field = form?.fields?.find((f) => f._key === key);
        const fieldType = field?.type || "text";
        const fieldLabel = field?.label || "Untitled Field";

        let processedValue = value;
        if (typeof value === "object" && value !== null) {
          processedValue = JSON.stringify(value);
        } else {
          processedValue = String(value ?? "");
        }

        return {
          _key: key,
          fieldId: key,
          fieldType,
          fieldLabel,
          value: processedValue,
        };
      });
    }

    const application = await careerService.submitApplication({
      jobPositionId: id,
      applicantId: sanityUser._id,
      formId: applicationMethod !== "profile" ? formId : undefined,
      answers: processedAnswers,
      profileSnapshot,
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("POST /api/careers/[id]/apply error:", error);

    if (error.message?.includes("already applied")) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 },
    );
  }
}

/**
 * GET /api/careers/[id]/apply — Check if the current user already applied
 */
export async function GET(request, { params }) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ alreadyApplied: false }, { status: 200 });
    }

    const { id } = await params;

    const sanityUser = await getUserByClerkId(user.id);

    if (!sanityUser) {
      return NextResponse.json({ alreadyApplied: false }, { status: 200 });
    }

    const { checkApplicationExists } =
      await import("@/features/careers/services/careersService");
    const alreadyApplied = await checkApplicationExists(id, sanityUser._id);

    return NextResponse.json({ alreadyApplied: Boolean(alreadyApplied) });
  } catch (error) {
    console.error("GET /api/careers/[id]/apply error:", error);
    return NextResponse.json(
      { error: "Failed to check application status" },
      { status: 500 },
    );
  }
}
