"use client";

import { ProfilePreviewCard } from "./components/ProfilePreviewCard";
import { FormViewer } from "@/features/forms/components/FormViewer/FormViewer.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Pencil, FileText } from "lucide-react";

export function ApplyWithBothSection({ profile, form, onSubmit, submitting }) {
    return (
        <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
                This position requires both your profile and a completed application
                form. Your profile will be attached automatically.
            </p>

            {/* Profile preview */}
            <div className="space-y-2">
                <ProfilePreviewCard profile={profile} />
                <div className="flex justify-end">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/user/profile/edit">
                            <Pencil size={14} className="mr-1" />
                            Edit Profile
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Application form */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <FileText size={20} />
                        Application Form
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <FormViewer form={form} onSubmit={onSubmit} submitting={submitting} />
                </CardContent>
            </Card>
        </div>
    );
}
