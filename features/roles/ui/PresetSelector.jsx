"use client";

import { PERMISSION_PRESETS, PERMISSION_METADATA } from "@/shared/lib/permissions";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Zap } from "lucide-react";


function getPermissionLabels(permissions) {
    return permissions.map((key) => {
        const meta = PERMISSION_METADATA[key];
        return meta ? meta.label : key.replace(/_/g, " ");
    });
}

/**
 * Displays preset permission templates that can be applied with one click.
 * When a preset is selected, it replaces the current permission selection.
 * Hovering over a preset shows the included permissions via PERMISSION_METADATA labels.
 */
export function PresetSelector({ onApply, currentPermissions = [], disabled = false }) {
    const getMatchingPreset = () => {
        return PERMISSION_PRESETS.find((preset) => {
            if (preset.permissions.length !== currentPermissions.length) return false;
            return preset.permissions.every((p) => currentPermissions.includes(p));
        });
    };

    const matchingPreset = getMatchingPreset();

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Zap className="h-4 w-4" />
                Quick Presets
            </div>
            <TooltipProvider delayDuration={200}>
                <div className="flex flex-wrap gap-2">
                    {PERMISSION_PRESETS.map((preset) => {
                        const isActive = matchingPreset?.key === preset.key;
                        const labels = getPermissionLabels(preset.permissions);

                        return (
                            <Tooltip key={preset.key}>
                                <TooltipTrigger asChild>
                                    <button
                                        type="button"
                                        disabled={disabled}
                                        onClick={() => onApply([...preset.permissions])}
                                        className={`
                                            group relative inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-left text-sm transition-all
                                            ${isActive
                                                ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/20"
                                                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                                            }
                                            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                                        `}
                                    >
                                        <span className="font-medium">{preset.name}</span>
                                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                            {preset.permissions.length}
                                        </Badge>
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" className="max-w-xs">
                                    <p className="font-medium mb-1">{preset.description}</p>
                                    <p className="text-xs opacity-80">
                                        Includes: {labels.join(", ")}
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </div>
            </TooltipProvider>
            {matchingPreset && (
                <p className="text-xs text-primary">
                    Current selection matches the <span className="font-medium">{matchingPreset.name}</span> preset
                </p>
            )}
        </div>
    );
}
