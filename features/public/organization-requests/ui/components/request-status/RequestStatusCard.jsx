"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock, Building2 } from "lucide-react";
import { RequestStatusBadge } from "./RequestStatusBadge";
import { RequestRejectionReason } from "./RequestRejectionReason";
import { RequestApprovedActions } from "./RequestApprovedActions";

const INDUSTRY_LABELS_AR = {
  technology: "تكنولوجيا المعلومات",
  healthcare: "الرعاية الصحية",
  finance: "الخدمات المالية",
  education: "التعليم",
  retail: "التجزئة",
  manufacturing: "التصنيع",
  consulting: "الاستشارات",
  media: "الإعلام والترفيه",
  nonprofit: "غير ربحي",
  government: "حكومي",
  other: "أخرى",
};

function getIndustryLabel(industryValue) {
  if (!industryValue) return "";
  return INDUSTRY_LABELS_AR[industryValue] || industryValue;
}

export function RequestStatusCard({ request }) {
  if (!request) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building2 size={18} />
            {request.orgName}
          </CardTitle>
          <RequestStatusBadge status={request.status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {request.orgIndustry && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">المجال:</span>{" "}
              {getIndustryLabel(request.orgIndustry)}
            </div>
          )}
          {request.orgSize && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">حجم المؤسسة:</span>{" "}
              {request.orgSize}
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock size={14} />
            تم التقديم في{" "}
            {new Date(request.createdAt).toLocaleDateString("ar-SA", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

          {request.reviewedAt && (
            <div className="text-sm text-gray-500">
              تمت المراجعة في{" "}
              {new Date(request.reviewedAt).toLocaleDateString("ar-SA", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              {request.reviewedBy && ` بواسطة ${request.reviewedBy}`}
            </div>
          )}

          {request.status === "rejected" && (
            <RequestRejectionReason reason={request.rejectionReason} />
          )}

          {request.status === "approved" && <RequestApprovedActions />}

          {request.status === "pending" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-yellow-800">
                طلبك قيد المراجعة من إدارة المنصة حالياً، وسيتم إشعارك فور اتخاذ
                القرار.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
