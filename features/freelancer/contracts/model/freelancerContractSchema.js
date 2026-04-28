import { z } from "zod";
import { CONTRACT_TYPES, CONTRACT_CURRENCIES } from "@/features/company/contracts/model/contractConstants";

/** Freelancer-facing contract statuses */
export const FREELANCER_CONTRACT_STATUS = Object.freeze({
  RECEIVED: "received",
  ACCEPTED:  "accepted",
  DECLINED:  "declined",
  EXPIRED:   "expired",
});

export const FREELANCER_CONTRACT_STATUS_VALUES = Object.values(FREELANCER_CONTRACT_STATUS);

/** Zod schema for a freelancer contract (read-only DTO shape) */
export const freelancerContractSchema = z.object({
  id:          z.string(),
  _id:         z.string(),
  templateId:  z.string().optional(),
  title:       z.string(),
  description: z.string().optional(),
  type:        z.string(),
  category:    z.string(),
  status:      z.enum(FREELANCER_CONTRACT_STATUS_VALUES),
  formData:    z.record(z.unknown()),
  clauses:     z.array(z.object({ text: z.string() })).optional(),
  createdAt:   z.string(),
  updatedAt:   z.string().optional(),
  organization: z.object({
    _id: z.string(),
    name: z.string(),
  }).optional(),
});

/** Status label map — Arabic */
export const FREELANCER_CONTRACT_STATUS_LABELS = {
  [FREELANCER_CONTRACT_STATUS.RECEIVED]: "قيد المراجعة",
  [FREELANCER_CONTRACT_STATUS.ACCEPTED]:  "مقبول",
  [FREELANCER_CONTRACT_STATUS.DECLINED]:  "مرفوض",
  [FREELANCER_CONTRACT_STATUS.EXPIRED]:   "منتهي",
};

/** Status filter tabs */
export const FREELANCER_CONTRACT_TABS = [
  { key: "ALL",      label: "الكل" },
  { key: "RECEIVED", label: "قيد المراجعة" },
  { key: "ACCEPTED", label: "مقبول" },
  { key: "DECLINED", label: "مرفوض" },
  { key: "EXPIRED",  label: "منتهي" },
];
