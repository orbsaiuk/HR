import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { client } from "@/sanity/client";

export async function PATCH() {
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

        // Get all unread submissions
        const unreadSubmissions = await client.fetch(
            `*[_type == "response" && user._ref == $userId && statusUpdated == true && statusViewed != true]`,
            { userId: sanityUser._id }
        );

        // Mark all as read
        const transaction = client.transaction();
        unreadSubmissions.forEach(submission => {
            transaction.patch(submission._id, {
                set: {
                    statusViewed: true,
                    statusViewedAt: new Date().toISOString(),
                }
            });
        });

        await transaction.commit();

        return NextResponse.json({ success: true, count: unreadSubmissions.length });
    } catch (error) {
        console.error('Error marking all as read:', error);
        return NextResponse.json(
            { error: "Failed to mark all as read" },
            { status: 500 },
        );
    }
}
