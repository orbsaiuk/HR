"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export function ApplySubmitted({ positionTitle, onBrowse }) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center max-w-md">
                <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
                <h2 className="text-xl font-bold text-foreground mb-2">
                    Application Submitted!
                </h2>
                <p className="text-muted-foreground mb-6">
                    Your application for <strong>{positionTitle}</strong> has been
                    received. You can track its status from your applications page.
                </p>
                <div className="flex gap-3 justify-center">
                    <Button asChild>
                        <Link href="/my-applications">View My Applications</Link>
                    </Button>
                    <Button variant="outline" onClick={onBrowse}>
                        Browse More Positions
                    </Button>
                </div>
            </div>
        </div>
    );
}
