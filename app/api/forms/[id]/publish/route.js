import { NextResponse } from "next/server";
import { publishForm } from "@/features/forms/services/formService";

export async function POST(request, { params }) {
    try {
        const { id } = await params;
        const form = await publishForm(id);
        return NextResponse.json(form);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to publish form" },
            { status: 500 },
        );
    }
}
