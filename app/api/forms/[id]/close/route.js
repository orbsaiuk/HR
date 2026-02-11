import { NextResponse } from "next/server";
import { closeForm } from "@/features/forms/services/formService";

export async function POST(request, { params }) {
    try {
        const { id } = await params;
        const form = await closeForm(id);
        return NextResponse.json(form);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to close form" },
            { status: 500 },
        );
    }
}
