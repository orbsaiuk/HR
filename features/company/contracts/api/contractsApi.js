import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";
import { CONTRACT_TYPES } from "../model/contractSchema";

function inferCategoryFromType(type) {
  if (!type) return "فريلانسر";

  const normalizedType = String(type).trim();
  if (normalizedType.includes("دوام كامل")) return "دوام كامل";
  if (normalizedType.includes("دوام جزئي")) return "دوام جزئي";
  if (normalizedType.includes("تدريب")) return "تدريب";
  return "فريلانسر";
}

function formatLastUsedLabel(dateValue) {
  if (!dateValue) return "الآن";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "الآن";

  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "اليوم";
  if (diffDays === 1) return "منذ يوم";
  if (diffDays <= 10) return `منذ ${diffDays} أيام`;

  return new Intl.DateTimeFormat("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function mapTemplate(template = {}) {
  const type =
    template?.type ||
    template?.formData?.contractType ||
    CONTRACT_TYPES.FREELANCER_SINGLE_PROJECT;

  return {
    id: template?._id || template?.id || "",
    title: template?.title || "قالب عقد جديد",
    description: template?.description || "",
    type,
    category: template?.category || inferCategoryFromType(type),
    clauses: Array.isArray(template?.clauses)
      ? template.clauses
      : Array.isArray(template?.defaultClauses)
        ? template.defaultClauses
        : [],
    usageCount: Number(template?.usageCount || 0),
    lastUsed:
      template?.lastUsed ||
      formatLastUsedLabel(template?.updatedAt || template?.createdAt),
    createdAt: template?.createdAt,
    updatedAt: template?.updatedAt,
  };
}

function mapContract(contract = {}) {
  const type =
    contract?.type ||
    contract?.formData?.contractType ||
    CONTRACT_TYPES.FREELANCER_SINGLE_PROJECT;

  return {
    id: contract?.id || contract?._id || "",
    _id: contract?._id || contract?.id || "",
    templateId: contract?.templateId || "",
    title: contract?.title || "عقد جديد",
    description: contract?.description || "",
    type,
    category: contract?.category || inferCategoryFromType(type),
    status: contract?.status || "created",
    formData:
      contract?.formData && typeof contract.formData === "object"
        ? contract.formData
        : {},
    clauses: Array.isArray(contract?.clauses) ? contract.clauses : [],
    whatsapp:
      contract?.whatsapp && typeof contract.whatsapp === "object"
        ? contract.whatsapp
        : { sendCount: 0 },
    createdAt: contract?.createdAt,
    updatedAt: contract?.updatedAt,
  };
}

export const contractsApi = {
  async getTemplates() {
    const templates = await apiClient.get(API_ENDPOINTS.CONTRACT_TEMPLATES);
    if (!Array.isArray(templates) || templates.length === 0) {
      return [];
    }

    return templates.map(mapTemplate);
  },

  async createTemplate(payload) {
    const template = await apiClient.post(
      API_ENDPOINTS.CONTRACT_TEMPLATES,
      payload,
    );
    return mapTemplate(template);
  },

  async getContracts() {
    const contracts = await apiClient.get(API_ENDPOINTS.CONTRACTS);
    if (!Array.isArray(contracts)) {
      return [];
    }

    return contracts.map(mapContract);
  },

  async getContractById(id) {
    const contract = await apiClient.get(API_ENDPOINTS.CONTRACT_BY_ID(id));
    return mapContract(contract);
  },

  async createContract(payload) {
    const contract = await apiClient.post(API_ENDPOINTS.CONTRACTS, payload);
    return mapContract(contract);
  },

  async sendViaWhatsApp(contractId) {
    return apiClient.post(API_ENDPOINTS.CONTRACT_SEND_WHATSAPP(contractId), {});
  },

  getContractPdfDownloadUrl(contractId) {
    return API_ENDPOINTS.CONTRACT_DOWNLOAD_PDF(contractId);
  },
};
