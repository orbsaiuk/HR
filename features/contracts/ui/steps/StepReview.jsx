"use client";

import { useMemo } from "react";
import {
  FileText,
  Scale,
  User,
  Building2,
  Briefcase,
  CheckSquare,
} from "lucide-react";
import { generateContractClauses } from "../../model/contractClauseGenerator";
import {
  ReviewDetailItem,
  ReviewSectionHeader,
} from "./review/ReviewPrimitives";
import { SignaturesSection } from "./review/SignaturesSection";
import {
  formatCompensation,
  formatSignatureDate,
  getContractTypeLabel,
} from "./review/reviewFormatters";

export function StepReview({ values, onEditStep, template, companyProfile }) {
  const contractTypeLabel = getContractTypeLabel(
    template?.type || values.contractType,
  );

  const clauses = useMemo(
    () => generateContractClauses(template, values),
    [template, values],
  );

  const firstPartyName =
    companyProfile?.companyName || values.firstPartyCompanyName;
  const firstPartyRepresentative =
    companyProfile?.legalRepresentative || values.firstPartyLegalRepresentative;
  const secondPartyName = values.secondPartyFullName;

  const formattedDate = formatSignatureDate(new Date());

  return (
    <div className="space-y-5" dir="rtl">
      {/* First Party */}
      <section className="rounded-lg border border-[#E7EBF3] bg-[#FAFBFF] p-4">
        <ReviewSectionHeader
          icon={Building2}
          title="الطرف الأول (صاحب العمل)"
        />
        <ul className="space-y-1 pr-1">
          <ReviewDetailItem label="اسم الشركة" value={firstPartyName} />
          <ReviewDetailItem
            label="الممثل القانوني"
            value={firstPartyRepresentative}
          />
        </ul>
      </section>

      {/* Second Party */}
      <section className="rounded-lg border border-[#E7EBF3] bg-[#FAFBFF] p-4">
        <ReviewSectionHeader
          icon={User}
          title="الطرف الثاني (الموظف)"
          onEdit={() => onEditStep(0)}
        />
        <ul className="space-y-1 pr-1">
          <ReviewDetailItem label="الاسم" value={values.secondPartyFullName} />
          <ReviewDetailItem
            label="الرقم القومي"
            value={values.secondPartyNationalId}
          />
          <ReviewDetailItem label="العنوان" value={values.secondPartyAddress} />
          <ReviewDetailItem
            label="رقم الواتساب"
            value={values.secondPartyWhatsapp}
          />
        </ul>
      </section>

      {/* Contract Details */}
      <section className="rounded-lg border border-[#E7EBF3] bg-[#FAFBFF] p-4">
        <ReviewSectionHeader
          icon={Briefcase}
          title="تفاصيل العقد"
          onEdit={() => onEditStep(1)}
        />
        <ul className="space-y-1 pr-1">
          <ReviewDetailItem label="المسمى الوظيفي" value={values.jobTitle} />
          <ReviewDetailItem
            label="الراتب/المقابل"
            value={formatCompensation(
              values.compensationAmount,
              values.compensationCurrency,
            )}
          />
          <ReviewDetailItem
            label="نوع العقد"
            value={template?.type || values.contractType}
          />
          <ReviewDetailItem label="تاريخ البدء" value={values.startDate} />
          <ReviewDetailItem label="تاريخ الانتهاء" value={values.endDate} />
          <ReviewDetailItem label="مدة العقد" value={values.contractDuration} />
        </ul>
      </section>

      {/* Contract Clauses */}
      {clauses.length > 0 && (
        <section className="rounded-lg border border-[#E7EBF3] bg-white p-4">
          <ReviewSectionHeader
            icon={Scale}
            title="بنود العقد"
            onEdit={() => onEditStep(1)}
          />
          <ol className="space-y-2.5 pr-2">
            {clauses.map((clause, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm leading-7 text-[#374151]"
              >
                <CheckSquare className="mt-1.5 h-4 w-4 shrink-0 text-[#5338D5]" />
                <span>{clause.text}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Signatures */}
      <SignaturesSection
        firstPartyName={firstPartyName}
        firstPartyRepresentative={firstPartyRepresentative}
        secondPartyName={secondPartyName}
        formattedDate={formattedDate}
      />
    </div>
  );
}
