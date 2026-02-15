"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCard } from "./KanbanCard";

const PIPELINE_STAGES = [
  {
    id: "new",
    label: "New",
    color: "bg-blue-500",
    lightBg: "bg-blue-50",
    lightText: "text-blue-700",
  },
  {
    id: "screening",
    label: "Screening",
    color: "bg-yellow-500",
    lightBg: "bg-yellow-50",
    lightText: "text-yellow-700",
  },
  {
    id: "interview",
    label: "Interview",
    color: "bg-purple-500",
    lightBg: "bg-purple-50",
    lightText: "text-purple-700",
  },
  {
    id: "offered",
    label: "Offered",
    color: "bg-emerald-500",
    lightBg: "bg-emerald-50",
    lightText: "text-emerald-700",
  },
  {
    id: "hired",
    label: "Hired",
    color: "bg-green-500",
    lightBg: "bg-green-50",
    lightText: "text-green-700",
  },
  {
    id: "rejected",
    label: "Rejected",
    color: "bg-red-500",
    lightBg: "bg-red-50",
    lightText: "text-red-700",
  },
];

export function KanbanBoard({
  applications,
  positionId,
  onStatusChange,
  onDelete,
}) {
  const [activeApp, setActiveApp] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  // Group applications by status
  const columns = PIPELINE_STAGES.map((stage) => ({
    ...stage,
    items: applications
      .filter((app) => app.status === stage.id)
      .slice()
      .sort((a, b) => {
        const ratingDiff = (b.rating || 0) - (a.rating || 0);
        if (ratingDiff !== 0) return ratingDiff;
        const dateA = a.appliedAt ? new Date(a.appliedAt).getTime() : 0;
        const dateB = b.appliedAt ? new Date(b.appliedAt).getTime() : 0;
        return dateB - dateA;
      }),
  }));

  const handleDragStart = (event) => {
    const app = applications.find((a) => a._id === event.active.id);
    setActiveApp(app || null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveApp(null);

    if (!over) return;

    const appId = active.id;
    const targetStatus = over.id;

    const app = applications.find((a) => a._id === appId);
    if (!app || app.status === targetStatus) return;

    const validStage = PIPELINE_STAGES.find((s) => s.id === targetStatus);
    if (!validStage) return;

    onStatusChange(appId, targetStatus);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="overflow-x-auto h-[calc(100vh-260px)]">
        <div className="flex gap-3 min-w-max h-full mx-auto">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              label={column.label}
              color={column.color}
              lightBg={column.lightBg}
              lightText={column.lightText}
              items={column.items}
              positionId={positionId}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeApp ? (
          <KanbanCard application={activeApp} positionId={positionId} overlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export { PIPELINE_STAGES };
