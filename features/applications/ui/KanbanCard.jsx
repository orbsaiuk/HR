"use client";

import { useRef } from "react";
import { useDraggable } from "@dnd-kit/core";
import { useRouter } from "next/navigation";
import { Star, Trash2, StickyNote } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-emerald-100 text-emerald-700",
  "bg-orange-100 text-orange-700",
  "bg-pink-100 text-pink-700",
  "bg-cyan-100 text-cyan-700",
];

function getAvatarColor(name) {
  if (!name) return AVATAR_COLORS[0];
  const index = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

export function KanbanCard({ application, positionId, onDelete, overlay }) {
  const router = useRouter();
  const pointerStart = useRef(null);

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: application._id,
  });

  const name = application.applicant?.name || "Unknown";
  const initials = getInitials(name);
  const avatarColor = getAvatarColor(name);

  // Track pointer to distinguish click vs drag
  const handlePointerDown = (e) => {
    pointerStart.current = { x: e.clientX, y: e.clientY };
    listeners?.onPointerDown?.(e);
  };

  const handleClick = () => {
    // Only navigate if the pointer didn't move (wasn't a drag)
    if (!pointerStart.current) return;
    router.push(
      `/dashboard/positions/${positionId}/applications/${application._id}`,
    );
  };

  const renderRating = (rating) => {
    if (!rating) return null;
    return (
      <span className="inline-flex items-center gap-0.5">
        <Star size={10} className="fill-yellow-400 text-yellow-400" />
        <span className="text-xs font-medium">{rating}</span>
      </span>
    );
  };

  // Overlay card (shown in DragOverlay) — no ref / listeners needed
  if (overlay) {
    return (
      <div className="w-72 bg-white rounded-lg border shadow-xl ring-2 ring-blue-400 rotate-1 select-none">
        <CardContent
          name={name}
          initials={initials}
          avatarColor={avatarColor}
          application={application}
          renderRating={renderRating}
        />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      className={`group relative bg-white rounded-lg border cursor-grab active:cursor-grabbing select-none ${
        isDragging
          ? "opacity-30 shadow-none"
          : "shadow-sm hover:shadow-md hover:border-gray-300"
      }`}
    >
      <CardContent
        name={name}
        initials={initials}
        avatarColor={avatarColor}
        application={application}
        renderRating={renderRating}
      />

      {/* Quick-delete (visible on hover) */}
      {onDelete && !isDragging && (
        <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full bg-white/80 backdrop-blur-sm text-muted-foreground hover:text-destructive hover:bg-red-50"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(application._id);
            }}
          >
            <Trash2 size={12} />
          </Button>
        </div>
      )}
    </div>
  );
}

/** Shared card inner content */
function CardContent({
  name,
  initials,
  avatarColor,
  application,
  renderRating,
}) {
  return (
    <div className="px-3 py-2.5 space-y-2.5">
      <div className="flex items-center gap-2.5">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarColor}`}
        >
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
          <p className="text-[11px] text-muted-foreground truncate">
            {application.applicant?.email}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
        {renderRating(application.rating)}
        {application.notes && (
          <span className="inline-flex items-center gap-0.5" title="Has notes">
            <StickyNote size={10} />
          </span>
        )}
        <span className="ml-auto">
          {application.appliedAt
            ? formatDistanceToNow(new Date(application.appliedAt), {
                addSuffix: true,
              })
            : "—"}
        </span>
      </div>
    </div>
  );
}
