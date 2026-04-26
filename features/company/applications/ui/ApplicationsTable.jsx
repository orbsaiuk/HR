"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, MoreHorizontal, Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { usePermissions } from "@/features/company/org-members/model/usePermissions";
import { PERMISSIONS } from "@/shared/lib/permissions";

const STATUS_OPTIONS = [
  "new",
  "screening",
  "interview",
  "offered",
  "hired",
  "rejected",
];

const STATUS_LABELS = {
  all: "الكل",
  new: "جديد",
  screening: "فرز أولي",
  interview: "مقابلة",
  offered: "عرض وظيفي",
  hired: "تم التوظيف",
  rejected: "مرفوض",
};

export function ApplicationsTable({
  applications,
  positionId,
  onStatusChange,
}) {
  const { hasPermission } = usePermissions();
  const canManageApplications = hasPermission(PERMISSIONS.MANAGE_APPLICATIONS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = applications.filter((app) => {
    const matchesSearch =
      !search ||
      app.applicant?.name?.toLowerCase().includes(search.toLowerCase()) ||
      app.applicant?.email?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const renderRating = (rating) => {
    if (!rating)
      return <span className="text-muted-foreground text-xs">غير مقيم</span>;
    return (
      <span className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={12}
            className={
              i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }
          />
        ))}
      </span>
    );
  };

  const statusCounts = STATUS_OPTIONS.reduce(
    (acc, s) => {
      acc[s] = applications.filter((a) => a.status === s).length;
      return acc;
    },
    { all: applications.length },
  );

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-3">
        <Input
          placeholder="ابحث بالاسم أو البريد الإلكتروني..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex flex-wrap gap-1.5">
          {["all", ...STATUS_OPTIONS].map((s) => {
            const isActive = statusFilter === s;
            const count = s === "all" ? statusCounts.all : statusCounts[s] || 0;
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`cursor-pointer inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border transition-all ${
                  isActive
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {STATUS_LABELS[s] || s}
                <span
                  className={`text-[10px] font-bold ${
                    isActive ? "text-gray-300" : "text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>المتقدم</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>التقييم</TableHead>
              <TableHead>تاريخ التقديم</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  لا توجد طلبات مطابقة.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((app) => (
                <TableRow key={app._id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {app.applicant?.name || "غير معروف"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {app.applicant?.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <ApplicationStatusBadge status={app.status} />
                  </TableCell>
                  <TableCell>{renderRating(app.rating)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {app.appliedAt
                      ? formatDistanceToNow(new Date(app.appliedAt), {
                          addSuffix: true,
                          locale: ar,
                        })
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/company/positions/${positionId}/applications/${app._id}`}
                          >
                            <Eye size={14} className="mr-2" />
                            عرض التفاصيل
                          </Link>
                        </DropdownMenuItem>
                        {canManageApplications && (
                          <>
                            <DropdownMenuSeparator />
                            {STATUS_OPTIONS.filter((s) => s !== app.status).map(
                              (s) => (
                                <DropdownMenuItem
                                  key={s}
                                  onClick={() => onStatusChange(app._id, s)}
                                >
                                  نقل إلى {STATUS_LABELS[s] || s}
                                </DropdownMenuItem>
                              ),
                            )}
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-muted-foreground">
        عرض {filtered.length} من أصل {applications.length} طلب
      </p>
    </div>
  );
}
