import Image from "next/image";
import Link from "next/link";
import {
  Briefcase,
  Clock3,
  ExternalLink,
  FileText,
  ImageIcon,
  Pencil,
  Plus,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "./EmptyState";

function SectionHeader({
  title,
  count,
  section,
  withAddAction = false,
  onEdit,
}) {
  const displayTitle =
    typeof count === "number" ? `${title} (${count})` : title;

  return (
    <CardHeader className="flex-row items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-6 sm:py-4">
      <CardTitle className="text-lg font-bold text-slate-700 sm:text-2xl">
        {displayTitle}
      </CardTitle>

      <div className="flex items-center gap-2">
        {withAddAction ? (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-lg border-slate-200 bg-white text-slate-400 hover:bg-slate-50"
            aria-label={`إضافة عنصر في قسم ${displayTitle}`}
            onClick={() => onEdit?.(section)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        ) : null}

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-lg border-slate-200 bg-white text-slate-400 hover:bg-slate-50"
          aria-label={`تعديل قسم ${displayTitle}`}
          onClick={() => onEdit?.(section)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
  );
}

export function ProfileContent({ profile, onEdit }) {
  const skills = profile.skills || [];
  const services = profile.services || [];
  const projects = profile.portfolioProjects || [];
  const hasBio = Boolean(profile.bio);
  const hasSkills = skills.length > 0;
  const hasServices = services.length > 0;
  const hasProjects = projects.length > 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="rounded-2xl border border-slate-200 bg-white shadow-none sm:rounded-[1.5rem]">
        <SectionHeader title="نبذة عني" section="about" onEdit={onEdit} />
        <CardContent className="px-4 py-4 text-right text-sm leading-7 text-slate-500 sm:px-6 sm:py-5 sm:text-base">
          {hasBio ? (
            <p className="whitespace-pre-line break-words">{profile.bio}</p>
          ) : (
            <EmptyState
              icon={FileText}
              title="لم تضف نبذة بعد"
              description="عرّف العملاء بنفسك وخبراتك بكلمات مختصرة."
              actionLabel="أضف نبذة عنك"
              onAction={() => onEdit?.("about")}
            />
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-slate-200 bg-white shadow-none sm:rounded-[1.5rem]">
        <SectionHeader
          title="المهارات"
          section="skills"
          withAddAction
          onEdit={onEdit}
        />
        <CardContent className="px-4 py-4 sm:px-6 sm:py-5">
          {hasSkills ? (
            <div className="flex flex-wrap justify-end gap-2 sm:gap-3">
              {skills.map((skill, index) => (
                <Badge
                  key={`${skill}-${index}`}
                  variant="secondary"
                  className="rounded-lg border-transparent bg-[#F5F5FF] px-3 py-1.5 text-xs font-semibold text-[#5D5BDA] shadow-none hover:bg-[#EBEBFF] sm:px-4 sm:py-2 sm:text-sm"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Sparkles}
              title="لم تضف مهارات بعد"
              description="أبرز مهاراتك ليسهل على العملاء معرفة خبراتك."
              actionLabel="أضف مهاراتك"
              onAction={() => onEdit?.("skills")}
            />
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-slate-200 bg-white shadow-none sm:rounded-[1.5rem]">
        <SectionHeader
          title="خدماتي"
          section="services"
          withAddAction
          onEdit={onEdit}
        />
        <CardContent className="px-4 py-4 sm:px-6 sm:py-5">
          {hasServices ? (
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              {services.map((service) => (
                <article
                  key={service.id || service._key}
                  className="rounded-xl border border-slate-100 bg-white p-4 text-right transition-shadow hover:border-[#E0E0FF] hover:shadow-sm"
                >
                  <p className="break-words text-sm font-bold text-slate-700 sm:text-base">
                    {service.title}
                  </p>
                  {service.description ? (
                    <p className="mt-2 line-clamp-2 break-words text-xs leading-6 text-slate-500 sm:text-sm">
                      {service.description}
                    </p>
                  ) : null}

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
                    <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 font-semibold text-slate-500">
                      <Clock3 className="h-4 w-4 shrink-0" />
                      <span className="truncate">
                        {service.deliveryTime || "—"}
                      </span>
                    </span>
                    <span className="shrink-0 rounded-full bg-[#F5F5FF] px-2.5 py-1 text-sm font-bold text-[#5D5BDA] sm:text-base">
                      {typeof service.price === "number"
                        ? `$${Number(service.price).toLocaleString()}`
                        : "—"}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Briefcase}
              title="لم تضف خدمات بعد"
              description="أضف خدماتك ليبدأ العملاء بالتواصل معك."
              actionLabel="أضف أول خدمة"
              onAction={() => onEdit?.("services")}
            />
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-slate-200 bg-white shadow-none sm:rounded-[1.5rem]">
        <SectionHeader
          title="أعمالي"
          section="portfolio"
          withAddAction
          onEdit={onEdit}
        />
        <CardContent className="px-4 py-4 sm:px-6 sm:py-5">
          {hasProjects ? (
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
              {projects.map((project) => {
                const imageSrc = project.imageUrl || project.image;
                const imageCard = (
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100">
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={project.title}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400">
                        <ImageIcon className="h-6 w-6" />
                        <span className="text-xs font-medium">بدون صورة</span>
                      </div>
                    )}
                  </div>
                );

                return (
                  <div
                    key={project.id || project._key}
                    className="group flex flex-col"
                  >
                    {project.link ? (
                      <Link
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                        className="block"
                      >
                        {imageCard}
                      </Link>
                    ) : (
                      imageCard
                    )}

                    <div className="mt-3 flex items-center justify-between px-1">
                      <p className="break-words text-sm font-bold text-slate-700">
                        {project.title}
                      </p>
                      {project.link ? (
                        <Link
                          href={project.link}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`فتح العمل ${project.title}`}
                          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-[#F5F5FF] hover:text-[#5D5BDA]"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      ) : (
                        <span className="rounded-full bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-400">
                          بدون رابط
                        </span>
                      )}
                    </div>

                    <div className="mt-3 h-1 w-full rounded-full bg-slate-100" />
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={ImageIcon}
              title="لم تضف أعمالاً بعد"
              description="استعرض أعمالك السابقة لتعزز ثقة العملاء بك."
              actionLabel="أضف أول مشروع"
              onAction={() => onEdit?.("portfolio")}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
