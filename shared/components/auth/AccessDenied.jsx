"use client";

import Link from "next/link";
import { AlertTriangle, Shield, ArrowLeft, Mail } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PERMISSION_METADATA } from "@/shared/lib/permissions";

export function AccessDenied({
    message,
    requiredPermission,
    requiredAnyOf,
    requiredAllOf,
    roleName,
    redirectHref = "/dashboard",
    redirectLabel = "Go to Dashboard",
}) {
    // Resolve human-readable labels for required permissions
    const getPermissionLabel = (key) => {
        const meta = PERMISSION_METADATA[key];
        return meta ? meta.label : key.replace(/_/g, " ");
    };

    const requiredPermissions = requiredPermission
        ? [requiredPermission]
        : requiredAnyOf || requiredAllOf || [];

    const isAnyOf = !!requiredAnyOf;

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
            <Card className="max-w-lg w-full shadow-lg">
                <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="h-8 w-8 text-destructive" />
                    </div>
                    <CardTitle className="text-2xl">Access Denied</CardTitle>
                    <CardDescription>
                        {message || "You don't have permission to access this page."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Required permission info */}
                    {requiredPermissions.length > 0 && (
                        <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <Shield className="h-4 w-4 text-muted-foreground" />
                                {isAnyOf ? "Requires one of these permissions:" : requiredPermissions.length > 1 ? "Requires all of these permissions:" : "Required permission:"}
                            </div>
                            <div className="flex flex-wrap gap-1.5 ml-6">
                                {requiredPermissions.map((perm) => (
                                    <Badge key={perm} variant="secondary" className="text-xs">
                                        {getPermissionLabel(perm)}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Current role info */}
                    {roleName && (
                        <div className="flex items-center justify-between text-sm px-1">
                            <span className="text-muted-foreground">Your current role:</span>
                            <Badge variant="outline">{roleName}</Badge>
                        </div>
                    )}

                    <Separator />

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button asChild className="flex-1">
                            <Link href={redirectHref}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                {redirectLabel}
                            </Link>
                        </Button>
                        <Button variant="outline" asChild className="flex-1">
                            <Link href="/dashboard/messages">
                                <Mail className="h-4 w-4 mr-2" />
                                Contact Admin
                            </Link>
                        </Button>
                    </div>

                    <p className="text-xs text-center text-muted-foreground">
                        If you believe this is an error, contact your organization admin to request access.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
