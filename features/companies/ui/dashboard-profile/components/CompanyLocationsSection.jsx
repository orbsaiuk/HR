"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SquarePen, SquarePlus } from "lucide-react";


/**
 * Sidebar section listing office locations with flags and a main office badge.
 */
export function CompanyLocationsSection({ location, officeLocations = [], onEdit }) {
    // Combine main location + officeLocations, deduplicating the main one
    const mainLocation = location;
    const otherLocations = officeLocations.filter(
        (loc) => loc?.toLowerCase()?.trim() !== mainLocation?.toLowerCase()?.trim()
    );

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl border p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground">مواقع المكاتب</h2>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#462EA8] hover:bg-[#462EA8]/10 hover:text-[#462EA8]"
                        onClick={onEdit}
                    >
                        {(mainLocation || otherLocations.length > 0) ? <SquarePen size={18} /> : <SquarePlus size={18} />}
                    </Button>
                </div>
            </div>

            <div className="space-y-3">
                {/* Main Office */}
                {mainLocation && (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-foreground">{mainLocation}</span>
                        </div>
                        <Badge variant="outline" className="text-xs text-primary border-primary/30">
                            المقر الرئيسي
                        </Badge>
                    </div>
                )}

                {/* Other Locations */}
                {otherLocations.map((loc, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                        <span className="text-xl">{getFlag(loc)}</span>
                        <span className="text-sm font-medium text-foreground">{loc}</span>
                    </div>
                ))}

                {!mainLocation && otherLocations.length === 0 && (
                    <p className="text-muted-foreground/50 italic text-sm">
                        لم يتم إضافة مواقع مكاتب بعد.
                    </p>
                )}
            </div>
        </div>
    );
}
