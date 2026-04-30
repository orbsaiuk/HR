"use client";

import { Download, X } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { toast } from "sonner";
import { useState } from "react";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ContractStatusBadge } from "./ContractStatusBadge";

/** Format a numeric amount with Arabic locale */
function formatAmount(amount, currency = "EGP") {
  const num = Number(amount);
  if (isNaN(num)) return `${amount} ${currency}`;
  return new Intl.NumberFormat("ar-EG").format(num);
}

/** Format a date string in Arabic, returns "—" for invalid/empty dates */
function fmtDate(d) {
  if (!d) return "—";
  try {
    return format(new Date(d), "dd MMMM yyyy", { locale: ar });
  } catch {
    return "—";
  }
}

/**
 * Detail sheet for a freelancer contract.
 * Receives the contract from the parent — no internal fetching.
 *
 * @param {{
 *   contract: object | null,
 *   open: boolean,
 *   onClose: () => void,
 *   onUpdateStatus: (id: string, status: string) => void,
 *   updating: boolean,
 * }} props
 */
export function FreelancerContractDetailSheet({
  contract,
  open,
  onClose,
  onUpdateStatus,
  updating,
}) {
  if (!contract) return null;

  const {
    title,
    type,
    category,
    status,
    formData = {},
    clauses = [],
    organization,
    createdAt,
  } = contract;

  const contractKey = contract.id ?? contract._id;
  const isReceived = status === "received";

  const compensationAmount = formatAmount(
    formData.compensationAmount,
    formData.compensationCurrency,
  );

  const penaltyAmount =
    formData.penaltyClauseAmount > 0
      ? formatAmount(formData.penaltyClauseAmount, formData.penaltyClauseCurrency)
      : null;

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!contractKey) return;
    setIsDownloading(true);
    const toastId = toast.loading("جاري تحميل العقد PDF...");

    try {
      const response = await fetch(API_ENDPOINTS.FREELANCER_CONTRACT_DOWNLOAD_PDF(contractKey), {
        method: "GET",
      });

      if (!response.ok) {
        let errorMessage = "فشل في تحميل العقد PDF";
        try {
          const errorBody = await response.json();
          errorMessage = errorBody?.error || errorBody?.message || errorMessage;
        } catch {}
        throw new Error(errorMessage);
      }

      const blob = await response.blob();
      
      let fileName = "contract.pdf";
      const contentDisposition = response.headers.get("content-disposition");
      if (contentDisposition) {
        const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
        if (utf8Match?.[1]) {
          try { fileName = decodeURIComponent(utf8Match[1]); } catch {}
        } else {
          const basicMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
          if (basicMatch?.[1]) fileName = basicMatch[1];
        }
      }

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);

      toast.success("تم تحميل العقد بنجاح", { id: toastId });
    } catch (error) {
      console.error("Download error:", error);
      toast.error(error.message || "حدث خطأ أثناء تحميل العقد", { id: toastId });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader className="space-y-3 pb-2">
          <div className="flex items-start justify-between gap-3">
            <DialogTitle className="text-right text-lg font-bold leading-tight">
              {title || "تفاصيل العقد"}
            </DialogTitle>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ContractStatusBadge status={status} />
            {category && (
              <Badge variant="secondary" className="text-xs">
                {category}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-5 text-sm">
          {/* Company info */}
          <section className="space-y-2">
            <h4 className="font-bold text-slate-700">الجهة الطارحة</h4>
            <div className="rounded-xl bg-slate-50 p-3 text-slate-600">
              <p className="font-semibold">{organization?.name || "—"}</p>
              {formData.firstPartyCompanyName && (
                <p className="mt-0.5 text-xs">{formData.firstPartyCompanyName}</p>
              )}
              {formData.firstPartyLegalRepresentative && (
                <p className="mt-0.5 text-xs">
                  الممثل القانوني: {formData.firstPartyLegalRepresentative}
                </p>
              )}
            </div>
          </section>

          <Separator />

          {/* Job details */}
          <section className="space-y-2">
            <h4 className="font-bold text-slate-700">تفاصيل الوظيفة</h4>
            <dl className="space-y-1.5">
              {[
                ["المسمى الوظيفي", formData.jobTitle],
                ["نوع العقد", type],
                ["مدة العقد", formData.contractDuration],
                ["تاريخ البدء", fmtDate(formData.startDate)],
                ["تاريخ الانتهاء", fmtDate(formData.endDate)],
              ].map(([label, value]) =>
                value && value !== "—" ? (
                  <div key={label} className="flex justify-between">
                    <dt className="text-slate-500">{label}</dt>
                    <dd className="font-semibold">{value}</dd>
                  </div>
                ) : null,
              )}
            </dl>
          </section>

          <Separator />

          {/* Compensation */}
          <section className="space-y-2">
            <h4 className="font-bold text-slate-700">التعويض المالي</h4>
            <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-3">
              <span className="text-slate-600">المقابل المالي</span>
              <span className="text-lg font-black text-emerald-700">
                {compensationAmount}
              </span>
            </div>
            {penaltyAmount && (
              <div className="flex items-center justify-between rounded-xl bg-red-50 p-3">
                <span className="text-slate-600">الشرط الجزائي</span>
                <span className="font-semibold text-red-700">{penaltyAmount}</span>
              </div>
            )}
          </section>

          <Separator />

          {/* Freelancer info (pre-filled from company form) */}
          <section className="space-y-2">
            <h4 className="font-bold text-slate-700">بياناتك</h4>
            <dl className="space-y-1.5">
              {[
                ["الاسم", [formData.secondPartyFirstName, formData.secondPartyLastName].filter(Boolean).join(" ")],
                ["البريد الإلكتروني", formData.secondPartyEmail],
                ["رقم الهاتف", formData.secondPartyPhone],
                ["العنوان", formData.secondPartyAddress],
              ].map(([label, value]) =>
                value ? (
                  <div key={label} className="flex justify-between">
                    <dt className="text-slate-500">{label}</dt>
                    <dd className="text-left font-semibold">{value}</dd>
                  </div>
                ) : null,
              )}
            </dl>
          </section>

          {/* Clauses */}
          {clauses.length > 0 && (
            <>
              <Separator />
              <section className="space-y-2">
                <h4 className="font-bold text-slate-700">بنود العقد</h4>
                <ol className="space-y-2">
                  {clauses.map((clause, i) => (
                    <li key={i} className="flex gap-3 text-slate-600">
                      <span className="shrink-0 font-bold text-slate-400">
                        {i + 1}.
                      </span>
                      <span>{clause.text}</span>
                    </li>
                  ))}
                </ol>
              </section>
            </>
          )}

          {/* Description */}
          {contract.description && (
            <>
              <Separator />
              <section className="space-y-2">
                <h4 className="font-bold text-slate-700">الوصف</h4>
                <p className="text-slate-600">{contract.description}</p>
              </section>
            </>
          )}

          {/* Footer actions */}
          <div className="flex flex-col gap-2 pt-2">
            <Button
              variant="outline"
              className="w-full items-center gap-2 rounded-xl"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              <Download className="h-4 w-4" />
              {isDownloading ? "جاري التحميل..." : "تحميل العقد PDF"}
            </Button>

            {isReceived && (
              <div className="flex gap-2">
                <Button
                  className="flex-1 items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700"
                  disabled={updating}
                  onClick={() => onUpdateStatus(contractKey, "accepted")}
                >
                  قبول العقد
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 items-center gap-2 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700"
                  disabled={updating}
                  onClick={() => onUpdateStatus(contractKey, "declined")}
                >
                  رفض العقد
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
