import { useState } from "react";
import { useDocumentOperation } from "sanity";

/**
 * Custom Sanity Studio document action to approve an organization request.
 * Shows "Approve" button when the request status is "pending".
 * Calls the /api/organization-requests/[id]/approve endpoint.
 */
export function approveOrgRequestAction(props) {
    const { id, type, published, draft, onComplete } = props;
    const [isApproving, setIsApproving] = useState(false);
    const [error, setError] = useState(null);

    // Only show for organizationRequest documents
    if (type !== "organizationRequest") return null;

    const doc = draft || published;

    // Only show when status is pending
    if (!doc || doc.status !== "pending") return null;

    return {
        label: isApproving ? "Approving..." : "Approve",
        icon: () => "✅",
        tone: "positive",
        disabled: isApproving,
        onHandle: async () => {
            setIsApproving(true);
            setError(null);

            try {
                const response = await fetch(
                    `/api/organization-requests/${id}/approve`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            adminName: "Studio Admin",
                        }),
                    },
                );

                if (!response.ok) {
                    const data = await response.json().catch(() => ({}));
                    throw new Error(
                        data.error || "Failed to approve request",
                    );
                }

                // Refresh the document in Studio
                onComplete();
            } catch (err) {
                setError(err.message);
                console.error("Error approving org request:", err);
            } finally {
                setIsApproving(false);
            }
        },
    };
}
