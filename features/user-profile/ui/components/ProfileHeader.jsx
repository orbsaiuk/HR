"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Mail, Phone, Calendar } from "lucide-react";

/**
 * Displays avatar, name, headline, location, and contact info.
 * Uses shadcn Avatar component with a subtle ring for polish.
 */
export function ProfileHeader({ profile, compact = false }) {
    if (!profile) return null;

    const avatarSrc = profile.avatar?.asset?.url || profile.avatar;
    const initials = profile.name?.charAt(0)?.toUpperCase() || "?";

    return (
        <div className="flex items-start gap-4">
            <Avatar
                className={`${compact ? "h-12 w-12" : "h-20 w-20"} ring-4 ring-background shadow-md`}
            >
                {avatarSrc && <AvatarImage src={avatarSrc} alt={profile.name} />}
                <AvatarFallback
                    className={`bg-primary/10 text-primary font-bold ${compact ? "text-lg" : "text-2xl"}`}
                >
                    {initials}
                </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <h2 className={`font-bold ${compact ? "text-lg" : "text-2xl"}`}>
                        {profile.name}
                    </h2>
                    {profile.profileComplete && (
                        <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50">
                            Complete
                        </Badge>
                    )}
                </div>

                {profile.headline && (
                    <p className="text-muted-foreground mt-0.5">{profile.headline}</p>
                )}

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                    {profile.location && (
                        <span className="flex items-center gap-1.5">
                            <MapPin size={14} className="shrink-0" />
                            {profile.location}
                        </span>
                    )}
                    {profile.email && (
                        <span className="flex items-center gap-1.5">
                            <Mail size={14} className="shrink-0" />
                            {profile.email}
                        </span>
                    )}
                    {profile.phone && (
                        <span className="flex items-center gap-1.5">
                            <Phone size={14} className="shrink-0" />
                            {profile.phone}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
