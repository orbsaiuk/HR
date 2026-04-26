"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHasDraft } from "@/features/public/organization-requests/model/useHasDraft";
import { ORG_REGISTRATION_FORM_ID } from "@/features/public/organization-requests/model/orgDraftStorage";

export function ContinueRegistrationBanner({
  userId,
  isSignedIn,
  isUserLoaded,
  isTeamMember,
  hasOrgRequest,
}) {
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(false);
  const { hasDraft, draftAge } = useHasDraft({
    formId: ORG_REGISTRATION_FORM_ID,
    userId,
    enabled: Boolean(isSignedIn && isUserLoaded && !isTeamMember),
  });

  const isBusinessUser = Boolean(isTeamMember);
  const isRegistrationPage = pathname.startsWith("/register-organization");

  if (!isUserLoaded) {
    return null;
  }

  if (
    !isSignedIn ||
    !userId ||
    isRegistrationPage ||
    isBusinessUser ||
    hasOrgRequest ||
    !hasDraft ||
    dismissed
  ) {
    return null;
  }

  return (
    <div className="border-t border-amber-200 bg-amber-50/80">
      <div className="container mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        <p className="text-sm text-amber-900 font-medium">
          لديك طلب تسجيل محفوظ
          {draftAge ? ` (${draftAge})` : ""}
        </p>

        <div className="flex items-center gap-2">
          <Link href="/register-organization">
            <Button
              size="sm"
              className="h-8 rounded-full bg-amber-600 hover:bg-amber-700 text-white"
            >
              اكمل التسجيل
            </Button>
          </Link>

          <button
            type="button"
            aria-label="إخفاء تنبيه متابعة التسجيل"
            onClick={() => setDismissed(true)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-amber-800 hover:bg-amber-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
