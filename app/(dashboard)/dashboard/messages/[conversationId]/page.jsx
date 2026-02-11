/**
 * Conversation detail page - Clean Architecture implementation
 */

"use client";

import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { ConversationPage } from "@/features/chat";
import { Loading } from "@/shared/components/feedback/Loading";

export default function Page() {
  const params = useParams();
  const { user } = useUser();
  const [sanityUserId, setSanityUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSanityUserId() {
      if (!user?.id) return;

      try {
        // Determine user type from role
        const role = user.publicMetadata?.role;
        const userType = role === "teamMember" ? "teamMember" : "user";

        // Fetch Sanity user ID
        const response = await fetch(
          `/api/auth/sanity-user?clerkId=${user.id}&type=${userType}`,
        );
        const data = await response.json();

        if (data.sanityUserId) {
          setSanityUserId(data.sanityUserId);
        }
      } catch (error) {
        console.error("Error fetching Sanity user ID:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSanityUserId();
  }, [user?.id]);

  if (loading) return <Loading fullPage />;

  return (
    <ConversationPage
      conversationId={params.conversationId}
      currentUserId={sanityUserId}
    />
  );
}
