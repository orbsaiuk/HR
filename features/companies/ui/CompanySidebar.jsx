"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

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

export function CompanySidebar({ company, openPositionCount }) {
    return (
        <Card>
            <CardContent className="pt-6">
                <h3 className="font-semibold text-foreground mb-4">Quick Info</h3>
                <dl className="space-y-3 text-sm">
                    {company.industry && (
                        <div>
                            <dt className="text-muted-foreground">Industry</dt>
                            <dd className="font-medium">
                                {INDUSTRY_LABELS[company.industry] || company.industry}
                            </dd>
                        </div>
                    )}
                    {company.size && (
                        <div>
                            <dt className="text-muted-foreground">Company Size</dt>
                            <dd className="font-medium">{company.size} employees</dd>
                        </div>
                    )}
                    {company.location && (
                        <div>
                            <dt className="text-muted-foreground">Headquarters</dt>
                            <dd className="font-medium">{company.location}</dd>
                        </div>
                    )}
                    <div>
                        <dt className="text-muted-foreground">Open Positions</dt>
                        <dd className="font-medium">{openPositionCount}</dd>
                    </div>
                </dl>

                {company.website && (
                    <Button asChild variant="outline" className="w-full mt-6">
                        <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Globe size={14} className="mr-2" />
                            Visit Website
                        </a>
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
