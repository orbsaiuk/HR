import { NextResponse } from "next/server";
import { getPublicCompanyBySlug } from "@/features/organizations/services/organizationService";

/**
 * GET /api/companies/:slug — Get a single company's public profile with open positions
 */
export async function GET(request, { params }) {
    try {
        const { slug } = await params;
        const company = await getPublicCompanyBySlug(slug);

        if (!company) {
            return NextResponse.json(
                { error: "Company not found" },
                { status: 404 },
            );
        }

        return NextResponse.json(company);
    } catch (error) {
        console.error("GET /api/companies/[slug] error:", error);
        return NextResponse.json(
            { error: "Failed to fetch company" },
            { status: 500 },
        );
    }
}
