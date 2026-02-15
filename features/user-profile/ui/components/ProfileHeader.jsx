"use client";

import { MapPin, Mail, Phone } from "lucide-react";

/**
 * Displays avatar, name, headline, location, and contact info.
 * Used in both view and edit profile pages.
 */
export function ProfileHeader({ profile, compact = false }) {
    if (!profile) return null;

    return (
        <div className="flex items-start gap-4">
            {/* Avatar */}
            {profile.avatar?.asset?.url || profile.avatar ? (
                <img
                    src={profile.avatar?.asset?.url || profile.avatar}
                    alt={profile.name}
                    className={`rounded-full object-cover ${compact ? "h-12 w-12" : "h-20 w-20"}`}
                />
            ) : (
                <div
                    className={`rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold ${compact ? "h-12 w-12 text-lg" : "h-20 w-20 text-2xl"}`}
                >
                    {profile.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
            )}

            <div className="flex-1 min-w-0">
                <h2 className={`font-bold text-gray-900 ${compact ? "text-lg" : "text-2xl"}`}>
                    {profile.name}
                </h2>

                {profile.headline && (
                    <p className="text-gray-600 mt-0.5">{profile.headline}</p>
                )}

                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                    {profile.location && (
                        <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {profile.location}
                        </span>
                    )}
                    {profile.email && (
                        <span className="flex items-center gap-1">
                            <Mail size={14} />
                            {profile.email}
                        </span>
                    )}
                    {profile.phone && (
                        <span className="flex items-center gap-1">
                            <Phone size={14} />
                            {profile.phone}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
