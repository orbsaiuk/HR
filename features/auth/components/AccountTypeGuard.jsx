"use client";

import { useUser } from "@clerk/nextjs";
import { AccountTypeSelector } from "./AccountTypeSelector";

/**
 * Guard that shows the AccountTypeSelector if the signed-in user
 * hasn't chosen an account type yet.
 *
 * Team members (role === "teamMember") skip this entirely — their
 * experience is defined by their organization role, not account type.
 */
export function AccountTypeGuard({ children }) {
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user) {
    return <>{children}</>;
  }

  const role = user.publicMetadata?.role;
  const accountType = user.publicMetadata?.accountType;

  // Team members don't need an account type
  if (role === "teamMember") {
    return <>{children}</>;
  }

  // If no account type selected yet, show the selector
  if (!accountType) {
    return <AccountTypeSelector />;
  }

  return <>{children}</>;
}
