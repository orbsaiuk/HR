/**
 * User messages hook
 * Manages user conversations list and filtering
 */

import { useState, useEffect, useMemo } from "react";
import { userMessagesApi } from "../api/userMessagesApi";

export function useUserMessages() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await userMessagesApi.getConversations();
      setConversations(data);
    } catch (err) {
      console.error("Error fetching conversations:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = useMemo(() => {
    if (!search) return conversations;

    const searchLower = search.toLowerCase();
    return conversations.filter(
      (conv) =>
        conv.teamMember?.name?.toLowerCase().includes(searchLower) ||
        conv.teamMember?.email?.toLowerCase().includes(searchLower),
    );
  }, [conversations, search]);

  return {
    conversations: filteredConversations,
    loading,
    search,
    setSearch,
    refetch: fetchConversations,
  };
}
