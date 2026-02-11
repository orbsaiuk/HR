/**
 * Shared empty state for messages
 */

import { MessageSquare } from "lucide-react";
import { EmptyState } from "@/shared/components/feedback/EmptyState";

export function MessagesEmpty({ hasSearch, isTeamMember = false }) {
  if (hasSearch) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No conversations found"
        description="Try adjusting your search terms"
      />
    );
  }

  return (
    <EmptyState
      icon={MessageSquare}
      title="No conversations yet"
      description={
        isTeamMember
          ? "Start a conversation with a candidate to see it here"
          : "Your conversations with team members will appear here"
      }
    />
  );
}
