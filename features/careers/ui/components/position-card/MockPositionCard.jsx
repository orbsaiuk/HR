import { PositionCard } from "./PositionCard";

/**
 * Mock position data for previewing the PositionCard component
 * with Arabic content matching the reference design.
 */
const MOCK_POSITIONS = [
    {
        _id: "mock-1",
        title: "مطور واجهات أمامية - React",
        department: "التقنية",
        description:
            "<p>نبحث عن مطور React محترف لديه خبرة 3+ سنوات في بناء تطبيقات ويب حديثة مع TypeScript.</p>",
        location: "القاهرة، مصر",
        type: "full-time",
        level: "senior",
        salaryMin: 3000,
        salaryMax: 5000,
        currency: "USD",
        status: "published",
        _createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        applicationCount: 12,
        organizationName: "شركة تقنية بلس",
        organizationSlug: "tech-plus",
        organizationLogo: null,
    },
    {
        _id: "mock-2",
        title: "مصمم تجربة المستخدم UI/UX",
        department: "التصميم",
        description:
            "<p>انضم لفريق التصميم لإنشاء تجارب مستخدم مميزة. ستعمل مع فرق الهندسة والمنتجات لتقديم تصاميم عالية الجودة.</p>",
        location: "عن بعد",
        type: "remote",
        level: "mid",
        salaryMin: 2000,
        salaryMax: 3500,
        currency: "USD",
        status: "published",
        _createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        applicationCount: 8,
        organizationName: "استوديو الإبداع",
        organizationSlug: "creative-studio",
        organizationLogo: null,
    },
    {
        _id: "mock-3",
        title: "مهندس خلفية - Node.js",
        department: "الهندسة",
        description:
            "<p>نحتاج مهندس خلفية متمكن من Node.js وقواعد البيانات لبناء واجهات برمجية قابلة للتوسع لمنصتنا المتنامية.</p>",
        location: "الإسكندرية، مصر",
        type: "full-time",
        level: "senior",
        salaryMin: 2500,
        salaryMax: 4000,
        currency: "USD",
        status: "published",
        _createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        applicationCount: 5,
        organizationName: "كلاود بيس",
        organizationSlug: "cloudbase",
        organizationLogo: null,
    },
    {
        _id: "mock-4",
        title: "متدرب تسويق رقمي",
        department: "التسويق",
        description:
            "<p>فرصة رائعة للطلاب والخريجين الجدد لاكتساب خبرة عملية في التسويق الرقمي وإدارة وسائل التواصل الاجتماعي وإنشاء المحتوى.</p>",
        location: "القاهرة، مصر",
        type: "internship",
        level: "entry",
        salaryMin: null,
        salaryMax: 1000,
        currency: "USD",
        status: "published",
        _createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        applicationCount: 24,
        organizationName: "مركز النمو",
        organizationSlug: "growthhub",
        organizationLogo: null,
    },
    {
        _id: "mock-5",
        title: "مهندس DevOps",
        department: "البنية التحتية",
        description:
            "<p>نبحث عن مهندس DevOps لإدارة خطوط CI/CD والبنية التحتية السحابية على AWS وضمان التوفر العالي لأنظمة الإنتاج.</p>",
        location: "عن بعد",
        type: "contract",
        level: "senior",
        salaryMin: 3000,
        salaryMax: 5000,
        currency: "USD",
        status: "published",
        _createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        applicationCount: 3,
        organizationName: "إنفرا وركس",
        organizationSlug: "infraworks",
        organizationLogo: null,
    },
    {
        _id: "mock-6",
        title: "محلل بيانات",
        department: "التحليلات",
        description:
            "<p>نوظف محلل بيانات لمساعدتنا في اتخاذ قرارات مبنية على البيانات. ستعمل مع SQL وPython وأدوات BI لاستخراج رؤى من مجموعات بيانات كبيرة.</p>",
        location: "الجيزة، مصر",
        type: "part-time",
        level: "mid",
        salaryMin: 1500,
        salaryMax: 2500,
        currency: "USD",
        status: "closed",
        _createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        applicationCount: 17,
        organizationName: "داتا مايندز",
        organizationSlug: "dataminds",
        organizationLogo: null,
    },
];

/**
 * Renders a single MockPositionCard with realistic Arabic fake data.
 *
 * @param {{ index?: number, viewMode?: "grid" | "list" }} props
 */
export function MockPositionCard({ index = 0, viewMode = "list" }) {
    const position = MOCK_POSITIONS[index % MOCK_POSITIONS.length];
    return <PositionCard position={position} viewMode={viewMode} />;
}

/**
 * Renders a grid/list of MockPositionCards.
 *
 * @param {{ count?: number, viewMode?: "grid" | "list" }} props
 */
export function MockPositionCardList({ count = 6, viewMode = "list" }) {
    return (
        <div
            className={
                viewMode === "grid"
                    ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
                    : "flex flex-col gap-4"
            }
        >
            {Array.from({ length: count }).map((_, i) => (
                <MockPositionCard key={`mock-${i}`} index={i} viewMode={viewMode} />
            ))}
        </div>
    );
}

/** Export the raw mock data for use in tests or stories */
export { MOCK_POSITIONS };
