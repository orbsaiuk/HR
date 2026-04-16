"use client";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TableRow, TableCell } from "@/components/ui/table";
import { CATEGORY_LABELS, CATEGORY_STYLES } from "./auditLogCategories";
import {
  formatAuditDate,
  localizeAuditDescription,
} from "./auditLogLocalization";

/**
 * Get initials from a name string.
 */
function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * A single row in the audit log table.
 * Shows date, actor, category, and description.
 */
export function AuditLogRow({ log }) {
  const effectiveCategory =
    log?.action === "company_profile.updated" ? "profile" : log?.category;

  return (
    <TableRow>
      {/* Date */}
      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
        {formatAuditDate(log.createdAt)}
      </TableCell>

      {/* Actor */}
      <TableCell>
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={log.actor?.avatar} />
            <AvatarFallback className="text-[10px]">
              {getInitials(log.actor?.name)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm truncate max-w-[150px]">
            {log.actor?.name || log.actor?.email || "غير معروف"}
          </span>
        </div>
      </TableCell>

      {/* Category */}
      <TableCell>
        <Badge
          variant="outline"
          className={`text-xs capitalize ${CATEGORY_STYLES[effectiveCategory] || CATEGORY_STYLES.settings}`}
        >
          {CATEGORY_LABELS[effectiveCategory] ||
            effectiveCategory ||
            log.category}
        </Badge>
      </TableCell>

      {/* Description */}
      <TableCell className="text-sm max-w-[300px] truncate">
        {localizeAuditDescription(log)}
      </TableCell>
    </TableRow>
  );
}
