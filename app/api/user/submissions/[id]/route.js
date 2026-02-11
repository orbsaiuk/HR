import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { client } from "@/sanity/client";
import { responsesQueries } from "@/sanity/queries";

export async function GET(request, { params }) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // Get submission and verify ownership
        const submission = await client.fetch(
            responsesQueries.getById,
            { id }
        );

        if (!submission) {
            return NextResponse.json({ error: "Submission not found" }, { status: 404 });
        }

        // Verify user owns this submission
        const sanityUser = await client.fetch(
            `*[_type == "user" && clerkId == $clerkId][0]`,
            { clerkId: user.id }
        );

        if (submission.user._id !== sanityUser._id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json(submission);
    } catch (error) {
        console.error('Error fetching submission:', error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
