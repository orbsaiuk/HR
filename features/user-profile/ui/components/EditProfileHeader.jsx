"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";

/**
 * Sticky header bar for the edit profile page.
 * Shows back button, title, unsaved-changes hint, and save button.
 */
export function EditProfileHeader() {
    return (
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border -mx-4 px-4 py-3">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
                <div className="flex items-center gap-3">
                    <Link href="/user/profile">
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                            <ArrowLeft size={16} />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold">Edit Profile</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}
