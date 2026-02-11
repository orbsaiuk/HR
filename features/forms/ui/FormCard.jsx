/**
 * Form card component for table row
 */

import Link from "next/link";
import { FileText, MessageSquare, Calendar } from "lucide-react";
import { FormActionsMenu } from "./FormActionsMenu";
import { TableCell, TableRow } from "@/components/ui/table";

export function FormCard({ form, onAction }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <TableRow>
      <TableCell>
        <Link href={`/dashboard/forms/${form._id}`} className="block">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="text-blue-600" size={20} />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-gray-900 truncate">{form.title}</p>
              {form.description && (
                <p className="text-sm text-gray-500 truncate">
                  {form.description}
                </p>
              )}
            </div>
          </div>
        </Link>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-gray-400" />
          <span className="text-gray-900">{form.responseCount || 0}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar size={16} />
          <span>{formatDate(form.updatedAt)}</span>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <FormActionsMenu form={form} onAction={onAction} />
      </TableCell>
    </TableRow>
  );
}
