"use client";

import { LayoutGrid, Table as TableIcon } from "lucide-react";

export function ApplicationsViewToggle({ view, onViewChange }) {
  return (
    <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
      <button
        onClick={() => onViewChange("kanban")}
        className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
          view === "kanban"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-muted-foreground hover:text-gray-700"
        }`}
      >
        <LayoutGrid size={14} />
        Board
      </button>
      <button
        onClick={() => onViewChange("table")}
        className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
          view === "table"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-muted-foreground hover:text-gray-700"
        }`}
      >
        <TableIcon size={14} />
        Table
      </button>
    </div>
  );
}
