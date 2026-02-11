"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, MoreHorizontal, Trash2, Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
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

const STATUS_OPTIONS = [
  "new",
  "screening",
  "interview",
  "offered",
  "hired",
  "rejected",
];

export function ApplicationsTable({
  applications,
  positionId,
  onStatusChange,
  onDelete,
}) {
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
      return <span className="text-muted-foreground text-xs">—</span>;
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

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search applicants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="flex h-9 w-full sm:w-48 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="all">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Applied</TableHead>
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
                  No applications found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((app) => (
                <TableRow key={app._id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {app.applicant?.name || "Unknown"}
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
                            href={`/dashboard/positions/${positionId}/applications/${app._id}`}
                          >
                            <Eye size={14} className="mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {STATUS_OPTIONS.filter((s) => s !== app.status).map(
                          (s) => (
                            <DropdownMenuItem
                              key={s}
                              onClick={() => onStatusChange(app._id, s)}
                            >
                              Move to {s.charAt(0).toUpperCase() + s.slice(1)}
                            </DropdownMenuItem>
                          ),
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => onDelete(app._id)}
                        >
                          <Trash2 size={14} className="mr-2" />
                          Delete
                        </DropdownMenuItem>
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
        Showing {filtered.length} of {applications.length} application(s)
      </p>
    </div>
  );
}
