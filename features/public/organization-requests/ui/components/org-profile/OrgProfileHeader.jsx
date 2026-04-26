import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Globe, Briefcase, Users } from "lucide-react";

/**
 * Organization header card with gradient banner, logo, name, slug, and description.
 */
export function OrgProfileHeader({ request }) {
    const hasMeta = request.orgIndustry || request.orgSize || request.orgWebsite;

    return (
        <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 h-28" />
            <CardContent className="relative pt-0 pb-6 px-6">
                <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-14">
                    {request.orgLogoUrl ? (
                        <div className="w-24 h-24 rounded-2xl border-4 border-white bg-white shadow-md overflow-hidden shrink-0">
                            <Image
                                src={request.orgLogoUrl}
                                alt={request.orgName}
                                width={96}
                                height={96}
                                className="w-full h-full object-contain"
                            />
                        </div>
                    ) : (
                        <div className="w-24 h-24 rounded-2xl border-4 border-white bg-gray-100 shadow-md flex items-center justify-center shrink-0">
                            <Building2 size={36} className="text-gray-400" />
                        </div>
                    )}
                    <div className="pb-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3 ">
                            <h2 className="text-2xl font-bold text-white truncate">
                                {request.orgName}
                            </h2>
                            <Badge variant="secondary" className="capitalize">
                                {request.status}
                            </Badge>
                        </div>
                        {hasMeta && (
                            <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-600">
                                {request.orgIndustry && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1">
                                        <Briefcase size={12} />
                                        {request.orgIndustry}
                                    </span>
                                )}
                                {request.orgSize && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1">
                                        <Users size={12} />
                                        {request.orgSize}
                                    </span>
                                )}
                                {request.orgWebsite && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1">
                                        <Globe size={12} />
                                        {request.orgWebsite.replace(/^https?:\/\//, "")}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {request.orgDescription && (
                    <p className="mt-5 text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                        {request.orgDescription}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
