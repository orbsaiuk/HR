"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUserMessages } from "../model/useUserMessages";
import { Loading } from "@/shared/components/feedback/Loading";
import { formatRelativeDateAr } from "@/shared/utils/dateUtils";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function MessagesSidebar() {
  const router = useRouter();
  const params = useParams();
  const activeId = params?.id;
  const { conversations, loading, search, setSearch, refetch } =
    useUserMessages();

  const handleConversationClick = (conversationId) => {
    router.push(`/messages/${conversationId}`);
  };

  useEffect(() => {
    const handleMessagesRead = () => {
      if (refetch) refetch();
    };
    window.addEventListener("messagesRead", handleMessagesRead);
    return () => {
      window.removeEventListener("messagesRead", handleMessagesRead);
    };
  }, [refetch]);

  return (
    <aside className="flex w-[360px] min-w-[300px] flex-col overflow-hidden border-l border-slate-100 bg-white">
      {/* Search */}
      <div className="border-b border-slate-100 p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            type="text"
            placeholder="البحث"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-right"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loading />
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
            {search ? "لا توجد محادثات مطابقة" : "لا توجد محادثات بعد"}
          </div>
        ) : (
          conversations.map((conv) => {
            const participant = conv.teamMember;
            const isActive = activeId === conv._id;

            return (
              <button
                key={conv._id}
                onClick={() => handleConversationClick(conv._id)}
                className={`flex w-full items-center gap-3 border-b border-slate-50 px-4 py-3 text-right transition-colors ${
                  isActive
                    ? "bg-secondary-50 hover:bg-secondary-100"
                    : "hover:bg-slate-50"
                }`}
              >
                <Avatar className="h-11 w-11 shrink-0">
                  <AvatarImage src={participant?.avatar} alt={participant?.name} />
                  <AvatarFallback className="bg-gradient-to-br from-secondary-400 to-secondary-700 text-sm font-semibold text-white">
                    {participant?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {conv.unreadCount > 0 && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-secondary-700" />
                      )}
                      <span className="truncate text-sm font-semibold text-slate-900">
                        {participant?.name || "مستخدم غير معروف"}
                      </span>
                    </div>
                    {conv.lastMessageAt && (
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatRelativeDateAr(conv.lastMessageAt)}
                      </span>
                    )}
                  </div>
                  <p
                    className={`truncate text-xs ${
                      conv.unreadCount > 0
                        ? "font-semibold text-slate-700"
                        : "text-muted-foreground"
                    }`}
                  >
                    {conv.lastMessage || "ابدأ محادثة"}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
