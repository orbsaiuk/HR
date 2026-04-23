import { client } from "@/sanity/client";
import { contractsQueries } from "@/sanity/queries";

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
  return client.fetch(contractsQueries.getByOrgAndCreator, { orgId, userId });
}

export async function getContractByIdScoped(id, orgId) {
  return client.fetch(contractsQueries.getByIdScoped, { id, orgId });
}

export async function createContract(input, { orgId, userId }) {
  const normalized = normalizeContractPayload(input);
  const now = new Date().toISOString();

  return client.create({
    _type: "contract",
    organization: { _type: "reference", _ref: orgId },
    createdBy: { _type: "reference", _ref: userId },
    ...normalized,
    status: "created",
    whatsapp: {
      sendCount: 0,
    },
    createdAt: now,
    updatedAt: now,
  });
}

export async function getTemplatesByOrg(orgId) {
  return client.fetch(contractsQueries.getTemplatesByOrg, { orgId });
}

export async function getTemplateByIdScoped(id, orgId) {
  return client.fetch(contractsQueries.getTemplateById, { id, orgId });
}

export async function createTemplate(input, { orgId, userId }) {
  const normalized = normalizeTemplatePayload(input);
  const now = new Date().toISOString();

  return client.create({
    _type: "contractTemplate",
    organization: { _type: "reference", _ref: orgId },
    createdBy: { _type: "reference", _ref: userId },
    ...normalized,
    usageCount: 0,
    createdAt: now,
    updatedAt: now,
  });
}

export async function incrementTemplateUsage(templateId) {
  if (!templateId) return null;

  const now = new Date().toISOString();
  return client
    .patch(templateId)
    .set({ updatedAt: now })
    .inc({ usageCount: 1 })
    .commit();
}

export async function markContractAsSent(id) {
  const now = new Date().toISOString();
  return client
    .patch(id)
    .set({
      status: "sent",
      "whatsapp.lastSentAt": now,
      updatedAt: now,
    })
    .inc({ "whatsapp.sendCount": 1 })
    .commit();
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
