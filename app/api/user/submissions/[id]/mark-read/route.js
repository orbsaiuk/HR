import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { client } from "@/sanity/client";

export async function PATCH(request, { params }) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // Mark submission as viewed
        const response = await client
            .patch(id)
            .set({
                statusViewed: true,
                statusViewedAt: new Date().toISOString(),
            })
            .commit();

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error marking submission as read:', error);
        return NextResponse.json(
            { error: "Failed to mark as read" },
            { status: 500 },
        );
    }
}
