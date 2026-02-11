/**
 * Form actions dropdown menu
 */

"use client";

import Link from "next/link";
import {
  MoreVertical,
  Eye,
  Edit,
  Share2,
  Trash2,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function FormActionsMenu({ form, onAction }) {
  const handleAction = (action) => {
    onAction(action, form._id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link
            href={`/dashboard/forms/${form._id}`}
            className="flex items-center"
          >
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={`/dashboard/forms/${form._id}/edit`}
            className="flex items-center"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={`/dashboard/forms/${form._id}/responses`}
            className="flex items-center"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Responses
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={`/dashboard/forms/${form._id}/analytics`}
            className="flex items-center"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Analytics
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={`/dashboard/forms/${form._id}/share`}
            className="flex items-center"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleAction("delete")}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
