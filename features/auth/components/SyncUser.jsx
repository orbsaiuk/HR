"use client";

import { useEffect, useState, useRef } from "react";
import { useUser, useSession } from "@clerk/nextjs";
import { AutoActivateOrg } from "./AutoActivateOrg";

export function SyncUser({ children }) {
  const { user, isLoaded } = useUser();
  const { session } = useSession();
  const [synced, setSynced] = useState(false);
  const syncAttempted = useRef(false);

  useEffect(() => {
    async function sync() {
      if (!isLoaded || !user?.id || syncAttempted.current) return;
      syncAttempted.current = true;

      try {
        const res = await fetch("/api/auth/sync", { method: "POST" });
        if (!res.ok) throw new Error("Sync failed");

        // If user doesn't have a role yet, reload the session
        // to pick up any role changes made by the sync (e.g. invited team member)
        const currentRole = user.publicMetadata?.role;
        if (!currentRole) {
          // Reload session to get updated metadata
          if (session) {
            await session.reload();
          }
        }
      } catch (err) {
        console.error("User sync error:", err);
      } finally {
        setSynced(true);
      }
    }

    sync();
  }, [isLoaded, user?.id]);

  if (!synced && isLoaded && user?.id) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <AutoActivateOrg />
      {children}
    </>
  );
}
