"use client";

import { CheckSquare } from "lucide-react";

function SignatureCard({ roleLabel, signerName }) {
  return (
    <div className="rounded-lg border border-[#DCE3F0] bg-[#FAFBFF] p-4">
      <p className="text-xs font-medium text-[#6B7280]">{roleLabel}</p>
      <p className="mt-1 text-sm font-semibold text-[#1F2937]">
        {signerName || "___________"}
      </p>
    </div>
  );
}

export function SignaturesSection({
  firstPartyName,
  firstPartyRepresentative,
  secondPartyName,
  formattedDate,
}) {
  return (
    <section className="rounded-lg border border-[#DCE3F0] bg-white p-5">
      <div className="mb-4 rounded-md border border-[#E4EAF6] bg-[#F8FAFF] p-3">
        <p className="flex items-start gap-2 text-sm leading-7 text-[#374151]">
          <CheckSquare className="mt-1.5 h-4 w-4 shrink-0 text-emerald-500" />
          بالموافقة على هذا العقد، يقر الطرفان بأهليتهما القانونية الكاملة وقبول
          جميع البنود المذكورة أعلاه
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SignatureCard
          roleLabel="توقيع الطرف الأول (الممثل القانوني)"
          signerName={firstPartyRepresentative || firstPartyName}
        />
        <SignatureCard
          roleLabel="توقيع الطرف الثاني"
          signerName={secondPartyName}
        />
      </div>

      <div className="mt-4 rounded-md border border-[#E4EAF6] bg-[#FAFBFF] px-3 py-2 text-sm text-[#374151]">
        <span className="font-medium text-[#6B7280]">تاريخ التوقيع:</span>{" "}
        <span className="font-semibold text-[#1F2937]">{formattedDate}</span>
      </div>

      <div className="mt-3 text-xs text-[#7A8397]">
        بالموافقة على هذا العقد، يقر الطرفان بأهليتهما القانونية الكاملة وقبول
        جميع البنود الواردة في العقد بكامل الإرادة.
      </div>
    </section>
  );
}
