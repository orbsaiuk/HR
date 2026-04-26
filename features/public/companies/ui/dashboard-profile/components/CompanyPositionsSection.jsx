"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Clock, Users, ArrowLeft, Plus } from "lucide-react";

const TYPE_LABELS = {
    "full-time": "دوام كامل",
    "part-time": "دوام جزئي",
    contract: "عقد",
    internship: "تدريب",
    remote: "عن بعد",
};

/**
 * Dashboard-specific available jobs section.
 * Shows a summary of open positions with links to manage them.
 */
export function CompanyPositionsSection({ positions = [] }) {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl border p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-foreground">الوظائف المتاحة</h2>
                    {positions.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                            {positions.length}
                        </Badge>
                    )}
                </div>
                        <Link href="/company/positions" className="block text-center">
                            <Button variant="outline" size="sm" className="text-[#462EA8] font-bold hover:bg-[#462EA8] hover:text-white">
                                عرض جميع الوظائف <ArrowLeft size={16} />
                            </Button>
                        </Link>
            </div>

            {positions.length > 0 ? (
                <div className="space-y-3">
                    {positions.slice(0, 5).map((position) => (
                        <Link
                            key={position._id}
                            href={`/company/positions/${position._id}`}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors group"
                        >
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                                    {position.title}
                                </h3>
                                <div className="flex flex-wrap items-center gap-3 mt-1">
                                    {position.department && (
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Briefcase size={12} />
                                            {position.department}
                                        </span>
                                    )}
                                    {position.location && (
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <MapPin size={12} />
                                            {position.location}
                                        </span>
                                    )}
                                    {position.type && (
                                        <Badge variant="outline" className="text-xs py-0">
                                            {TYPE_LABELS[position.type] || position.type}
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0 mr-4">
                                {position.applicationCount > 0 && (
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Users size={12} />
                                        {position.applicationCount} متقدم
                                    </span>
                                )}
                                {position.deadline && (
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Clock size={12} />
                                        {new Date(position.deadline).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </span>
                                )}
                                <ArrowLeft size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <Briefcase size={40} className="mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground text-sm mb-3">
                        لا توجد وظائف مفتوحة حالياً.
                    </p>
                    <Link href="/company/positions/create">
                        <Button variant="outline" size="sm">
                            <Plus size={14} className="ml-1.5" />
                            إضافة وظيفة جديدة
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
