"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AuditLogRow } from "./AuditLogRow";
import { AuditLogPagination } from "./AuditLogPagination";

/**
 * Audit log table with pagination.
 * Renders a shadcn Table of audit log rows with a pagination footer.
 */
export function AuditLogTable({
  logs,
  total,
  page,
  totalPages,
  pageSize,
  onPageChange,
}) {
  if (!logs || logs.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        لا توجد سجلات نشاط حالياً. ستظهر هنا العمليات التي تتم داخل منظمتك.
      </div>
    );
  }

  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs uppercase tracking-wider">
              التاريخ
            </TableHead>
            <TableHead className="text-xs uppercase tracking-wider">
              المنفذ
            </TableHead>
            <TableHead className="text-xs uppercase tracking-wider">
              التصنيف
            </TableHead>
            <TableHead className="text-xs uppercase tracking-wider">
              الوصف
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <AuditLogRow key={log._id} log={log} />
          ))}
        </TableBody>
      </Table>

      {/* Pagination footer */}
      {total > 0 && (
        <div className="px-4 py-3 border-t flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            عرض {startItem} - {endItem} من أصل {total}
          </span>
          <AuditLogPagination
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
