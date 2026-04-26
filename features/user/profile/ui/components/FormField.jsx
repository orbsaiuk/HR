"use client";

import { Label } from "@/components/ui/label";

/**
 * Reusable form field wrapper with shadcn Label and error display.
 */
export function FormField({ label, error, children, required, htmlFor }) {
    return (
        <div className="space-y-1.5">
            <Label htmlFor={htmlFor} className="text-sm font-medium">
                {label} {required && <span className="text-destructive">*</span>}
            </Label>
            {children}
            {error && (
                <p className="text-xs text-destructive mt-1">{error.message}</p>
            )}
        </div>
    );
}
