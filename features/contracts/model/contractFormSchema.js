import { z } from "zod";
import {
  CONTRACT_CURRENCIES,
  CONTRACT_TYPES,
  CONTRACT_TYPE_VALUES,
} from "./contractConstants";

const nationalIdSchema = z
  .string()
  .trim()
  .regex(/^\d{14}$/, "الرقم القومي يجب أن يتكون من 14 رقم");

const whatsappSchema = z
  .string()
  .trim()
  .regex(/^(\+?\d{10,15})$/, "رقم الواتساب غير صحيح");

const templateClauseSchema = z.object({
  text: z.string().trim().min(3, "نص البند مطلوب"),
});

export const sendContractSchema = z
  .object({
    templateId: z.string().trim().optional().or(z.literal("")),
    contractType: z.string().trim().optional().or(z.literal("")),

    secondPartyFullName: z.string().trim().min(2, "الاسم الكامل مطلوب"),
    secondPartyNationalId: nationalIdSchema,
    secondPartyAddress: z.string().trim().min(6, "العنوان مطلوب"),
    secondPartyWhatsapp: whatsappSchema,

    jobTitle: z.string().trim().min(2, "المسمى الوظيفي مطلوب"),
    compensationAmount: z.coerce
      .number({ invalid_type_error: "المبلغ غير صحيح" })
      .positive("الراتب / المقابل يجب أن يكون أكبر من صفر"),
    compensationCurrency: z.enum(CONTRACT_CURRENCIES, {
      message: "يرجى اختيار عملة الراتب / المقابل",
    }),
    startDate: z.string().min(1, "تاريخ البدء مطلوب"),
    endDate: z.string().min(1, "تاريخ الانتهاء مطلوب"),
    penaltyClauseAmount: z.coerce
      .number({ invalid_type_error: "الشرط الجزائي غير صحيح" })
      .min(0, "الشرط الجزائي لا يمكن أن يكون سالباً"),
    penaltyClauseCurrency: z.enum(CONTRACT_CURRENCIES, {
      message: "يرجى اختيار عملة الشرط الجزائي",
    }),
    contractDuration: z.string().trim().min(2, "مدة العقد مطلوبة"),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return (
        new Date(data.endDate).getTime() >= new Date(data.startDate).getTime()
      );
    },
    {
      message: "تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء",
      path: ["endDate"],
    },
  );

export const templateFormSchema = z.object({
  title: z.string().trim().min(2, "عنوان القالب مطلوب"),
  description: z
    .string()
    .trim()
    .max(1000, "الوصف طويل جداً")
    .optional()
    .or(z.literal("")),
  type: z.enum(CONTRACT_TYPE_VALUES, {
    message: "نوع العقد غير صحيح",
  }),
  clauses: z.array(templateClauseSchema).min(1, "أضف بنداً واحداً على الأقل"),
});

export const sendContractDefaults = {
  templateId: "",
  contractType: "",

  secondPartyFullName: "",
  secondPartyNationalId: "",
  secondPartyAddress: "",
  secondPartyWhatsapp: "",

  jobTitle: "",
  compensationAmount: "",
  compensationCurrency: "EGP",
  startDate: "",
  endDate: "",
  contractDuration: "",
  penaltyClauseAmount: "",
  penaltyClauseCurrency: "EGP",
};

export const templateFormDefaults = {
  title: "",
  description: "",
  type: CONTRACT_TYPES.FREELANCER_SINGLE_PROJECT,
  clauses: [],
};

export const SEND_CONTRACT_STEP_FIELDS = [
  [
    "secondPartyFullName",
    "secondPartyNationalId",
    "secondPartyAddress",
    "secondPartyWhatsapp",
  ],
  [
    "contractType",
    "jobTitle",
    "compensationAmount",
    "compensationCurrency",
    "startDate",
    "endDate",
    "contractDuration",
    "penaltyClauseAmount",
    "penaltyClauseCurrency",
  ],
];
