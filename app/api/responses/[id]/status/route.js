import { NextResponse } from "next/server";
import { client } from "@/sanity/client";

export async function PATCH(request, { params }) {
    try {
        const { id } = await params;
        const { status, statusNote, rejectionReason } = await request.json();

        const updateData = {
            status,
            statusNote: statusNote || '',
            updatedAt: new Date().toISOString(),
            // Set notification flags when status is updated
            statusUpdated: true,
            statusViewed: false,
        };

        // Add rejection reason if status is rejected
        if (status === 'rejected' && rejectionReason) {
            updateData.rejectionReason = rejectionReason;
        }

        const response = await client
            .patch(id)
            .set(updateData)
            .commit();

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error updating response status:', error);
        return NextResponse.json(
            { error: "Failed to update status" },
            { status: 500 },
        );
    }
}
