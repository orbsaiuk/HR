"use client";

import { User, MapPin, Phone, Mail } from "lucide-react";

export function ProfileSnapshotHeader({ snapshot, applicantName, applicantEmail }) {
    return (
        <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground">{applicantName}</h4>
                {snapshot.headline && (
                    <p className="text-sm text-muted-foreground">{snapshot.headline}</p>
                )}
                <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                    {applicantEmail && (
                        <span className="flex items-center gap-1">
                            <Mail size={11} />
                            {applicantEmail}
                        </span>
                    )}
                    {snapshot.phone && (
                        <span className="flex items-center gap-1">
                            <Phone size={11} />
                            {snapshot.phone}
                        </span>
                    )}
                    {snapshot.location && (
                        <span className="flex items-center gap-1">
                            <MapPin size={11} />
                            {snapshot.location}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
