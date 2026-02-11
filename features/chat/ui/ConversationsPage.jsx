"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useConversations } from "../model/useConversations";
import { ConversationCard } from "../components/ConversationCard";
import { MessagesSearch } from "../components/MessagesSearch";
import { MessagesEmpty } from "../components/MessagesEmpty";
import { Loading } from "@/shared/components/feedback/Loading";
import { Error } from "@/shared/components/feedback/Error";

export function ConversationsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { conversations, loading, error, refetch } = useConversations();

  // Refetch conversations when messages are read
  useEffect(() => {
    const handleMessagesRead = () => {
      refetch();
    };

    window.addEventListener("messagesRead", handleMessagesRead);

    return () => {
      window.removeEventListener("messagesRead", handleMessagesRead);
    };
  }, [refetch]);

  // Filter conversations based on search
  const filteredConversations = conversations.filter((conv) => {
    const searchLower = search.toLowerCase();
    const userName = conv.user?.name?.toLowerCase() || "";
    const formTitle = conv.relatedForm?.title?.toLowerCase() || "";
    const lastMessage = conv.lastMessage?.toLowerCase() || "";

    return (
      userName.includes(searchLower) ||
      formTitle.includes(searchLower) ||
      lastMessage.includes(searchLower)
    );
  });

  if (loading) return <Loading fullPage />;
  if (error) return <Error message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-1">View and manage your conversations</p>
      </div>

      {/* Search */}
      <MessagesSearch search={search} onSearchChange={setSearch} />

      {/* Conversations List */}
      {filteredConversations.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {filteredConversations.map((conversation) => (
            <ConversationCard
              key={conversation._id}
              conversation={conversation}
              participant={conversation.user}
              onClick={() =>
                router.push(`/dashboard/messages/${conversation._id}`)
              }
            />
          ))}
        </div>
      ) : (
        <MessagesEmpty hasSearch={!!search} isTeamMember={true} />
      )}
    </div>
  );
}
