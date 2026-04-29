"use client";

import { useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FreelancerProfileEditDialog,
  ProfileContent,
  ProfileHeader,
  ProfileSidebar,
} from "../components";
import { useFreelancerProfile } from "../../model/useFreelancerProfile";

export function FreelancerProfilePage() {
  const {
    profile,
    loading,
    error,
    updateProfile,
    uploadPortfolioImage,
    saving,
    refetch,
  } = useFreelancerProfile();

  const [editSection, setEditSection] = useState(null);
  const isEditDialogOpen = Boolean(editSection);

  function handleEdit(section) {
    setEditSection(section);
  }

  function handleCloseDialog() {
    setEditSection(null);
  }

  async function handleSave(payload) {
    try {
      await updateProfile(payload);
      toast.success("تم حفظ التغييرات بنجاح");
    } catch (err) {
      toast.error(err.message || "فشل حفظ التغييرات");
      throw err;
    }
  }

  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen p-3 sm:p-4 lg:p-6">
        <Skeleton className="mb-4 h-8 w-32 sm:mb-6" />
        <Skeleton className="mb-4 h-28 rounded-2xl sm:mb-6" />
        <div
          className="grid gap-4 sm:gap-6 lg:grid-cols-[19rem_minmax(0,1fr)]"
          style={{ direction: "ltr" }}
        >
          <aside dir="rtl" className="order-2 space-y-4 sm:space-y-6 lg:order-1">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-40 rounded-2xl" />
          </aside>
          <section
            dir="rtl"
            className="order-1 space-y-4 sm:space-y-6 lg:order-2"
          >
            <Skeleton className="h-72 rounded-2xl" />
            <Skeleton className="h-44 rounded-2xl" />
            <Skeleton className="h-56 rounded-2xl" />
          </section>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        dir="rtl"
        className="flex min-h-[60vh] items-center justify-center p-6 text-center"
      >
        <Card className="w-full max-w-md rounded-2xl border-red-100 p-6 shadow-none">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
            <AlertCircle className="h-6 w-6" />
          </div>
          <p className="text-base font-bold text-slate-800">
            تعذر تحميل البروفايل
          </p>
          <p className="mt-2 break-words text-sm text-slate-500">{error}</p>
          {refetch ? (
            <Button type="button" className="mt-5 rounded-xl" onClick={refetch}>
              <RefreshCw className="h-4 w-4" />
              إعادة المحاولة
            </Button>
          ) : null}
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 text-center text-slate-500">
        لم يتم العثور على البروفايل
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen p-3 sm:p-4 lg:p-6">
      <header className="mb-4 flex flex-col gap-3 px-1 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:px-2">
        <h1 className="text-xl font-bold text-[#1F2937] sm:text-2xl lg:text-3xl">
          البروفايل
        </h1>
      </header>

      <div
        className="grid gap-4 sm:gap-6 lg:grid-cols-[19rem_minmax(0,1fr)]"
        style={{ direction: "ltr" }}
      >
        <aside dir="rtl" className="order-2 space-y-4 sm:space-y-6 lg:order-1">
          <ProfileSidebar profile={profile} onEdit={handleEdit} />
        </aside>

        <section
          dir="rtl"
          className="order-1 space-y-4 sm:space-y-6 lg:order-2"
        >
          <ProfileHeader
            profile={profile}
            onEdit={() => handleEdit("header")}
          />
          <ProfileContent profile={profile} onEdit={handleEdit} />
        </section>
      </div>

      <FreelancerProfileEditDialog
        open={isEditDialogOpen}
        onOpenChange={handleCloseDialog}
        section={editSection}
        profile={profile}
        saving={saving}
        onSave={handleSave}
        onUploadPortfolioImage={uploadPortfolioImage}
      />
    </div>
  );
}
