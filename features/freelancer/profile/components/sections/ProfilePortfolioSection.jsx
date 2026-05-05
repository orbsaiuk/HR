"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, ImageIcon, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "./SectionHeader";
import { EmptyState } from "../shared/EmptyState";
import { DotsPagination } from "../shared/DotsPagination";

const CARDS_PER_PAGE = 4;

export function ProfilePortfolioSection({
  profile,
  onAddProject,
  onEditProject,
  onDeleteProject,
}) {
  const projects = profile?.portfolioProjects || [];
  const hasProjects = projects.length > 0;
  const [page, setPage] = useState(0);

  const paginatedProjects = projects.slice(
    page * CARDS_PER_PAGE,
    (page + 1) * CARDS_PER_PAGE
  );

  useEffect(() => {
    if (page > 0 && page * CARDS_PER_PAGE >= projects.length) {
      setPage(Math.max(0, Math.ceil(projects.length / CARDS_PER_PAGE) - 1));
    }
  }, [projects.length, page]);

  return (
    <Card className="rounded-2xl border border-slate-200 bg-white shadow-none sm:rounded-[1.5rem]">
      <SectionHeader
        title="أعمالي"
        section="portfolio"
        isEmpty={!hasProjects}
        onAdd={onAddProject}
      />
      <CardContent className="px-4 py-4 sm:px-6 sm:py-5">
        {hasProjects ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
              {paginatedProjects.map((project) => {
                const imageSrc = project.imageUrl || project.image;
                const imageCard = (
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100">
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={project.title}
                        fill
                        className="object-cover transition duration-300 hover:scale-105"
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
                    className="group relative flex flex-col"
                  >
                    <div className="absolute left-2 top-2 z-10 flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 bg-white/80 text-slate-400 backdrop-blur-sm hover:text-[#5D5BDA]"
                        onClick={() => onEditProject?.(project)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 bg-white/80 text-slate-400 backdrop-blur-sm hover:text-red-500"
                        onClick={() => onDeleteProject?.(project)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
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
            <DotsPagination
              total={projects.length}
              perPage={CARDS_PER_PAGE}
              currentPage={page}
              onChange={setPage}
            />
          </>
        ) : (
          <EmptyState
            icon={ImageIcon}
            title="لم تضف أعمالاً بعد"
            description="استعرض أعمالك السابقة لتعزز ثقة العملاء بك."
            actionLabel="أضف أول مشروع"
            onAction={onAddProject}
          />
        )}
      </CardContent>
    </Card>
  );
}
