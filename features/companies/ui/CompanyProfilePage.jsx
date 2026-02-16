"use client";

import { useCompanyDetail } from "../model/useCompanyDetail";
import { CompanyHeader } from "./CompanyHeader";
import { CompanySidebar } from "./CompanySidebar";
import { PositionCard } from "@/features/careers/ui/components/PositionCard";
import { Loading } from "@/shared/components/feedback/Loading";
import { Error } from "@/shared/components/feedback/Error";
import { EmptyState } from "@/shared/components/feedback/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Building2 } from "lucide-react";

export function CompanyProfilePage({ slug }) {
    const { company, loading, error } = useCompanyDetail(slug);

    if (loading) return <Loading fullPage />;
    if (error) return <Error message={error} />;
    if (!company) return <Error message="Company not found" />;

    const openPositions = company.openPositions || [];

    return (
        <div className="min-h-screen bg-gray-50">
            <CompanyHeader company={company} />

            <div className="container mx-auto px-4 py-8">
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Main content */}
                    <div className="lg:col-span-2">
                        {/* About */}
                        {company.description && (
                            <Card className="mb-8">
                                <CardContent className="pt-6">
                                    <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                                        <Building2 size={18} />
                                        About {company.name}
                                    </h2>
                                    <p className="text-muted-foreground whitespace-pre-line">
                                        {company.description}
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Open Positions */}
                        <div>
                            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                <Briefcase size={18} />
                                Open Positions
                                {openPositions.length > 0 && (
                                    <Badge variant="secondary">{openPositions.length}</Badge>
                                )}
                            </h2>

                            {openPositions.length === 0 ? (
                                <EmptyState
                                    icon={Briefcase}
                                    title="No open positions"
                                    description={`${company.name} doesn't have any open positions right now. Check back later!`}
                                />
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2">
                                    {openPositions.map((position) => (
                                        <PositionCard key={position._id} position={position} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div>
                        <CompanySidebar
                            company={company}
                            openPositionCount={openPositions.length}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
