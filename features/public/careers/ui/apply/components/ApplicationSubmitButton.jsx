"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";

export function ApplicationSubmitButton({ onClick, submitting, disabled, children }) {
    return (
        <Button
            onClick={onClick}
            disabled={submitting || disabled}
            className="w-full"
            size="lg"
        >
            {submitting ? (
                <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Submitting…
                </>
            ) : (
                <>
                    <Send size={16} className="mr-2" />
                    {children || "Submit Application"}
                </>
            )}
        </Button>
    );
}
