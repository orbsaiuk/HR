"use client";

import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { AuditLogRow } from "./AuditLogRow";
import { Pagination } from "@/shared/components/navigation/Pagination";

/**
 * Audit log table with pagination.
 * Renders a shadcn Table of expandable audit log rows with a pagination footer.
 */
export function AuditLogTable({ logs, total, page, totalPages, pageSize, onPageChange }) {
    if (!logs || logs.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                No activity logs found. Actions performed in your organization will
                appear here.
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
                        <TableHead className="w-8" />
                        <TableHead className="text-xs uppercase tracking-wider">Date</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider">Actor</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider">Action</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider">Category</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider">Description</TableHead>
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
                        Showing {startItem}–{endItem} of {total} entries
                    </span>
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                    />
                </div>
            )}
        </div>
    );
}
