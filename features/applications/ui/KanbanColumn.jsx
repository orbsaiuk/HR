"use client";

import { useDroppable } from "@dnd-kit/core";
import { KanbanCard } from "./KanbanCard";

export function KanbanColumn({
  id,
  label,
  color,
  lightBg,
  lightText,
  items,
  positionId,
  onDelete,
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`shrink-0 w-72 h-full flex flex-col rounded-xl border bg-gray-50/80 transition-colors snap-start ${
        isOver
          ? "ring-2 ring-inset ring-blue-400 bg-blue-50/40"
          : "hover:bg-gray-50"
      }`}
    >
      {/* Column header */}
      <div className="sticky top-0 z-10 flex items-center gap-2 px-3 py-2.5 border-b bg-white/90 backdrop-blur-sm rounded-t-xl">
        <div className={`w-2 h-2 rounded-full ${color}`} />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {label}
        </h3>
        <span
          className={`ml-auto text-xs font-bold rounded-full px-2 py-0.5 ${lightBg || "bg-gray-100"} ${lightText || "text-gray-600"}`}
        >
          {items.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex-1 p-2 space-y-2 min-h-35 overflow-y-auto">
        {items.length === 0 ? (
          <div
            className={`flex flex-col items-center justify-center h-28 text-xs rounded-lg border-2 border-dashed transition-colors ${
              isOver
                ? "border-blue-300 bg-blue-50/50 text-blue-500"
                : "border-gray-200 text-muted-foreground"
            }`}
          >
            <span>{isOver ? "Drop to move here" : "No candidates"}</span>
          </div>
        ) : (
          items.map((app) => (
            <KanbanCard
              key={app._id}
              application={app}
              positionId={positionId}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
