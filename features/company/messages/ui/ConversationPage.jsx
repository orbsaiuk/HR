"use client";

import { useRouter } from "next/navigation";
import { Star, Pin } from "lucide-react";
import { useEffect } from "react";
import { useMessages } from "@/features/shared/messaging";
import { useConversation } from "@/features/shared/messaging";
import { MessageList } from "@/features/shared/messaging";
import { MessageInput } from "@/features/shared/messaging";
import { Loading } from "@/shared/components/feedback/Loading";
import { Error } from "@/shared/components/feedback/Error";
import { PermissionGate } from "@/shared/components/auth/PermissionGate";
import { PERMISSIONS } from "@/shared/lib/permissions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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

  useEffect(() => {
    if (!messagesLoading && messages.length > 0) {
      window.dispatchEvent(
        new CustomEvent("messagesRead", { detail: { conversationId } }),
      );
    }
  }, [messagesLoading, conversationId, messages.length]);

  const handleSend = async (content) => {
    const currentUser =
      conversation?.teamMember?._id === currentUserId
        ? conversation.teamMember
        : conversation?.user;
    await sendMessage(content, currentUser);
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

  const getOtherParticipant = () => {
    if (!conversation) return null;
    const isTeamMember = conversation.teamMember?._id === currentUserId;
    return isTeamMember ? conversation.user : conversation.teamMember;
  };

  const otherParticipant = getOtherParticipant();
  const loading = messagesLoading || conversationLoading;
  const error = messagesError || conversationError;

  if (loading) return <Loading fullPage />;
  if (error) return <Error message={error} onRetry={refetch} />;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-white px-5 py-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-secondary-100">
            <AvatarImage src={otherParticipant?.avatar} alt={otherParticipant?.name} />
            <AvatarFallback className="bg-gradient-to-br from-secondary-400 to-secondary-700 text-base font-semibold text-white">
              {otherParticipant?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          <div>
            <h2 className="text-base font-bold text-slate-900">
              {otherParticipant?.name || "مستخدم غير معروف"}
            </h2>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-success-500" />
              متصل الآن
              {conversation?.relatedForm && (
                <>
                  {" • "}
                  <span className="text-secondary-700">{conversation.relatedForm.title}</span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <a
            href="#"
            className="rounded-md px-3 py-1.5 text-xs font-medium text-secondary-700 transition-colors hover:bg-secondary-50"
          >
            مشاهدة البروفايل
          </a>
          <Separator orientation="vertical" className="mx-1 h-5" />
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-secondary-700">
            <Pin size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-secondary-700">
            <Star size={16} />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-slate-50/50 p-5">
        <MessageList
          messages={messages}
          currentUserId={currentUserId}
          onRetry={handleRetry}
          onDelete={handleDelete}
        />
      </div>

      {/* Input */}
      <PermissionGate permission={PERMISSIONS.MANAGE_MESSAGES}>
        <MessageInput onSend={handleSend} disabled={sending} />
      </PermissionGate>
    </div>
  );
}
