import { useState } from "react";

/**
 * Custom Sanity Studio document action to reject an organization request.
 * Shows "Reject" button when the request status is "pending".
 * Prompts for a rejection reason, then calls /api/organization-requests/[id]/reject.
 */
export function rejectOrgRequestAction(props) {
    const { id, type, published, draft, onComplete } = props;
    const [isRejecting, setIsRejecting] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    // Only show for organizationRequest documents
    if (type !== "organizationRequest") return null;

    const doc = draft || published;

    // Only show when status is pending
    if (!doc || doc.status !== "pending") return null;

    return {
        label: isRejecting ? "Rejecting..." : "Reject",
        icon: () => "❌",
        tone: "critical",
        disabled: isRejecting,
        dialog: dialogOpen && {
            type: "dialog",
            header: "Reject Organization Request",
            content: RejectDialog({
                isRejecting,
                onConfirm: async (reason) => {
                    setIsRejecting(true);

                    try {
                        const response = await fetch(
                            `/api/organization-requests/${id}/reject`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    reason,
                                    adminName: "Studio Admin",
                                }),
                            },
                        );

                        if (!response.ok) {
                            const data = await response
                                .json()
                                .catch(() => ({}));
                            throw new Error(
                                data.error || "Failed to reject request",
                            );
                        }

                        setDialogOpen(false);
                        onComplete();
                    } catch (err) {
                        console.error("Error rejecting org request:", err);
                        alert(err.message);
                    } finally {
                        setIsRejecting(false);
                    }
                },
                onCancel: () => setDialogOpen(false),
            }),
        },
        onHandle: () => {
            setDialogOpen(true);
        },
    };
}

/**
 * Simple dialog component for entering rejection reason.
 */
function RejectDialog({ isRejecting, onConfirm, onCancel }) {
    const [reason, setReason] = useState("");

    return (
        <div style={{ padding: "1rem" }}>
            <p style={{ marginBottom: "0.75rem", fontSize: "0.875rem" }}>
                Please provide a reason for rejecting this organization request.
                The requester will see this reason.
            </p>
            <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter rejection reason..."
                rows={4}
                style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    fontSize: "0.875rem",
                    marginBottom: "1rem",
                }}
            />
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "0.5rem",
                }}
            >
                <button
                    onClick={onCancel}
                    disabled={isRejecting}
                    style={{
                        padding: "0.5rem 1rem",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        background: "white",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                    }}
                >
                    Cancel
                </button>
                <button
                    onClick={() => {
                        if (!reason.trim()) {
                            alert("Please enter a rejection reason");
                            return;
                        }
                        onConfirm(reason.trim());
                    }}
                    disabled={isRejecting || !reason.trim()}
                    style={{
                        padding: "0.5rem 1rem",
                        border: "none",
                        borderRadius: "4px",
                        background: isRejecting ? "#ccc" : "#dc2626",
                        color: "white",
                        cursor: isRejecting ? "not-allowed" : "pointer",
                        fontSize: "0.875rem",
                    }}
                >
                    {isRejecting ? "Rejecting..." : "Reject Request"}
                </button>
            </div>
        </div>
    );
}
