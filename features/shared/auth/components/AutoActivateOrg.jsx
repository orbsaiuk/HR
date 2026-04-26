"use client";

import { useEffect, useRef } from "react";
import { useOrganizationList, useOrganization } from "@clerk/nextjs";

const ACTIVATION_KEY = "org_auto_activated";

/**
 * Automatically sets the user's only organization as active
 * if they have one membership but no active org in the session.
 * After activation, reloads the page so server-side auth picks up the change.
 * Renders nothing — purely a side-effect component.
 */
export function AutoActivateOrg() {
    const { organization } = useOrganization();
    const { userMemberships, setActive, isLoaded } = useOrganizationList({
        userMemberships: { infinite: true },
    });
    const activating = useRef(false);

    // Clear the activation flag when org is active
    useEffect(() => {
        if (organization) {
            sessionStorage.removeItem(ACTIVATION_KEY);
        }
    }, [organization]);

    useEffect(() => {
        async function activate() {
            if (!isLoaded || !setActive || activating.current) return;
            // Already have an active org — nothing to do
            if (organization) return;
            // Prevent infinite reload: only attempt once per session
            if (sessionStorage.getItem(ACTIVATION_KEY)) return;

            const memberships = userMemberships?.data;
            if (memberships && memberships.length === 1) {
                activating.current = true;
                try {
                    sessionStorage.setItem(ACTIVATION_KEY, "1");
                    await setActive({ organization: memberships[0].organization.id });
                    // Full reload so server-side auth() picks up the new active org
                    window.location.reload();
                } catch (err) {
                    console.error("Failed to auto-activate organization:", err);
                    sessionStorage.removeItem(ACTIVATION_KEY);
                    activating.current = false;
                }
            }
        }

        activate();
    }, [isLoaded, organization, userMemberships?.data?.length]);

    return null;
}
