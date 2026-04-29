"use client";

import { Building2, Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { ContractStatusBadge } from "./ContractStatusBadge";

const CATEGORY_STYLES = {
  فريلانسر: "bg-[#F1EEFF] text-[#6D57D2]",
  "دوام كامل": "bg-[#EAF8EF] text-[#4D9963]",
  "دوام جزئي": "bg-[#FFF5EA] text-[#D7863A]",
  تدريب: "bg-[#FFF4EA] text-[#C5883D]",
};

export function FreelancerContractCard({
  contract,
  onViewDetails,
  onUpdateStatus,
  updating,
}) {
  const {
    id,
    _id,
    title,
    type,
    category,
    status,
    formData,
    organization,
    createdAt,
  } = contract;

  const key = id ?? _id;

  const compensationAmount = formData?.compensationAmount ?? null;
  const compensationCurrency = formData?.compensationCurrency ?? "EGP";

  const startDate = formData?.startDate
    ? format(new Date(formData.startDate), "dd MMM yyyy", { locale: ar })
    : null;

  const isReceived = status === "received";

  const badgeClass =
    CATEGORY_STYLES[category] || "bg-[#EEF2FF] text-[#6B7280]";

  return (
    <article
      className="rounded-lg border border-[#E4E8F2] bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.03)]"
      dir="rtl"
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${badgeClass}`}
        >
          {category || type}
        </span>
        <ContractStatusBadge status={status} />
      </div>

      <h3 className="mt-4 text-lg font-bold leading-8 text-[#1F2937]">
        {title || "عقد"}
      </h3>

      {organization?.name && (
        <div className="mt-1 flex items-center gap-1.5 text-sm text-[#6B7280]">
          <Building2 className="h-3.5 w-3.5 shrink-0" />
          <span>{organization.name}</span>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#8A94A7]">
        {compensationAmount != null && (
          <span className="inline-flex items-center gap-1">
            <DollarSign className="h-3.5 w-3.5" />
            {compensationAmount} {compensationCurrency}
          </span>
        )}
        {startDate && (
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {startDate}
          </span>
        )}
        {createdAt && (
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {format(new Date(createdAt), "dd/MM/yyyy", { locale: ar })}
          </span>
        )}
      </div>

      <div className="mt-5 flex flex-wrap justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          className="h-9 rounded-md px-4 text-sm"
          onClick={() => onViewDetails(contract)}
        >
          عرض التفاصيل
        </Button>

        {isReceived && (
          <>
            <Button
              type="button"
              className="h-9 rounded-md bg-emerald-600 px-4 text-sm hover:bg-emerald-700"
              disabled={updating}
              onClick={() => onUpdateStatus(key, "accepted")}
            >
              قبول
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-9 rounded-md px-4 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
              disabled={updating}
              onClick={() => onUpdateStatus(key, "declined")}
            >
              رفض
            </Button>
          </>
        )}
      </div>
    </article>
  );
}
