import { NextResponse } from "next/server";
import { MOCK_PROJECTS } from "@/features/projects/ui/components/project-card/MockProjectCard";

// Mock client data
const MOCK_CLIENTS = [
  { name: "محمد أحمد", rating: 4.8, projectsCount: 15 },
  { name: "سارة العلي", rating: 4.9, projectsCount: 23 },
  { name: "أحمد محمود", rating: 4.5, projectsCount: 8 },
  { name: "فاطمة حسن", rating: 4.7, projectsCount: 12 },
  { name: "خالد السعيد", rating: 4.6, projectsCount: 19 },
];

// Mock requirements data
const MOCK_REQUIREMENTS = [
  [
    "خبرة لا تقل عن 3 سنوات في المجال",
    "إتقان الأدوات والتقنيات المطلوبة",
    "القدرة على العمل ضمن فريق",
    "الالتزام بالمواعيد النهائية",
    "مهارات تواصل ممتازة",
  ],
  [
    "خبرة سابقة في مشاريع مماثلة",
    "القدرة على تقديم عدة مقترحات",
    "توفير أمثلة على أعمال سابقة",
    "الاستعداد للتعديلات والمراجعات",
  ],
  [
    "إتقان اللغة العربية كتابة وتحدثاً",
    "خبرة في التعامل مع العملاء",
    "القدرة على العمل تحت الضغط",
    "الإبداع في حل المشكلات",
    "دعم فني بعد التسليم",
  ],
];

// Mock deliverables data
const MOCK_DELIVERABLES = [
  [
    "تسليم جميع الملفات المصدرية",
    "توثيق كامل للمشروع",
    "نسخ بصيغ متعددة حسب الحاجة",
    "دعم فني لمدة أسبوعين",
  ],
  [
    "تصميم كامل مع جميع المقاسات",
    "دليل الاستخدام والهوية",
    "ملفات قابلة للتعديل",
    "تدريب على استخدام المخرجات",
  ],
  [
    "كود مصدري منظم وموثق",
    "قاعدة بيانات جاهزة",
    "لوحة تحكم إدارية",
    "تقارير وإحصائيات",
    "دليل المستخدم",
  ],
];

// Mock skills based on project type
const MOCK_SKILLS = {
  "web-app": ["React", "Node.js", "تطوير ويب", "قواعد بيانات", "APIs"],
  "mobile-app": ["React Native", "Flutter", "تطوير تطبيقات", "UI/UX"],
  "data-science": ["Python", "تحليل بيانات", "Machine Learning", "SQL"],
  design: ["Figma", "Adobe Illustrator", "تصميم شعارات", "هوية بصرية"],
  consulting: ["استشارات تقنية", "إدارة مشاريع", "تخطيط استراتيجي"],
};

const EXPERIENCE_LEVELS = ["entry", "intermediate", "expert"];

/**
 * GET /api/projects/[id] — Get a single project (public)
 */
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const project = MOCK_PROJECTS.find((p) => p._id === id);

    if (!project) {
      return NextResponse.json(
        { error: "المشروع غير موجود" },
        { status: 404 }
      );
    }

    // Generate consistent mock data based on project ID
    const hash = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const clientIndex = hash % MOCK_CLIENTS.length;
    const reqIndex = hash % MOCK_REQUIREMENTS.length;
    const delIndex = hash % MOCK_DELIVERABLES.length;
    const expIndex = hash % EXPERIENCE_LEVELS.length;

    // Format duration as string
    let durationText = null;
    if (project.duration?.value) {
      const val = project.duration.value;
      if (val === 1) durationText = "أسبوع واحد";
      else if (val === 2) durationText = "2-4 أسابيع";
      else if (val <= 4) durationText = `${val - 1}-${val} أشهر`;
      else durationText = `${val} أشهر`;
    }

    const projectWithDetails = {
      ...project,
      description: project.description || project.shortDescription,
      duration: durationText || "2-4 أسابيع",
      experienceLevel: EXPERIENCE_LEVELS[expIndex],
      applicantsCount: (hash % 50) + 5,
      requirements: MOCK_REQUIREMENTS[reqIndex],
      deliverables: MOCK_DELIVERABLES[delIndex],
      skills: MOCK_SKILLS[project.projectType] || MOCK_SKILLS.design,
      client: MOCK_CLIENTS[clientIndex],
    };

    return NextResponse.json(projectWithDetails);
  } catch (error) {
    console.error("GET /api/projects/[id] error:", error);
    return NextResponse.json(
      { error: "فشل في تحميل المشروع" },
      { status: 500 }
    );
  }
}
