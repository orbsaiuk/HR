"use client";

import { AlertTriangle } from "lucide-react";

export function RequestRejectionReason({ reason }) {
    if (!reason) return null;

    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-3">
                <AlertTriangle size={18} className="text-red-500 mt-0.5 shrink-0" />
                <div>
                    <h4 className="text-sm font-medium text-red-800">
                        Rejection Reason
                    </h4>
                    <p className="text-sm text-red-700 mt-1">{reason}</p>
                </div>
            </div>
        </div>
    );
}
