"use client";

import { useState, useEffect } from "react";
import { Briefcase, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "./SectionHeader";
import { EmptyState } from "../shared/EmptyState";
import { DotsPagination } from "../shared/DotsPagination";

const CARDS_PER_PAGE = 4;

export function ProfileServicesSection({
  profile,
  onAddService,
  onEditService,
  onDeleteService,
}) {
  const services = profile?.services || [];
  const hasServices = services.length > 0;
  const [page, setPage] = useState(0);

  const paginatedServices = services.slice(
    page * CARDS_PER_PAGE,
    (page + 1) * CARDS_PER_PAGE
  );

  useEffect(() => {
    if (page > 0 && page * CARDS_PER_PAGE >= services.length) {
      setPage(Math.max(0, Math.ceil(services.length / CARDS_PER_PAGE) - 1));
    }
  }, [services.length, page]);

  return (
    <Card className="rounded-2xl border border-slate-200 bg-white shadow-none sm:rounded-[1.5rem]">
      <SectionHeader
        title="خدماتي"
        section="services"
        isEmpty={!hasServices}
        onAdd={onAddService}
      />
      <CardContent className="px-4 py-4 sm:px-6 sm:py-5">
        {hasServices ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              {paginatedServices.map((service) => (
                <article
                  key={service.id || service._key}
                  className="relative rounded-xl border border-slate-100 bg-white p-4 text-right transition-shadow hover:border-[#E0E0FF] hover:shadow-sm"
                >
                  <div className="absolute left-4 top-4 flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-slate-400 hover:text-[#5D5BDA]"
                      onClick={() => onEditService?.(service)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-slate-400 hover:text-red-500"
                      onClick={() => onDeleteService?.(service)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="break-words pl-14 text-sm font-bold text-slate-700 sm:text-base">
                    {service.title}
                  </p>
                  {service.description ? (
                    <p className="mt-2 line-clamp-2 break-words text-xs leading-6 text-slate-500 sm:text-sm">
                      {service.description}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
            <DotsPagination
              total={services.length}
              perPage={CARDS_PER_PAGE}
              currentPage={page}
              onChange={setPage}
            />
          </>
        ) : (
          <EmptyState
            icon={Briefcase}
            title="لم تضف خدمات بعد"
            description="أضف خدماتك ليبدأ العملاء بالتواصل معك."
            actionLabel="أضف أول خدمة"
            onAction={onAddService}
          />
        )}
      </CardContent>
    </Card>
  );
}
