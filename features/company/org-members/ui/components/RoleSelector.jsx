"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getLocalizedRoleName } from "@/shared/lib/permissions";

export function RoleSelector({ roles, value, onChange, disabled = false }) {
  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled}
      dir="rtl"
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="اختر الدور" />
      </SelectTrigger>
      <SelectContent dir="rtl">
        {roles.map((role) => (
          <SelectItem key={role._key} value={role._key}>
            {getLocalizedRoleName(role._key, role.name)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
