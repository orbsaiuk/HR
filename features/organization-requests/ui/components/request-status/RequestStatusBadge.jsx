"use client";

import { Badge } from "@/components/ui/badge";

const STATUS_CONFIG = {
    pending: {
        label: "Pending Review",
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    approved: {
        label: "Approved",
        className: "bg-green-100 text-green-800 border-green-200",
    },
    rejected: {
        label: "Rejected",
        className: "bg-red-100 text-red-800 border-red-200",
    },
};


export function RequestStatusBadge({ status }) {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;

    return (
        <Badge variant="outline" className={config.className}>
            {config.label}
        </Badge>
    );
}
