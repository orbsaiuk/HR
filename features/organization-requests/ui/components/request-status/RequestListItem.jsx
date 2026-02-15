"use client";

import Link from "next/link";
import { Building2, ChevronRight } from "lucide-react";
import { RequestStatusBadge } from "./RequestStatusBadge";
import Image from "next/image";


export function RequestListItem({ request }) {
    return (
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    {request.orgLogoUrl ? (
                        <Image
                            src={request.orgLogoUrl}
                            alt={request.orgName}
                            className="w-10 h-10 rounded-lg object-cover"
                        />
                    ) : (
                        <Building2 size={18} className="text-gray-400" />
                    )}
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-900">
                        {request.orgName}
                    </h3>
                    <p className="text-xs text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <RequestStatusBadge status={request.status} />
                <ChevronRight size={16} className="text-gray-400" />
            </div>
        </div>
    );
}
