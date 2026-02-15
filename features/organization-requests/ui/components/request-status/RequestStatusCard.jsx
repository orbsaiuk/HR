"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock, Building2 } from "lucide-react";
import { RequestStatusBadge } from "./RequestStatusBadge";
import { RequestRejectionReason } from "./RequestRejectionReason";
import { RequestApprovedActions } from "./RequestApprovedActions";

export function RequestStatusCard({ request }) {
    if (!request) return null;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Building2 size={18} />
                        {request.orgName}
                    </CardTitle>
                    <RequestStatusBadge status={request.status} />
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {request.orgIndustry && (
                        <div className="text-sm text-gray-600">
                            <span className="font-medium">Industry:</span>{" "}
                            {request.orgIndustry}
                        </div>
                    )}
                    {request.orgSize && (
                        <div className="text-sm text-gray-600">
                            <span className="font-medium">Size:</span>{" "}
                            {request.orgSize}
                        </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock size={14} />
                        Submitted{" "}
                        {new Date(request.createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </div>

                    {request.reviewedAt && (
                        <div className="text-sm text-gray-500">
                            Reviewed{" "}
                            {new Date(request.reviewedAt).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                            {request.reviewedBy && ` by ${request.reviewedBy}`}
                        </div>
                    )}

                    {request.status === "rejected" && (
                        <RequestRejectionReason reason={request.rejectionReason} />
                    )}

                    {request.status === "approved" && <RequestApprovedActions />}

                    {request.status === "pending" && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                            <p className="text-sm text-yellow-800">
                                Your request is being reviewed by a platform administrator.
                                You will be notified once a decision is made.
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
