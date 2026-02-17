import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/features/auth/services/userService";
import { userProfileService } from "@/features/user-profile/services";

/**
 * POST /api/user/profile/resume — Upload a resume file for the current user
 *
 * Expects multipart/form-data with a "resume" file field.
 */
export async function POST(request) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const sanityUser = await getUserByClerkId(user.id);
        if (!sanityUser) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 },
            );
        }

        const formData = await request.formData();
        const file = formData.get("file") || formData.get("resume");

        if (!file) {
            return NextResponse.json(
                { error: "No resume file provided" },
                { status: 400 },
            );
        }

        // Validate file type
        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];

        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Invalid file type. Only PDF, DOC, and DOCX are allowed." },
                { status: 400 },
            );
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: "File too large. Maximum size is 10MB." },
                { status: 400 },
            );
        }

        // Convert to buffer for Sanity upload
        const buffer = Buffer.from(await file.arrayBuffer());

        const updated = await userProfileService.uploadResume(
            sanityUser._id,
            buffer,
            file.name,
        );

        return NextResponse.json(updated);
    } catch (error) {
        console.error("POST /api/user/profile/resume error:", error);
        return NextResponse.json(
            { error: "Failed to upload resume" },
            { status: 500 },
        );
    }
}

/**
 * DELETE /api/user/profile/resume — Remove the uploaded resume for the current user
 */
export async function DELETE() {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const sanityUser = await getUserByClerkId(user.id);
        if (!sanityUser) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 },
            );
        }

        const updated = await userProfileService.removeResume(sanityUser._id);
        return NextResponse.json(updated);
    } catch (error) {
        console.error("DELETE /api/user/profile/resume error:", error);
        return NextResponse.json(
            { error: "Failed to remove resume" },
            { status: 500 },
        );
    }
}
