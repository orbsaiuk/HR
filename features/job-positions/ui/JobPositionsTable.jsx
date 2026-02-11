"use client";

import Link from "next/link";
import {
  Trash2,
  Eye,
  MoreVertical,
  Play,
  Pause,
  XCircle,
  MapPin,
  Calendar,
  FileText,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

const STATUS_VARIANT = {
  draft: "secondary",
  open: "default",
  "on-hold": "outline",
  closed: "destructive",
};

const STATUS_LABELS = {
  draft: "Draft",
  open: "Open",
  "on-hold": "On Hold",
  closed: "Closed",
};

const TYPE_LABELS = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  internship: "Internship",
  remote: "Remote",
};

export function JobPositionsTable({ positions, onDelete, onStatusChange }) {
  const formatSalary = (min, max, currency) => {
    if (!min && !max) return null;
    const fmt = (n) => n?.toLocaleString();
    if (min && max) return `${currency} ${fmt(min)} - ${fmt(max)}`;
    if (min) return `${currency} ${fmt(min)}+`;
    return `Up to ${currency} ${fmt(max)}`;
  };

  const isDeadlinePassed = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Position</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Applications</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {positions.map((position) => {
            const statusVariant =
              STATUS_VARIANT[position.status] || "secondary";
            const statusLabel =
              STATUS_LABELS[position.status] || position.status;
            const salary = formatSalary(
              position.salaryMin,
              position.salaryMax,
              position.currency || "USD",
            );
            const deadlinePassed = isDeadlinePassed(position.deadline);

            return (
              <TableRow key={position._id}>
                <TableCell>
                  <div>
                    <Link
                      href={`/dashboard/positions/${position._id}`}
                      className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {position.title}
                    </Link>
                    <div className="flex items-center gap-3 mt-1">
                      {position.department && (
                        <span className="text-xs text-muted-foreground">
                          {position.department}
                        </span>
                      )}
                      {position.location && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin size={10} />
                          {position.location}
                        </span>
                      )}
                      {salary && (
                        <span className="text-xs text-muted-foreground">
                          {salary}
                        </span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant}>{statusLabel}</Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {TYPE_LABELS[position.type] || position.type}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Users size={14} />
                    {position.applicationCount || 0}
                  </span>
                </TableCell>
                <TableCell>
                  {position.deadline ? (
                    <span
                      className={`flex items-center gap-1.5 text-sm ${deadlinePassed ? "text-destructive" : "text-muted-foreground"}`}
                    >
                      <Calendar size={14} />
                      {new Date(position.deadline).toLocaleDateString()}
                      {deadlinePassed && (
                        <span className="text-xs">(expired)</span>
                      )}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/positions/${position._id}`}>
                          <Eye size={14} />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      {position.form && (
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/forms/${position.form._id}`}>
                            <FileText size={14} />
                            View Form
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      {position.status !== "open" && (
                        <DropdownMenuItem
                          onClick={() => onStatusChange(position._id, "open")}
                          className="text-green-600 focus:text-green-600"
                        >
                          <Play size={14} />
                          Open Position
                        </DropdownMenuItem>
                      )}
                      {position.status === "open" && (
                        <DropdownMenuItem
                          onClick={() =>
                            onStatusChange(position._id, "on-hold")
                          }
                          className="text-yellow-600 focus:text-yellow-600"
                        >
                          <Pause size={14} />
                          Put On Hold
                        </DropdownMenuItem>
                      )}
                      {position.status !== "closed" && (
                        <DropdownMenuItem
                          onClick={() => onStatusChange(position._id, "closed")}
                          className="text-orange-600 focus:text-orange-600"
                        >
                          <XCircle size={14} />
                          Close Position
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(position._id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 size={14} />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
