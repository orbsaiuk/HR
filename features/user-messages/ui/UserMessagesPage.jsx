/**
 * User messages page component
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserMessages } from "../model/useUserMessages";
import { ConversationCard } from "@/features/chat/components/ConversationCard";
import { MessagesSearch } from "@/features/chat/components/MessagesSearch";
import { MessagesEmpty } from "@/features/chat/components/MessagesEmpty";
import { Loading } from "@/shared/components/feedback/Loading";

export function UserMessagesPage() {
  const router = useRouter();
  const { conversations, loading, search, setSearch, refetch } =
    useUserMessages();

  const handleConversationClick = (conversationId) => {
    router.push(`/messages/${conversationId}`);
  };

  // Refetch conversations when messages are read
  useEffect(() => {
    const handleMessagesRead = () => {
      if (refetch) refetch();
    };

    window.addEventListener("messagesRead", handleMessagesRead);

    return () => {
      window.removeEventListener("messagesRead", handleMessagesRead);
    };
  }, [refetch]);

  if (loading) return <Loading fullPage />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-1">
          Your conversations with team members
        </p>
      </div>

      <MessagesSearch search={search} onSearchChange={setSearch} />

      {conversations.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {conversations.map((conv) => (
            <ConversationCard
              key={conv._id}
              conversation={conv}
              participant={conv.teamMember}
              onClick={() => handleConversationClick(conv._id)}
            />
          ))}
        </div>
      ) : (
        <MessagesEmpty hasSearch={!!search} isTeamMember={false} />
      )}
    </div>
  );
}
