"use client";

import { useState } from "react";
import { useSession } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Briefcase, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const ACCOUNT_TYPES = [
  {
    value: "jobSeeker",
    label: "باحث عن عمل",
    description: "أبحث عن فرص عمل وأريد التقديم على الوظائف المتاحة",
    icon: Briefcase,
  },
  {
    value: "freelancer",
    label: "مستقل",
    description: "أعمل كمستقل وأبحث عن مشاريع ومهام للعمل عليها",
    icon: Laptop,
  },
];

export function AccountTypeSelector() {
  const [selected, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { session } = useSession();
  const router = useRouter();

  async function handleSubmit() {
    if (!selected) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/account-type", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountType: selected }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "فشل في حفظ نوع الحساب");
      }

      // Reload session so publicMetadata reflects the new accountType
      if (session) {
        await session.reload();
      }

      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">اختر نوع حسابك</h1>
          <p className="text-gray-500">
            حدد الدور الذي يناسبك للحصول على تجربة مخصصة
          </p>
        </div>

        {/* Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ACCOUNT_TYPES.map((type) => {
            const Icon = type.icon;
            const isSelected = selected === type.value;

            return (
              <Card
                key={type.value}
                role="button"
                tabIndex={0}
                onClick={() => setSelected(type.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelected(type.value);
                  }
                }}
                className={cn(
                  "relative cursor-pointer p-6 transition-all hover:shadow-md",
                  isSelected
                    ? "ring-2 ring-[#5286A5] border-[#5286A5] bg-blue-50/30"
                    : "border-gray-200 hover:border-gray-300",
                )}
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div
                    className={cn(
                      "rounded-full p-4",
                      isSelected
                        ? "bg-[#5286A5]/10 text-[#5286A5]"
                        : "bg-gray-100 text-gray-500",
                    )}
                  >
                    <Icon size={32} />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {type.label}
                    </h2>
                    <p className="text-sm text-gray-500">{type.description}</p>
                  </div>
                </div>

                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-3 start-3 h-5 w-5 rounded-full bg-[#5286A5] flex items-center justify-center">
                    <svg
                      className="h-3 w-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <p className="text-center text-sm text-red-600">{error}</p>
        )}

        {/* Note about permanence */}
        <p className="text-center text-xs text-gray-400">
          هذا الاختيار نهائي ولا يمكن تغييره لاحقاً
        </p>

        {/* Submit */}
        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={!selected || submitting}
            className="rounded-full px-10 py-3 bg-[#5286A5] hover:bg-[#456f8a] text-white"
          >
            {submitting ? "جارٍ الحفظ..." : "متابعة"}
          </Button>
        </div>
      </div>
    </div>
  );
}
