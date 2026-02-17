import { useState } from "react";

/**
 * Custom Sanity Studio document action to approve an organization request.
 * Shows "Approve" button when the request status is "pending".
 * Opens a dialog to enter the organization slug before calling the approve endpoint.
 */
export function approveOrgRequestAction(props) {
    const { id, type, published, draft, onComplete } = props;
    const [isApproving, setIsApproving] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    // Only show for organizationRequest documents
    if (type !== "organizationRequest") return null;

    const doc = draft || published;

    // Only show when status is pending
    if (!doc || doc.status !== "pending") return null;

    // Generate default slug from org name
    const defaultSlug = doc.orgName
        ? doc.orgName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")
        : "";

    return {
        label: isApproving ? "Approving..." : "Approve",
        icon: () => "✅",
        tone: "positive",
        disabled: isApproving,
        dialog: dialogOpen && {
            type: "dialog",
            header: "Approve Organization Request",
            content: (
                <ApproveDialog
                    defaultSlug={defaultSlug}
                    isApproving={isApproving}
                    onConfirm={async (slug) => {
                        setIsApproving(true);

                        try {
                            const response = await fetch(
                                `/api/organization-requests/${id}/approve`,
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        adminName: "Studio Admin",
                                        orgSlug: slug,
                                    }),
                                },
                            );

                            if (!response.ok) {
                                const data = await response
                                    .json()
                                    .catch(() => ({}));
                                throw new Error(
                                    data.error || "Failed to approve request",
                                );
                            }

                            setDialogOpen(false);
                            onComplete();
                        } catch (err) {
                            console.error("Error approving org request:", err);
                            alert(err.message);
                        } finally {
                            setIsApproving(false);
                        }
                    }}
                    onCancel={() => setDialogOpen(false)}
                />
            ),
        },
        onHandle: () => {
            setDialogOpen(true);
        },
    };
}

/**
 * Simple dialog component for entering organization slug before approval.
 */
function ApproveDialog({ defaultSlug, isApproving, onConfirm, onCancel }) {
    const [slug, setSlug] = useState(defaultSlug);
    const [error, setError] = useState(null);

    const handleConfirm = () => {
        const finalSlug = slug.trim() || defaultSlug;

        if (!finalSlug) {
            setError("Slug is required");
            return;
        }

        if (!/^[a-z0-9-]+$/.test(finalSlug)) {
            setError(
                "Slug must contain only lowercase letters, numbers, and hyphens",
            );
            return;
        }

        setError(null);
        onConfirm(finalSlug);
    };

    return (
        <div style={{ padding: "1rem" }}>
            <p style={{ marginBottom: "0.75rem", fontSize: "0.875rem" }}>
                Enter the URL slug for this organization. This will be used in
                the organization&apos;s public URL.
            </p>
            <div style={{ marginBottom: "0.5rem" }}>
                <label
                    style={{
                        display: "block",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        marginBottom: "0.25rem",
                    }}
                >
                    Organization Slug
                </label>
                <input
                    type="text"
                    value={slug}
                    onChange={(e) => {
                        setSlug(e.target.value);
                        setError(null);
                    }}
                    placeholder={defaultSlug || "e.g. acme-corporation"}
                    disabled={isApproving}
                    style={{
                        width: "100%",
                        padding: "0.5rem",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        fontSize: "0.875rem",
                        boxSizing: "border-box",
                    }}
                />
                <p
                    style={{
                        margin: "0.25rem 0 0",
                        fontSize: "0.75rem",
                        color: "#666",
                    }}
                >
                    Only lowercase letters, numbers, and hyphens are allowed.
                </p>
            </div>
            {error && (
                <p
                    style={{
                        margin: "0 0 0.75rem",
                        fontSize: "0.8125rem",
                        color: "#e53e3e",
                        fontWeight: 500,
                    }}
                >
                    {error}
                </p>
            )}
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "0.5rem",
                    marginTop: "1rem",
                }}
            >
                <button
                    onClick={onCancel}
                    disabled={isApproving}
                    style={{
                        padding: "0.5rem 1rem",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        background: "white",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                        color: "#333",
                    }}
                >
                    Cancel
                </button>
                <button
                    onClick={handleConfirm}
                    disabled={isApproving}
                    style={{
                        padding: "0.5rem 1rem",
                        border: "none",
                        borderRadius: "4px",
                        background: isApproving ? "#ccc" : "#16a34a",
                        color: "white",
                        cursor: isApproving ? "not-allowed" : "pointer",
                        fontSize: "0.875rem",
                    }}
                >
                    {isApproving ? "Approving..." : "Confirm Approve"}
                </button>
            </div>
        </div>
    );
}
