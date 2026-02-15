"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

export function ApplySignInRequired({ positionId }) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center max-w-md">
                <Lock className="mx-auto text-blue-500 mb-4" size={48} />
                <h2 className="text-xl font-bold text-foreground mb-2">
                    Sign In Required
                </h2>
                <p className="text-muted-foreground mb-6">
                    You need to sign in or create an account to apply for this position.
                </p>
                <div className="flex gap-3 justify-center">
                    <Button asChild>
                        <Link href="/sign-in">Sign In</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/sign-up">Create Account</Link>
                    </Button>
                </div>
                <Button variant="link" asChild className="mt-4">
                    <Link href={`/careers/${positionId}`}>
                        <ArrowLeft size={16} />
                        Back to Position
                    </Link>
                </Button>
            </div>
        </div>
    );
}
