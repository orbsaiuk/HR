"use client";

import { useState } from "react";
import { Clock, Plus, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { PERMISSION_METADATA } from "@/shared/lib/permissions";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export function TemporaryGrantDialog({ memberId, memberName, onGranted }) {
    const [open, setOpen] = useState(false);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [expiresAt, setExpiresAt] = useState("");
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Group permissions by category for the UI
    const permissionGroups = Object.entries(PERMISSION_METADATA).reduce(
        (groups, [key, meta]) => {
            const group = meta.group;
            if (!groups[group]) groups[group] = [];
            groups[group].push({ key, ...meta });
            return groups;
        },
        {},
    );

    function togglePermission(key) {
        setSelectedPermissions((prev) =>
            prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key],
        );
    }

    // Set minimum datetime to 1 hour from now
    function getMinDateTime() {
        const now = new Date();
        now.setHours(now.getHours() + 1);
        return now.toISOString().slice(0, 16);
    }

    async function handleGrant() {
        if (selectedPermissions.length === 0) {
            setError("Select at least one permission to grant");
            return;
        }
        if (!expiresAt) {
            setError("Expiration date is required");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await apiClient.post(API_ENDPOINTS.TEMPORARY_GRANTS(memberId), {
                permissions: selectedPermissions,
                expiresAt: new Date(expiresAt).toISOString(),
                reason,
            });

            setOpen(false);
            setSelectedPermissions([]);
            setExpiresAt("");
            setReason("");
            onGranted?.();
        } catch (err) {
            setError(err.message || "Failed to grant permissions");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    Temporary Access
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-amber-500" />
                        Grant Temporary Access
                    </DialogTitle>
                    <DialogDescription>
                        Grant time-boxed permission elevation to{" "}
                        <strong>{memberName}</strong>. These permissions will automatically
                        expire at the specified time.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Permission selection */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Permissions to Grant</Label>
                        {Object.entries(permissionGroups).map(([group, perms]) => (
                            <div key={group} className="space-y-2">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                    {group}
                                </p>
                                <div className="space-y-1.5 pl-2">
                                    {perms.map(({ key, label, description }) => (
                                        <div key={key} className="flex items-start gap-2">
                                            <Checkbox
                                                id={`perm-${key}`}
                                                checked={selectedPermissions.includes(key)}
                                                onCheckedChange={() => togglePermission(key)}
                                                className="mt-0.5"
                                            />
                                            <div>
                                                <Label
                                                    htmlFor={`perm-${key}`}
                                                    className="text-sm font-normal cursor-pointer"
                                                >
                                                    {label}
                                                </Label>
                                                <p className="text-xs text-muted-foreground">
                                                    {description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Selected permissions preview */}
                    {selectedPermissions.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {selectedPermissions.map((key) => (
                                <Badge key={key} variant="secondary" className="gap-1 pr-1">
                                    {PERMISSION_METADATA[key]?.label || key}
                                    <button
                                        type="button"
                                        onClick={() => togglePermission(key)}
                                        className="hover:text-destructive"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    )}

                    {/* Expiration datetime */}
                    <div className="space-y-1.5">
                        <Label htmlFor="expires-at" className="text-sm font-medium">
                            Expires At <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="expires-at"
                            type="datetime-local"
                            value={expiresAt}
                            min={getMinDateTime()}
                            onChange={(e) => setExpiresAt(e.target.value)}
                        />
                    </div>

                    {/* Reason */}
                    <div className="space-y-1.5">
                        <Label htmlFor="reason" className="text-sm font-medium">
                            Reason <span className="text-muted-foreground">(optional)</span>
                        </Label>
                        <Input
                            id="reason"
                            placeholder="e.g. Covering for sick colleague, temporary project access"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-destructive">{error}</p>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleGrant}
                        disabled={loading || selectedPermissions.length === 0}
                        className="gap-1.5"
                    >
                        <Plus className="h-4 w-4" />
                        {loading ? "Granting..." : "Grant Access"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
