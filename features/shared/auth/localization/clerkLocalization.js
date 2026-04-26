import { arSA } from "@clerk/localizations";

export const customArabic = {
    ...arSA,
    formFieldInputPlaceholder__backupCode: "أدخل رمز النسخ الاحتياطي",
    formFieldInputPlaceholder__confirmDeletionUserAccount:
        "اكتب حذف الحساب لتأكيد العملية",
    formFieldInputPlaceholder__emailAddress: "أدخل بريدك الإلكتروني",
    formFieldInputPlaceholder__emailAddress_username:
        "أدخل بريدك الإلكتروني أو اسم المستخدم",
    formFieldInputPlaceholder__emailAddresses:
        "أدخل أو لصق عنوان بريد إلكتروني واحد أو أكثر ، مفصولة بمسافات أو فواصل",
    formFieldInputPlaceholder__firstName: "أدخل الاسم الأول",
    formFieldInputPlaceholder__lastName: "أدخل اسم العائلة",
    formFieldInputPlaceholder__organizationDomain: "أدخل نطاق المؤسسة",
    formFieldInputPlaceholder__organizationDomainEmailAddress:
        "أدخل بريد المؤسسة الإلكتروني",
    formFieldInputPlaceholder__organizationName: "أدخل اسم المؤسسة",
    formFieldInputPlaceholder__organizationSlug: "أدخل المعرف (slug) للمؤسسة",
    formFieldInputPlaceholder__password: "أدخل كلمة المرور",
    formFieldInputPlaceholder__phoneNumber: "أدخل رقم الهاتف",
    formFieldInputPlaceholder__username: "أدخل اسم المستخدم",
    form_username_invalid_length: "اسم المستخدم يجب أن يكون بين 4 و 64 حرف",
    userButton: {
        ...arSA.userButton,
        action__manageAccount: "البيانات الشخصية",
    },
};

export default customArabic;
