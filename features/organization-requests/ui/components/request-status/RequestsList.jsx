"use client";

import { FileText } from "lucide-react";
import { RequestListItem } from "./RequestListItem";

export function RequestsList({ requests }) {
    if (!requests || requests.length === 0) {
        return (
            <div className="text-center py-12">
                <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No requests yet
                </h3>
                <p className="text-sm text-gray-500">
                    You haven&apos;t submitted any organization registration requests.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {requests.map((request) => (
                <RequestListItem key={request._id} request={request} />
            ))}
        </div>
    );
}
