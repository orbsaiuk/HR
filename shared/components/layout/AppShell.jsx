"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "@/features/landing/ui/Footer";

/**
 * Persistent shell rendered in the root layout.
 * Renders Header and Footer on every route except those that have
 * their own chrome (company area, studio, auth pages).
 *
 * Because this lives in the root layout it is NEVER unmounted during
 * client-side navigation, preventing the header/footer flicker that
 * occurs when they are duplicated across sibling route-group layouts.
 */
const SHELL_EXCLUDED_PREFIXES = ["/company", "/studio", "/sign-in", "/sign-up"];

export function AppShell({ children }) {
  const pathname = usePathname();

  const showShell = !SHELL_EXCLUDED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (!showShell) {
    return children;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
