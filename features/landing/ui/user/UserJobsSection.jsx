import { JobsSection } from "../../../../shared/components/sections/JobsSection";

const JOBS = [
  {
    id: 1,
    title: "مطور Full Stack",
    company: "شركة تقنية المستقبل",
    companyLogo: "https://randomuser.me/api/portraits/men/32.jpg",
    location: "الرياض",
    salary: "15,000 - 20,000",
    type: "دوام كامل",
    isRemote: true,
  },
  {
    id: 2,
    title: "مصمم UI/UX",
    company: "شركة الإبداع الرقمي",
    companyLogo: "https://randomuser.me/api/portraits/women/44.jpg",
    location: "جدة",
    salary: "12,000 - 18,000",
    type: "دوام كامل",
    isRemote: false,
  },
  {
    id: 3,
    title: "مدير تسويق رقمي",
    company: "شركة النمو السريع",
    companyLogo: "https://randomuser.me/api/portraits/men/75.jpg",
    location: "الدمام",
    salary: "18,000 - 25,000",
    type: "دوام كامل",
    isRemote: true,
  },
  {
    id: 4,
    title: "محلل بيانات",
    company: "شركة البيانات الذكية",
    companyLogo: "https://randomuser.me/api/portraits/women/68.jpg",
    location: "الرياض",
    salary: "14,000 - 19,000",
    type: "دوام كامل",
    isRemote: true,
  },
  {
    id: 5,
    title: "مطور تطبيقات موبايل",
    company: "شركة التطبيقات المتقدمة",
    companyLogo: "https://randomuser.me/api/portraits/men/46.jpg",
    location: "جدة",
    salary: "16,000 - 22,000",
    type: "دوام كامل",
    isRemote: false,
  },
  {
    id: 6,
    title: "كاتب محتوى",
    company: "شركة المحتوى العربي",
    companyLogo: "https://randomuser.me/api/portraits/women/65.jpg",
    location: "عن بُعد",
    salary: "8,000 - 12,000",
    type: "دوام جزئي",
    isRemote: true,
  },
];

export function UserJobsSection() {
  return (
    <JobsSection
      title="أحدث الوظائف على المنصة"
      description="تصفح أحدث الفرص التي نشرتها الشركات وابدأ التقديم اليوم"
      buttonTitle="استكشف كل الوظائف"
      jobs={JOBS}
    />
  );
}
