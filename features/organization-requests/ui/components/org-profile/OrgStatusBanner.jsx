import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    CheckCircle2,
    XCircle,
    AlertCircle,
    ExternalLink,
} from "lucide-react";

const STATUS_CONFIG = {
    pending: {
        bg: "bg-amber-50",
        border: "border-amber-200",
        text: "text-amber-800",
        icon: AlertCircle,
        iconColor: "text-amber-500",
        title: "Request Under Review",
        message:
            "Your organization request is being reviewed by a platform administrator. You'll be notified once a decision is made.",
    },
    approved: {
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        text: "text-emerald-800",
        icon: CheckCircle2,
        iconColor: "text-emerald-500",
        title: "Organization Approved!",
        message:
            "Your organization has been approved. You can now access the dashboard to manage your organization.",
    },
    rejected: {
        bg: "bg-red-50",
        border: "border-red-200",
        text: "text-red-800",
        icon: XCircle,
        iconColor: "text-red-500",
        title: "Request Rejected",
    },
};

/**
 * Color-coded status banner for the org request.
 */
export function OrgStatusBanner({ request }) {
    const config = STATUS_CONFIG[request.status] || STATUS_CONFIG.pending;
    const StatusIcon = config.icon;
    const message =
        request.status === "rejected"
            ? request.rejectionReason || "Your request was not approved."
            : config.message;

    return (
        <div
            className={`${config.bg} ${config.border} border rounded-xl p-5 flex items-start gap-4`}
        >
            <StatusIcon
                size={24}
                className={`${config.iconColor} shrink-0 mt-0.5`}
            />
            <div>
                <h3 className={`font-semibold ${config.text}`}>
                    {config.title}
                </h3>
                <p className={`text-sm ${config.text} mt-1 opacity-90`}>
                    {message}
                </p>
                {request.status === "approved" && (
                    <Link href="/dashboard" className="inline-block mt-3">
                        <Button size="sm" variant="outline">
                            Go to Dashboard
                            <ExternalLink size={14} className="ml-2" />
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );
}
