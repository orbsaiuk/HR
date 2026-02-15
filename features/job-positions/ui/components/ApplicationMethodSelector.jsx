"use client";

import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { UserCircle, FileText, Users } from "lucide-react";

const APPLICATION_METHODS = [
    {
        value: "form",
        label: "Apply with Form",
        description: "Applicants fill out a custom application form",
        icon: FileText,
    },
    {
        value: "profile",
        label: "Apply with Profile",
        description: "Applicants submit their user profile",
        icon: UserCircle,
    },
    {
        value: "both",
        label: "Both — Profile + Form",
        description: "Applicants submit their profile and fill out a form",
        icon: Users,
    },
];

export function ApplicationMethodSelector({ value, onChange }) {
    return (
        <div className="space-y-2">
            <Label htmlFor="applicationMethod">Application Method</Label>
            <Select value={value || "form"} onValueChange={onChange}>
                <SelectTrigger id="applicationMethod">
                    <SelectValue placeholder="Select application method" />
                </SelectTrigger>
                <SelectContent>
                    {APPLICATION_METHODS.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                            <div className="flex items-center gap-2">
                                <method.icon size={14} className="text-muted-foreground" />
                                <span>{method.label}</span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
                {APPLICATION_METHODS.find((m) => m.value === (value || "form"))
                    ?.description}
            </p>
        </div>
    );
}
