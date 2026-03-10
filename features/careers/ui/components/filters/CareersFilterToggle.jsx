"use client";

import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

export function CareersFilterToggle({ isOpen, onToggle, hasActiveFilters }) {
    return (
        <div className="lg:hidden mb-4">
            <Button variant="outline" onClick={onToggle} className="gap-2">
                <SlidersHorizontal size={16} />
                الفلاتر
                {hasActiveFilters && (
                    <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        !
                    </span>
                )}
            </Button>
        </div>
    );
}
