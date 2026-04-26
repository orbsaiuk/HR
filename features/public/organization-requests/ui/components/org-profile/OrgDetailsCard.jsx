import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Briefcase, Users, Link2 } from "lucide-react";
import { DetailRow } from "./DetailRow";

const INDUSTRY_LABELS = {
    technology: "Technology",
    healthcare: "Healthcare",
    finance: "Finance",
    education: "Education",
    retail: "Retail",
    manufacturing: "Manufacturing",
    consulting: "Consulting",
    media: "Media & Entertainment",
    nonprofit: "Non-Profit",
    government: "Government",
    other: "Other",
};

const SIZE_LABELS = {
    "1-10": "1–10 employees",
    "11-50": "11–50 employees",
    "51-200": "51–200 employees",
    "201-500": "201–500 employees",
    "500+": "500+ employees",
};

/**
 * Card displaying organization details (industry, size, slug).
 */
export function OrgDetailsCard({ request }) {
    if (!request.orgIndustry && !request.orgSize && !request.orgSlug?.current) {
        return null;
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                    <Briefcase size={16} className="text-blue-600" />
                    Organization Details
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
                {request.orgIndustry && (
                    <DetailRow icon={Briefcase} label="Industry">
                        {INDUSTRY_LABELS[request.orgIndustry] ||
                            request.orgIndustry}
                    </DetailRow>
                )}
                {request.orgSize && (
                    <DetailRow icon={Users} label="Company Size">
                        {SIZE_LABELS[request.orgSize] || request.orgSize}
                    </DetailRow>
                )}
                {request.orgSlug?.current && (
                    <DetailRow icon={Link2} label="URL Slug">
                        {request.orgSlug.current}
                    </DetailRow>
                )}
            </CardContent>
        </Card>
    );
}
