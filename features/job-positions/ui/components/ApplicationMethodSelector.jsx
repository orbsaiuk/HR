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
        label: "التقديم بنموذج مخصص",
        description: "يقوم المتقدمون بملء نموذج تقديم مخصص",
        icon: FileText,
    },
    {
        value: "profile",
        label: "التقديم بالملف الشخصي",
        description: "يرسل المتقدمون ملفهم الشخصي كمستخدمين",
        icon: UserCircle,
    },
    {
        value: "both",
        label: "كلاهما — الملف الشخصي + نموذج التقديم",
        description: "يرسل المتقدمون ملفهم الشخصي ويملأون نموذجاً إضافياً",
        icon: Users,
    },
];

export function ApplicationMethodSelector({ value, onChange }) {
    return (
        <div className="space-y-2">
            <Label htmlFor="applicationMethod">طريقة التقديم</Label>
            <Select value={value || "form"} onValueChange={onChange} dir="rtl">
                <SelectTrigger id="applicationMethod">
                    <SelectValue placeholder="اختر طريقة التقديم" />
                </SelectTrigger>
                <SelectContent dir="rtl">
                    {APPLICATION_METHODS.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                            <div className="flex items-center gap-2">
                                <method.icon size={14} className="text-muted-foreground ml-2" />
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
