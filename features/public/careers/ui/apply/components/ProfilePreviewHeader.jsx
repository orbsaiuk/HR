"use client";

import Image from "next/image";
import { User, MapPin } from "lucide-react";

export function ProfilePreviewHeader({ profile }) {
    if (!profile) return null;

    return (
        <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden relative">
                {profile.avatar ? (
                    <Image
                        src={profile.avatar}
                        alt={profile.name || "Profile avatar"}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <User className="h-6 w-6 text-primary" />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">
                    {profile.name}
                </h3>
                {profile.headline && (
                    <p className="text-sm text-muted-foreground">{profile.headline}</p>
                )}
                {profile.location && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin size={12} />
                        {profile.location}
                    </p>
                )}
            </div>
        </div>
    );
}
