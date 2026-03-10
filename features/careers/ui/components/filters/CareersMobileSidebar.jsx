"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { CareersSidebar } from "./CareersSidebar";


export function CareersMobileSidebar({
    isOpen,
    onClose,
    hasActiveFilters,
    onClearFilters,
    sidebarProps,
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="absolute top-0 right-0 h-full w-[300px] bg-white shadow-xl p-6 overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg">الفلاتر</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Clear all button */}
                {hasActiveFilters && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onClearFilters}
                        className="mb-4 w-full"
                    >
                        مسح جميع الفلاتر
                    </Button>
                )}

                {/* Sidebar filters */}
                <CareersSidebar {...sidebarProps} />
            </div>
        </div>
    );
}
