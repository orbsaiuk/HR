"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { WorkExperienceSection } from "./WorkExperienceSection";
import { EducationSection } from "./EducationSection";
import { SkillsSection } from "./SkillsSection";
import { LanguagesSection } from "./LanguagesSection";
import { ResumeUploadSection } from "./ResumeUploadSection";
import {
    Briefcase,
    GraduationCap,
    Sparkles,
    Languages,
    FileText,
    Pencil,
} from "lucide-react";

/**
 * Read-only tabbed view of profile sections (experience, education, etc.).
 */
export function ProfileSectionTabs({ profile }) {
    const hasWork = profile.workExperience?.length > 0;
    const hasEdu = profile.education?.length > 0;
    const hasSkills = profile.skills?.length > 0;
    const hasLanguages = profile.languages?.length > 0;
    const hasResume = !!profile.uploadedResumeUrl || !!profile.resumeUrl;

    // Determine best default tab (first one with content, or "experience")
    const defaultTab = hasWork
        ? "experience"
        : hasEdu
            ? "education"
            : hasSkills
                ? "skills"
                : hasLanguages
                    ? "languages"
                    : hasResume
                        ? "resume"
                        : "experience";

    return (
        <Tabs defaultValue={defaultTab} className="w-full" dir="rtl">
            <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="experience" className="gap-1.5">
                    <Briefcase size={14} />
                    الخبرات
                    {hasWork && (
                        <Badge variant="secondary" className="me-1 h-5 px-1.5 text-xs">
                            {profile.workExperience.length}
                        </Badge>
                    )}
                </TabsTrigger>
                <TabsTrigger value="education" className="gap-1.5">
                    <GraduationCap size={14} />
                    التعليم
                    {hasEdu && (
                        <Badge variant="secondary" className="me-1 h-5 px-1.5 text-xs">
                            {profile.education.length}
                        </Badge>
                    )}
                </TabsTrigger>
                <TabsTrigger value="skills" className="gap-1.5">
                    <Sparkles size={14} />
                    المهارات
                    {hasSkills && (
                        <Badge variant="secondary" className="me-1 h-5 px-1.5 text-xs">
                            {profile.skills.length}
                        </Badge>
                    )}
                </TabsTrigger>
                <TabsTrigger value="languages" className="gap-1.5">
                    <Languages size={14} />
                    اللغات
                    {hasLanguages && (
                        <Badge variant="secondary" className="me-1 h-5 px-1.5 text-xs">
                            {profile.languages.length}
                        </Badge>
                    )}
                </TabsTrigger>
                <TabsTrigger value="resume" className="gap-1.5">
                    <FileText size={14} />
                    السيرة الذاتية
                    {hasResume && (
                        <span className="me-1 h-2 w-2 rounded-full bg-green-500 inline-block" />
                    )}
                </TabsTrigger>
            </TabsList>

            <TabsContent value="experience" className="mt-4">
                {hasWork ? (
                    <WorkExperienceSection entries={profile.workExperience} />
                ) : (
                    <EmptySection
                        icon={Briefcase}
                        title="لا توجد خبرات عملية بعد"
                        description="أضف سجل عملك لعرض خلفيتك المهنية."
                    />
                )}
            </TabsContent>

            <TabsContent value="education" className="mt-4">
                {hasEdu ? (
                    <EducationSection entries={profile.education} />
                ) : (
                    <EmptySection
                        icon={GraduationCap}
                        title="لا يوجد تعليم مضاف بعد"
                        description="أضف خلفيتك التعليمية لتعزيز ملفك الشخصي."
                    />
                )}
            </TabsContent>

            <TabsContent value="skills" className="mt-4">
                {hasSkills ? (
                    <SkillsSection skills={profile.skills} />
                ) : (
                    <EmptySection
                        icon={Sparkles}
                        title="لا توجد مهارات مضافة بعد"
                        description="أبرز مهاراتك الرئيسية للتميز أمام أصحاب العمل المحتملين."
                    />
                )}
            </TabsContent>

            <TabsContent value="languages" className="mt-4">
                {hasLanguages ? (
                    <LanguagesSection languages={profile.languages} />
                ) : (
                    <EmptySection
                        icon={Languages}
                        title="لا توجد لغات مضافة بعد"
                        description="أدرج اللغات التي تتحدثها ومستوى إتقانك لها."
                    />
                )}
            </TabsContent>

            <TabsContent value="resume" className="mt-4">
                {hasResume ? (
                    <ResumeUploadSection
                        resumeUrl={profile.uploadedResumeUrl}
                        externalResumeUrl={profile.resumeUrl}
                    />
                ) : (
                    <EmptySection
                        icon={FileText}
                        title="لم يتم رفع سيرة ذاتية بعد"
                        description="ارفع سيرتك الذاتية أو الصق رابطاً خارجياً لتسهيل عملية التقديم."
                    />
                )}
            </TabsContent>
        </Tabs>
    );
}

/* ------------------------------------------------------------------ */

/**
 * Polished empty state with icon, message, and CTA to edit profile.
 */
function EmptySection({ icon: Icon, title, description }) {
    return (
        <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-4 mb-4">
                    <Icon size={28} className="text-muted-foreground" />
                </div>
                <h3 className="text-base md:text-lg mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground max-w-sm mb-4">
                    {description}
                </p>
                <Link href="/user/profile/edit">
                    <Button variant="outline" size="sm" className="gap-1.5">
                        <Pencil size={14} />
                        اضف الآن
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}
