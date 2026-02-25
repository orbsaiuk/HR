"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AccessDenied({
    message = "You don't have permission to access this page.",
    redirectHref = "/dashboard",
    redirectLabel = "Go to Dashboard",
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30">
            <Card className="max-w-md w-full shadow-lg">
                <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="h-8 w-8 text-destructive" />
                    </div>
                    <CardTitle className="text-2xl">Access Denied</CardTitle>
                    <CardDescription>{message}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <Button asChild>
                        <Link href={redirectHref}>{redirectLabel}</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
