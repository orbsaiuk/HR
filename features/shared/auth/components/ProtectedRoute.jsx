"use client";

import { useAuth, useClerk } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function ProtectedRoute({ children }) {
  const { isLoaded, userId } = useAuth();
  const { openSignIn } = useClerk();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoaded && !userId) {
      openSignIn({
        forceRedirectUrl: pathname,
      });
    }
  }, [isLoaded, userId, openSignIn, pathname]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!userId) {
    return null;
  }

  return <>{children}</>;
}
