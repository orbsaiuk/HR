"use client";

import { Button } from "@/components/ui/button";
import { SquarePen, SquarePlus, Facebook, Linkedin, Mail } from "lucide-react";

/** Custom X (formerly Twitter) icon */
const XIcon = ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);


const SOCIAL_CONFIG = [
    { key: "twitter", label: "X", icon: XIcon, color: "text-black dark:text-white", bgColor: "bg-black/5 dark:bg-white/10" },
    { key: "facebook", label: "Facebook", icon: Facebook, color: "text-[#1877F2]", bgColor: "bg-[#1877F2]/10" },
    { key: "linkedin", label: "LinkedIn", icon: Linkedin, color: "text-[#0A66C2]", bgColor: "bg-[#0A66C2]/10" },
    { key: "email", label: "Email", icon: Mail, color: "text-gray-600", bgColor: "bg-gray-100" },
];

/**
 * Social / contact links section with badges for each link.
 */
export function CompanyContactSection({ socialLinks = {}, onEdit }) {
    const hasAnyLink = Object.values(socialLinks || {}).some((v) => v);

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl border p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground">التواصل</h2>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#462EA8] hover:bg-[#462EA8]/10 hover:text-[#462EA8]"
                        onClick={onEdit}
                    >
                        {hasAnyLink ? <SquarePen size={18} /> : <SquarePlus size={18} />}
                    </Button>
                </div>
            </div>

            {hasAnyLink ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SOCIAL_CONFIG.map(({ key, label, icon: Icon, color, bgColor }) => {
                        const value = socialLinks?.[key];
                        if (!value) return null;

                        const displayValue = key === "email"
                            ? value
                            : value.replace(/^https?:\/\/(www\.)?/, "");

                        return (
                            <a
                                key={key}
                                href={key === "email" ? `mailto:${value}` : value}
                                target={key === "email" ? undefined : "_blank"}
                                rel={key === "email" ? undefined : "noopener noreferrer"}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border hover:shadow-sm transition-all ${bgColor}`}
                            >
                                <Icon size={18} className={color} />
                                <span className="text-sm text-foreground truncate">{displayValue}</span>
                            </a>
                        );
                    })}
                </div>
            ) : (
                <p className="text-muted-foreground/50 italic">
                    لم يتم إضافة معلومات التواصل بعد.
                </p>
            )}
        </div>
    );
}
