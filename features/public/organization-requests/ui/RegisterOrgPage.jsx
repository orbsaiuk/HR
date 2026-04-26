"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2, Loader2, Sparkles } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useOrgRequest } from "../model/useOrgRequest";
import { OrgRegistrationWizard } from "./components/registration-form/OrgRegistrationWizard";

/**
 * Orchestrator page for organization registration.
 * Thin wrapper — delegates form rendering to OrgRegistrationWizard.
 * Note: Sign-in is required via middleware, so no auth check needed here.
 */
export function RegisterOrgPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { requests, loading, submitRequest, submitting, error } =
    useOrgRequest();
  const [success, setSuccess] = useState(false);

  // Find any existing request (pending or approved)
  const existingRequest = requests.find(
    (r) => r.status === "pending" || r.status === "approved",
  );

  // Redirect to status page if user already has a pending/approved request
  useEffect(() => {
    if (!loading && existingRequest) {
      router.replace("/user/organization-requests");
    }
  }, [loading, existingRequest, router]);

  // Show enhanced loading state while checking for existing request or redirecting
  if (!isLoaded || loading || existingRequest) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-500">
          <div className="relative">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <div className="absolute inset-0 h-12 w-12 rounded-full bg-primary/20 animate-ping" />
          </div>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (data) => {
    try {
      await submitRequest(data);
      setSuccess(true);
      // Redirect to status page after short delay
      setTimeout(() => {
        router.push("/user/organization-requests");
      }, 2000);
    } catch {
      // Error is handled by the hook
    }
  };

  // Show enhanced success message with animation
  if (success) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center">
        <Card className="border-green-200 shadow-lg animate-in zoom-in duration-500">
          <CardContent className="pt-10 pb-10 flex flex-col items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 animate-ping">
                <div className="h-20 w-20 rounded-full bg-green-500/20" />
              </div>
              <div className="relative bg-green-100 dark:bg-green-900/30 p-4 rounded-full">
                <Building2
                  size={48}
                  className="text-green-600 dark:text-green-500"
                />
              </div>
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-green-900 dark:text-green-100 flex items-center justify-center gap-2">
                <Sparkles size={24} className="text-green-600" />
                تم إرسال الطلب بنجاح!
              </h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                تم استلام طلب تسجيل مؤسستك. سيقوم مسؤول المنصة بمراجعته قريباً
                وسنرسل لك إشعاراً عند اتخاذ القرار.
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
                <Loader2 size={14} className="animate-spin" />
                <span>جاري التوجيه إلى صفحة الحالة...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Enhanced header with gradient and better typography */}
      <div className="mb-10 space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-lg">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              تسجيل مؤسسة جديدة
            </h1>
          </div>
        </div>
        <p className="text-muted-foreground leading-relaxed max-w-2xl">
          قدم طلباً لتسجيل مؤسستك على المنصة. بعد الموافقة ستتمكن من إدارة فريقك
          ونشر الوظائف والمزيد. املأ النموذج أدناه بعناية.
        </p>
      </div>

      {/* Enhanced error alert with animation */}
      {error && (
        <Alert
          variant="destructive"
          className="mb-6 animate-in slide-in-from-top-2 duration-500 border-l-4"
        >
          <AlertDescription className="font-medium">{error}</AlertDescription>
        </Alert>
      )}

      <OrgRegistrationWizard
        onSubmit={handleSubmit}
        submitting={submitting}
        userId={user?.id}
      />
    </div>
  );
}
