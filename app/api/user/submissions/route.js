import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { client } from "@/sanity/client";
import { responsesQueries } from "@/sanity/queries";

export async function GET() {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get user from Sanity
        const sanityUser = await client.fetch(
            `*[_type == "user" && clerkId == $clerkId][0]`,
            { clerkId: user.id }
        );

        if (!sanityUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Get user's submissions
        const submissions = await client.fetch(
            responsesQueries.getByUserId,
            { userId: sanityUser._id }
        );

        return NextResponse.json(submissions);
    } catch (error) {
        console.error('Error fetching user submissions:', error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
