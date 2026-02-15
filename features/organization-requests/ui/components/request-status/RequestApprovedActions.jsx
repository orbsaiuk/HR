"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";

/**
 * Actions shown after an organization request is approved.
 * Provides a link to the dashboard.
 */
export function RequestApprovedActions() {
    return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-3">
                <CheckCircle size={18} className="text-green-500 mt-0.5 shrink-0" />
                <div>
                    <h4 className="text-sm font-medium text-green-800">
                        Your organization has been approved!
                    </h4>
                    <p className="text-sm text-green-700 mt-1">
                        You can now access your organization dashboard to start
                        managing your team, job positions, and more.
                    </p>
                    <Link href="/dashboard">
                        <Button size="sm" className="mt-3">
                            Go to Dashboard
                            <ArrowRight size={14} className="ml-2" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
