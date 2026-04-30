"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useCompanyProjects } from "../../model/useCompanyProjects";
import { useCompanyProjectsFilters } from "../../model/useCompanyProjectsFilters";
import { ProjectsPagination } from "../components/ProjectsPagination";
import { CompanyProjectCard } from "./CompanyProjectCard";
import { CreateProjectDialog } from "./CreateProjectDialog";
import { CompanyProjectsFilters } from "./components/CompanyProjectsFilters";

const COMPANY_PROJECTS_PER_PAGE = 5;

export function CompanyProjectsPage() {
  const { projects, setProjects, loading, createProject, updateProject, deleteProject } = useCompanyProjects();
  const [currentPage, setCurrentPage] = useState(1);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    filteredProjects,
    hasActiveFilters,
    clearFilters,
  } = useCompanyProjectsFilters(projects);

  const totalPages = Math.ceil(
    filteredProjects.length / COMPANY_PROJECTS_PER_PAGE,
  );

  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * COMPANY_PROJECTS_PER_PAGE;
    return filteredProjects.slice(start, start + COMPANY_PROJECTS_PER_PAGE);
  }, [filteredProjects, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, categoryFilter]);

  useEffect(() => {
    setCurrentPage((previousPage) => {
      const safeTotalPages = Math.max(totalPages, 1);
      return Math.min(previousPage, safeTotalPages);
    });
  }, [totalPages]);

  const handleCreateProject = async (projectPayload) => {
    try {
      await createProject(projectPayload);
      setCurrentPage(1);
      setIsEditDialogOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await deleteProject(projectId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProject = async (projectId, payload) => {
    try {
      await updateProject(projectId, payload);
      setIsEditDialogOpen(false);
      setProjectToEdit(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditRequest = (project) => {
    setProjectToEdit(project);
    setIsEditDialogOpen(true);
  };

  const handleEditDialogOpenChange = (open) => {
    setIsEditDialogOpen(open);
    if (!open) {
      setProjectToEdit(null);
    }
  };

  const handleDeleteRequest = (project) => {
    setProjectToDelete(project);
  };

  const handleConfirmDelete = () => {
    if (!projectToDelete?.id) return;
    handleDeleteProject(projectToDelete.id);
    setProjectToDelete(null);
  };

  if (loading) {
    return (
      <section className="p-4 sm:p-6 lg:p-8" dir="rtl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/4 rounded bg-gray-200"></div>
          <div className="h-32 rounded bg-gray-200"></div>
        </div>
      </section>
    );
  }

  if (!loading && projects.length === 0) {
    return (
      <section className="p-4 sm:p-6 lg:p-8" dir="rtl">
        <ProjectsEmptyState onCreateClick={() => setIsEditDialogOpen(true)} userType="company" />
        <CreateProjectDialog
          hideTrigger
          open={isEditDialogOpen}
          onOpenChange={handleEditDialogOpenChange}
          projectToEdit={projectToEdit}
          onCreate={handleCreateProject}
          onUpdate={handleUpdateProject}
        />
      </section>
    );
  }

  return (
    <section className="p-4 sm:p-6 lg:p-8" dir="rtl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            إدارة المشاريع
          </h1>
          <p className="mt-1 text-sm text-gray-500 sm:text-base">
            إدارة مشاريع الشركة ومتابعة حالة التنفيذ.
          </p>
        </div>

        <Button
          type="button"
          className="w-full bg-[#5338D5] hover:bg-[#462EA8] sm:w-auto"
          onClick={() => {
            setProjectToEdit(null);
            setIsEditDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          إضافة مشروع
        </Button>

        <CreateProjectDialog
          hideTrigger
          open={isEditDialogOpen}
          onOpenChange={handleEditDialogOpenChange}
          projectToEdit={projectToEdit}
          onCreate={handleCreateProject}
          onUpdate={handleUpdateProject}
        />
      </div>

      <div className="mt-6 space-y-4">
        <CompanyProjectsFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
          resultCount={filteredProjects.length}
        />

        {filteredProjects.length > 0 ? (
          <>
            {paginatedProjects.map((project) => (
              <CompanyProjectCard
                key={project.id || project._id}
                project={project}
                onEdit={handleEditRequest}
                onDelete={handleDeleteRequest}
              />
            ))}

            <ProjectsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <div className="rounded-sm border border-dashed border-[#D8DFEC] bg-white p-6 text-center text-sm text-[#6F778C]">
            لا توجد مشاريع مطابقة للفلاتر الحالية.
          </div>
        )}
      </div>

      <AlertDialog
        open={!!projectToDelete}
        onOpenChange={(open) => !open && setProjectToDelete(null)}
      >
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف المشروع؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف المشروع
              {projectToDelete?.title ? ` "${projectToDelete.title}"` : ""}
              نهائياً ولا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="flex gap-2 sm:justify-start">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              حذف المشروع
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
