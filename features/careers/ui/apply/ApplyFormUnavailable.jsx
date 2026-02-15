"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export function ApplyFormUnavailable({ positionId }) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <AlertCircle className="mx-auto text-amber-500 mb-4" size={48} />
                <h2 className="text-xl font-bold text-foreground mb-2">
                    Application Form Unavailable
                </h2>
                <p className="text-muted-foreground mb-4">
                    The application form for this position is not yet available.
                </p>
                <Button asChild>
                    <Link href={`/careers/${positionId}`}>Back to Position</Link>
                </Button>
            </div>
        </div>
    );
}
