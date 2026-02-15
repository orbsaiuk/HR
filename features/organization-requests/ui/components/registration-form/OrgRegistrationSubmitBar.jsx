"use client";

import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";

/**
 * Submit button bar with terms notice for the registration form.
 */
export function OrgRegistrationSubmitBar({ submitting }) {
    return (
        <div className="flex flex-col items-center gap-3 pt-4">
            <p className="text-xs text-gray-500 text-center max-w-md">
                By submitting this request, you agree that the information provided is
                accurate. A platform administrator will review your request and you will
                be notified of the outcome.
            </p>
            <Button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto"
            >
                {submitting ? (
                    <>
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        Submitting...
                    </>
                ) : (
                    <>
                        <Send size={16} className="mr-2" />
                        Submit Registration Request
                    </>
                )}
            </Button>
        </div>
    );
}
