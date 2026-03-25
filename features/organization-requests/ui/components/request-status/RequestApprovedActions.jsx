"use client";

import { useState } from "react";
import { useOrganizationList } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Loader2 } from "lucide-react";

/**
 * Actions shown after an organization request is approved.
 * Automatically sets the user's (only) organization as active,
 * then navigates to the dashboard with a full page reload so the
 * server-side session picks up the new active org.
 */
export function RequestApprovedActions() {
    const { userMemberships, setActive, isLoaded } = useOrganizationList({
        userMemberships: { infinite: true },
    });
    const [activating, setActivating] = useState(false);

    async function handleGoToDashboard() {
        if (!isLoaded || !setActive) return;

        setActivating(true);
        try {
            // The user should have exactly one org after approval
            const membership = userMemberships?.data?.[0];
            if (membership) {
                await setActive({ organization: membership.organization.id });
            }
            // Use full page navigation to ensure server-side auth picks up the active org
            window.location.href = "/dashboard";
        } catch (err) {
            console.error("Failed to set active organization:", err);
            window.location.href = "/dashboard";
        }
    }

    return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-3">
                <CheckCircle size={18} className="text-green-500 mt-0.5 shrink-0" />
                <div>
                    <h4 className="text-sm font-medium text-green-800">
                        تمت الموافقة على مؤسستك!
                    </h4>
                    <p className="text-sm text-green-700 mt-1">
                        يمكنك الآن الوصول إلى لوحة تحكم مؤسستك لبدء
                        إدارة فريقك والوظائف والمزيد.
                    </p>
                    <Button
                        size="sm"
                        className="mt-3"
                        onClick={handleGoToDashboard}
                        disabled={activating || !isLoaded}
                    >
                        {activating ? (
                            <>
                                <Loader2 size={14} className="ml-2 animate-spin" />
                                جاري التنشيط...
                            </>
                        ) : (
                            <>
                                الذهاب للوحة التحكم
                                <ArrowRight size={14} className="mr-2 rotate-180" />
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
