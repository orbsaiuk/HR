"use client";

import Link from "next/link";
import { Building2, ChevronLeft } from "lucide-react";
import { RequestStatusBadge } from "./RequestStatusBadge";
import Image from "next/image";


export function RequestListItem({ request }) {
    return (
        <div className="group flex items-center justify-between p-5 border rounded-xl hover:shadow-md hover:border-primary/30 transition-all duration-300 bg-background cursor-pointer">
            <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center ring-2 ring-muted group-hover:ring-primary/20 transition-all">
                    {request.orgLogoUrl ? (
                        <Image
                            src={request.orgLogoUrl}
                            alt={request.orgName}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-lg object-cover"
                        />
                    ) : (
                        <Building2 size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    )}
                </div>
                <div className="flex-1">
                    <h3 className="text-sm font-semibold mb-1 group-hover:text-primary transition-colors">
                        {request.orgName}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        {new Date(request.createdAt).toLocaleDateString("ar-SA", {
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                        })}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <RequestStatusBadge status={request.status} />
                <ChevronLeft size={18} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-[-2px] transition-all" />
            </div>
        </div>
    );
}
