import {
  getContractsByCreator as repoGetContractsByCreator,
  getContractByIdScoped as repoGetContractByIdScoped,
  createContract as repoCreateContract,
  patchContractSent,
} from "../repositories/contractRepository";

function inferCategoryFromType(type) {
  if (!type) return "فريلانسر";

  const normalizedType = String(type).trim();
  if (normalizedType.includes("دوام كامل")) return "دوام كامل";
  if (normalizedType.includes("دوام جزئي")) return "دوام جزئي";
  if (normalizedType.includes("تدريب")) return "تدريب";
  return "فريلانسر";
}

const CONTRACT_FORM_DATA_KEYS = [
  "templateId",
  "contractType",
  "firstPartyCompanyName",
  "firstPartyLegalRepresentative",
  "secondPartyFirstName",
  "secondPartyLastName",
  "secondPartyFullName",
  "secondPartyNationalId",
  "secondPartyAddress",
  "secondPartyPhone",
  "secondPartyEmail",
  "secondPartyUserId",
  "secondPartyWhatsapp",
  "jobTitle",
  "compensationAmount",
  "compensationCurrency",
  "startDate",
  "endDate",
  "contractDuration",
  "penaltyClauseAmount",
  "penaltyClauseCurrency",
];

function normalizeFormData(input = {}) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return {};
  }

  const result = {};

  for (const key of CONTRACT_FORM_DATA_KEYS) {
    const value = input[key];

    if (value == null) {
      continue;
    }

    if (typeof value === "string") {
      result[key] = value.trim();
      continue;
    }

    result[key] = value;
  }

  return result;
}

function normalizeContractPayload(input = {}) {
  const normalizedFormData = normalizeFormData(input.formData || {});
  const normalizedType =
    String(input.type || "").trim() ||
    String(normalizedFormData.contractType || "").trim();

  if (normalizedType && !normalizedFormData.contractType) {
    normalizedFormData.contractType = normalizedType;
  }

  return {
    templateId: String(input.templateId || "").trim(),
    title: String(input.title || "عقد جديد").trim(),
    description: String(input.description || "").trim(),
    type: normalizedType,
    category:
      String(input.category || "").trim() ||
      inferCategoryFromType(normalizedType),
    formData: normalizedFormData,
    clauses: Array.isArray(input.clauses)
      ? input.clauses
          .map((clause) => ({ text: String(clause?.text || "").trim() }))
          .filter((clause) => clause.text.length > 0)
      : [],
  };
}

function normalizeTemplatePayload(input = {}) {
  const normalizedClauses = Array.isArray(input.clauses)
    ? input.clauses
        .map((clause) => ({ text: String(clause?.text || "").trim() }))
        .filter((clause) => clause.text.length > 0)
    : [];

  return {
    title: String(input.title || "").trim(),
    description: String(input.description || "").trim(),
    type: String(input.type || "").trim(),
    category:
      String(input.category || "").trim() ||
      inferCategoryFromType(String(input.type || "").trim()),
    clauses: normalizedClauses,
    isActive: input.isActive !== false,
  };
}

function buildWhatsAppMessage(contract = {}) {
  const data = contract.formData || {};
  const compensationCurrency = data.compensationCurrency || "EGP";
  const secondPartyName =
    data.secondPartyFullName ||
    [data.secondPartyFirstName, data.secondPartyLastName]
      .filter(Boolean)
      .join(" ");

  return [
    "مرحباً،",
    `تم إعداد عقد: ${contract.title || "عقد جديد"}`,
    `الطرف الأول: ${data.firstPartyCompanyName || "-"}`,
    `الطرف الثاني: ${secondPartyName || "-"}`,
    `المسمى الوظيفي: ${data.jobTitle || "-"}`,
    `الراتب/المقابل: ${data.compensationAmount || "-"} ${compensationCurrency}`,
    "يرجى مراجعة البيانات واستكمال الإجراءات.",
  ].join("\n");
}

export async function getContractsByCreator(orgId, userId) {
  return repoGetContractsByCreator(orgId, userId);
}

export async function getContractByIdScoped(id, orgId) {
  return repoGetContractByIdScoped(id, orgId);
}

export async function createContract(input, { orgId, userId }) {
  const normalized = normalizeContractPayload(input);

  return repoCreateContract({
    organization: { _ref: orgId },
    createdBy: { _ref: userId },
    ...normalized,
    status: "received",
    whatsapp: {
      sendCount: 0,
    },
  });
}

import {
  getContractTemplates as repoGetTemplatesByOrg,
  getContractTemplateById as repoGetTemplateByIdScoped,
  createContractTemplate as repoCreateTemplate,
  incrementTemplateUsage as repoIncrementTemplateUsage,
} from "../repositories/contractTemplateRepository";

export async function getTemplatesByOrg(orgId) {
  return repoGetTemplatesByOrg(orgId);
}

export async function getTemplateByIdScoped(id, orgId) {
  const template = await repoGetTemplateByIdScoped(id);
  if (!template || template.organization?._id !== orgId) return null;
  return template;
}

export async function createTemplate(input, { orgId, userId }) {
  const normalized = normalizeTemplatePayload(input);
  return repoCreateTemplate({
    organization: { _ref: orgId },
    createdBy: { _ref: userId },
    ...normalized,
  });
}

export async function incrementTemplateUsage(templateId) {
  return repoIncrementTemplateUsage(templateId);
}

export async function markContractAsSent(id) {
  return patchContractSent(id);
}

export function buildContractWhatsAppUrl(contract) {
  const data = contract?.formData || {};
  const recipient = String(
    data.secondPartyWhatsapp || data.secondPartyPhone || "",
  ).replace(/\s+/g, "");
  const encodedMessage = encodeURIComponent(buildWhatsAppMessage(contract));

  if (!recipient) {
    return `https://wa.me/?text=${encodedMessage}`;
  }

  return `https://wa.me/${recipient}?text=${encodedMessage}`;
}

export const contractService = {
  getContractsByCreator,
  getContractByIdScoped,
  createContract,
  getTemplatesByOrg,
  getTemplateByIdScoped,
  createTemplate,
  incrementTemplateUsage,
  markContractAsSent,
  buildContractWhatsAppUrl,
};
