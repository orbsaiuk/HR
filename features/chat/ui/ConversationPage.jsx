"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useMessages } from "../model/useMessages";
import { useConversation } from "../model/useConversation";
import { MessageList } from "../components/MessageList";
import { MessageInput } from "../components/MessageInput";
import { Loading } from "@/shared/components/feedback/Loading";
import { Error } from "@/shared/components/feedback/Error";
import { PermissionGate } from "@/shared/components/auth/PermissionGate";
import { PERMISSIONS } from "@/shared/lib/permissions";

export function ConversationPage({ conversationId, currentUserId }) {
  const router = useRouter();
  const {
    messages,
    loading: messagesLoading,
    error: messagesError,
    sending,
    sendMessage,
    retryMessage,
    deleteMessage,
    refetch,
  } = useMessages(conversationId);
  const {
    conversation,
    loading: conversationLoading,
    error: conversationError,
  } = useConversation(conversationId);

  // Trigger a storage event when messages are marked as read
  useEffect(() => {
    if (!messagesLoading && messages.length > 0) {
      // Notify other components that messages were read
      window.dispatchEvent(
        new CustomEvent("messagesRead", { detail: { conversationId } }),
      );
    }
  }, [messagesLoading, conversationId, messages.length]);

  const handleSend = async (content) => {
    // Get current user info for optimistic update
    const currentUser =
      conversation?.teamMember?._id === currentUserId
        ? conversation.teamMember
        : conversation?.user;

    await sendMessage(content, currentUser);
    // Errors are shown inline in the message bubble
  };

  const handleRetry = async (messageId) => {
    const currentUser =
      conversation?.teamMember?._id === currentUserId
        ? conversation.teamMember
        : conversation?.user;

    await retryMessage(messageId, currentUser);
  };

  const handleDelete = (messageId) => {
    deleteMessage(messageId);
  };

  // Determine the other participant based on current user
  const getOtherParticipant = () => {
    if (!conversation) return null;

    // Check if current user is the team member
    const isTeamMember = conversation.teamMember?._id === currentUserId;
    return isTeamMember ? conversation.user : conversation.teamMember;
  };

  const otherParticipant = getOtherParticipant();
  const loading = messagesLoading || conversationLoading;
  const error = messagesError || conversationError;

  if (loading) return <Loading fullPage />;
  if (error) return <Error message={error} onRetry={refetch} />;

  return (
    <div className="flex flex-col h-[calc(100vh-70px)]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>

          {/* Avatar */}
          <div className="relative">
            {otherParticipant?.avatar ? (
              <img
                src={otherParticipant.avatar}
                alt={otherParticipant.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-100"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-semibold text-lg">
                  {otherParticipant?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h2 className="font-semibold text-gray-900 text-lg">
              {otherParticipant?.name || "Unknown User"}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {conversation?.relatedForm && (
                <span className="text-blue-600 font-medium">
                  {conversation.relatedForm.title}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <MessageList
          messages={messages}
          currentUserId={currentUserId}
          onRetry={handleRetry}
          onDelete={handleDelete}
        />
      </div>

      {/* Input */}
      <PermissionGate permission={PERMISSIONS.MANAGE_MESSAGES}>
        <div className="bg-white">
          <MessageInput onSend={handleSend} disabled={sending} />
        </div>
      </PermissionGate>
    </div>
  );
}
