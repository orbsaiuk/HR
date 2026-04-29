"use client";

import { MessageSquare } from "lucide-react";

export function FreelancerMessagesPage() {
    return (
        <div className="flex h-full flex-col items-center justify-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary-50 text-secondary-400">
                <MessageSquare size={28} />
            </div>
            <p className="text-base font-medium text-muted-foreground">اختر محادثة للبدء</p>
        </div>
    );
}
