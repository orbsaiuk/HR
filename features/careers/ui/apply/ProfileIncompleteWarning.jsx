"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import Link from "next/link";

export function ProfileIncompleteWarning({ positionId }) {
    return (
        <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-amber-800">
                    <AlertTriangle size={20} />
                    Complete Your Profile
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-amber-700">
                    This position requires you to apply with your profile. Please complete
                    your profile before submitting your application. At minimum, add a
                    headline, bio, or skills.
                </p>
                <div className="flex gap-3">
                    <Button asChild>
                        <Link href="/user/profile/edit">Complete Profile</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href={`/careers/${positionId}`}>Back to Position</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
