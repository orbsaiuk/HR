"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useConversations } from "@/features/shared/messaging";
import { ConversationCard } from "@/features/shared/messaging";
import { MessagesSearch } from "@/features/shared/messaging";
import { MessagesEmpty } from "@/features/shared/messaging";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-32" />
          <Skeleton className="mt-1 h-5 w-48" />
        </div>
        <Skeleton className="h-10 w-full rounded-lg" />
        <Card className="rounded-lg">
          <CardContent className="p-0">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-4 border-b border-gray-100 last:border-0">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }
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
                router.push(`/company/messages/${conversation._id}`)
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
