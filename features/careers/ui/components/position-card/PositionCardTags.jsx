import { Badge } from "@/components/ui/badge";
import { MapPin, DollarSign, BarChart3 } from "lucide-react";
import { TYPE_LABELS, LEVEL_LABELS } from "./positionCardUtils";

export function PositionCardTags({ type, location, salary, level, compact = false }) {
    const iconSize = compact ? 12 : 14;
    const textClass = compact ? "text-xs" : "text-sm";

    return (
        <div className={`flex flex-wrap items-center gap-2 ${textClass} text-gray-600`}>
            {type && (
                <Badge
                    variant="outline"
                    className={`rounded-full border-gray-300 text-gray-700 font-normal ${compact ? "px-2.5 py-0.5 text-xs" : "px-3 py-0.5"}`}
                >
                    {TYPE_LABELS[type] || type}
                </Badge>
            )}
            {location && (
                <span className="flex items-center gap-1 text-gray-500">
                    <MapPin size={iconSize} className="text-gray-400" />
                    {location}
                </span>
            )}
            {salary && (
                <span className="flex items-center gap-1 text-gray-500">
                    <DollarSign size={iconSize} className="text-gray-400" />
                    {salary}
                </span>
            )}
            {!compact && level && (
                <span className="flex items-center gap-1 text-gray-500">
                    <BarChart3 size={iconSize} className="text-gray-400" />
                    {LEVEL_LABELS[level] || level}
                </span>
            )}
        </div>
    );
}
