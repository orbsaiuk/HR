import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    CalendarDays,
    Clock,
    RefreshCw,
    CheckCircle2,
    XCircle,
} from "lucide-react";

function formatDateTime(dateStr) {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

/**
 * Timeline card showing request submission, updates, and review info.
 */
export function OrgRequestTimeline({ request }) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                    <CalendarDays size={16} className="text-blue-600" />
                    Request Timeline
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Submitted */}
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                            <Clock size={14} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">
                                Request Submitted
                            </p>
                            <p className="text-xs text-gray-500">
                                {formatDateTime(request.createdAt)}
                            </p>
                        </div>
                    </div>

                    {/* Updated (if different from created) */}
                    {request.updatedAt &&
                        request.updatedAt !== request.createdAt && (
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                    <RefreshCw
                                        size={14}
                                        className="text-gray-500"
                                    />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        Last Updated
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {formatDateTime(request.updatedAt)}
                                    </p>
                                </div>
                            </div>
                        )}

                    {/* Reviewed */}
                    {request.reviewedAt && (
                        <div className="flex items-start gap-3">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${request.status === "approved"
                                        ? "bg-emerald-100"
                                        : "bg-red-100"
                                    }`}
                            >
                                {request.status === "approved" ? (
                                    <CheckCircle2
                                        size={14}
                                        className="text-emerald-600"
                                    />
                                ) : (
                                    <XCircle
                                        size={14}
                                        className="text-red-600"
                                    />
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    {request.status === "approved"
                                        ? "Approved"
                                        : "Rejected"}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {formatDateTime(request.reviewedAt)}
                                    {request.reviewedBy &&
                                        ` by ${request.reviewedBy}`}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Rejection Reason */}
                {request.status === "rejected" && request.rejectionReason && (
                    <>
                        <Separator className="my-4" />
                        <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                            <p className="text-xs font-medium text-red-800 uppercase tracking-wide mb-1">
                                Rejection Reason
                            </p>
                            <p className="text-sm text-red-700">
                                {request.rejectionReason}
                            </p>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
