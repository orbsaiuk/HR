"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function CompanyProjectCard({ project, onEdit, onDelete }) {
  return (
    <article
      className="rounded-sm border border-[#E6EAF2] bg-white px-3 py-3 sm:px-5 sm:py-4"
      dir="rtl"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="min-w-0 flex-1 text-right">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-bold text-[#5E667A] sm:text-xl">
              {project.title}
            </h2>
            <Badge className="border-transparent bg-[#FFF4EA] text-[#EEA34C] hover:bg-[#FFF4EA]">
              {project.status}
            </Badge>
            <Badge className="border-transparent bg-[#F2F4F8] text-[#8D93A4] hover:bg-[#F2F4F8]">
              {project.category}
            </Badge>
          </div>

          <p className="mt-1 text-sm font-medium text-[#EC8E99]">
            {project.location}
          </p>

          <p className="mt-2 text-sm leading-6 text-[#7D8598]">
            {project.description}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm font-medium text-[#4F596F]">
            <span>{project.duration}</span>
            <span>{project.budgetRange}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 text-sm sm:shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-auto px-1 py-0 text-[#7A8397] hover:bg-transparent hover:text-[#5E667A]"
            onClick={() => onEdit?.(project)}
          >
            <Pencil className="ms-1 h-3.5 w-3.5" />
            تعديل
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-auto px-1 py-0 text-[#EA4F4A] hover:bg-transparent hover:text-[#D83F3A]"
            onClick={() => onDelete?.(project)}
          >
            <Trash2 className="ms-1 h-3.5 w-3.5" />
            حذف
          </Button>
        </div>
      </div>
    </article>
  );
}
