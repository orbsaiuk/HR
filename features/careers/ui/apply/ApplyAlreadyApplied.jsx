"use client";

import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

export function ApplyAlreadyApplied({ onBrowse }) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <Info className="mx-auto text-blue-500 mb-4" size={48} />
                <h2 className="text-xl font-bold text-foreground mb-2">
                    Already Applied
                </h2>
                <p className="text-muted-foreground mb-4">
                    You have already submitted an application for this position.
                </p>
                <Button onClick={onBrowse}>Browse Other Positions</Button>
            </div>
        </div>
    );
}
