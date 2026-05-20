"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompanyProjects } from "../../model/useCompanyProjects";
import { useCompanyProjectsFilters } from "../../model/useCompanyProjectsFilters";
import { ProjectsEmptyState } from "../components/ProjectsEmptyState";
import { ProjectsPagination } from "../components/ProjectsPagination";
import { CompanyProjectCard } from "./components/CompanyProjectCard";
import { CreateProjectDialog } from "./components/CreateProjectDialog";
import { DeleteProjectDialog } from "./components/DeleteProjectDialog";
import { CompanyProjectsFilters, CompanyProjectsSkeleton } from "./components";

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
    return <CompanyProjectsSkeleton />;
  }

  if (!loading && projects.length === 0) {
    return (
      <section className="p-4 sm:p-6 lg:p-8" dir="rtl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              إدارة المشاريع
            </h1>
            <p className="mt-1 text-sm text-gray-500 sm:text-base">
              إدارة مشاريع الشركة ومتابعة حالة التنفيذ.
            </p>
          </div>
        </div>

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

      <DeleteProjectDialog
        project={projectToDelete}
        onOpenChange={setProjectToDelete}
        onConfirm={handleConfirmDelete}
      />
    </section>
  );
}
