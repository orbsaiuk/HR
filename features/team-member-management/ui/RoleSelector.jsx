"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


export function RoleSelector({ roles, value, onChange, disabled = false }) {
    return (
        <Select value={value} onValueChange={onChange} disabled={disabled}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
                {roles.map((role) => (
                    <SelectItem key={role._key} value={role._key}>
                        {role.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
