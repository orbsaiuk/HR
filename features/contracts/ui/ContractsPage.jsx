"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ContractCategoryTabs } from "./ContractCategoryTabs";
import { ContractsPagination } from "./ContractsPagination";
import { ContractTemplateCard } from "./ContractTemplateCard";
import { CreateTemplateDialog } from "./CreateTemplateDialog";
import { SendContractDialog } from "./SendContractDialog";
import { useContractTemplates } from "../model/useContractTemplates";
import { usePermissions } from "@/features/org-members-management/model/usePermissions";
import { PERMISSIONS } from "@/shared/lib/permissions";

export function ContractsPage() {
  const { hasPermission } = usePermissions();
  const {
    setTemplates,
    filteredTemplates,
    categories,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
  } = useContractTemplates();

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const canManageContracts = hasPermission(PERMISSIONS.MANAGE_CONTRACTS);

  const PAGE_SIZE = 6;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTemplates.length / PAGE_SIZE),
  );
  const paginatedTemplates = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredTemplates.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredTemplates, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory]);

  useEffect(() => {
    setCurrentPage((previous) => Math.min(previous, totalPages));
  }, [totalPages]);

  const handleOpenCreateDialog = () => {
    if (!canManageContracts) {
      return;
    }

    setIsCreateDialogOpen(true);
  };

  const handleUseTemplate = (template) => {
    if (!canManageContracts) {
      return;
    }

    setSelectedTemplate(template);
    setIsSendDialogOpen(true);
  };

  const handleTemplateCreated = (template) => {
    if (!template?.id) {
      return;
    }

    setTemplates((previous) => {
      const withoutCurrent = previous.filter((item) => item.id !== template.id);
      return [template, ...withoutCurrent];
    });
    setIsCreateDialogOpen(false);
  };

  const handleContractSent = ({ templateId }) => {
    if (!templateId) {
      return;
    }

    setTemplates((previous) =>
      previous.map((template) => {
        if (template.id !== templateId) {
          return template;
        }

        return {
          ...template,
          usageCount: Number(template.usageCount || 0) + 1,
          lastUsed: "الآن",
          updatedAt: new Date().toISOString(),
        };
      }),
    );
  };

  return (
    <section className="space-y-5 p-4 sm:p-6 lg:p-8" dir="rtl">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937] sm:text-3xl">
            العقود
          </h1>
          <p className="text-sm text-[#6B7280] sm:text-base">
            أنشئ عقدك وحمّله فوراً بصيغة قابلة للمشاركة
          </p>
        </div>

        {canManageContracts ? (
          <Button
            type="button"
            onClick={handleOpenCreateDialog}
            className="w-full bg-[#5338D5] hover:bg-[#462EA8] sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            إنشاء قالب جديد
          </Button>
        ) : null}
      </header>

      <div className="rounded-lg border border-[#E4E8F2] bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA3B6]" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="ابحث عن قالب"
              className="h-10 border-[#DCE2EE] pr-9 text-right"
            />
          </div>

          <ContractCategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {paginatedTemplates.map((template) => (
            <ContractTemplateCard
              key={template.id}
              template={template}
              onUse={handleUseTemplate}
              canManage={canManageContracts}
            />
          ))}
        </div>

        {filteredTemplates.length > 0 && (
          <ContractsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

        {filteredTemplates.length === 0 && (
          <div className="mt-4 rounded-md border border-dashed border-[#D4DBEA] p-8 text-center text-sm text-[#7A8397]">
            لا توجد قوالب مطابقة للفلاتر الحالية.
          </div>
        )}

        <div className="mt-6 rounded-md bg-[#FFF8F8] p-5 text-center">
          <h2 className="text-xl font-bold text-[#1F2937]">
            كيف يعمل نظام العقود؟
          </h2>
          <p className="mt-2 text-sm leading-7 text-[#6B7280]">
            اختر القالب المناسب حسب احتياجك، أكمل البيانات، ثم حمّل العقد
            النهائي مباشرة. العقد يكون ملزم وواضح ومنظم يضمن حقوق الطرفين،
            ويمكنك أيضاً مشاركته أو حفظه للرجوع إليه لاحقاً.
          </p>
        </div>
      </div>

      <CreateTemplateDialog
        open={canManageContracts ? isCreateDialogOpen : false}
        onOpenChange={setIsCreateDialogOpen}
        onTemplateCreated={handleTemplateCreated}
      />

      <SendContractDialog
        open={canManageContracts ? isSendDialogOpen : false}
        onOpenChange={(nextOpen) => {
          setIsSendDialogOpen(nextOpen);
          if (!nextOpen) {
            setSelectedTemplate(null);
          }
        }}
        template={selectedTemplate}
        onContractSent={handleContractSent}
      />
    </section>
  );
}
