"use client";
import { useFreelancerProjects } from "../model/useFreelancerProjects";
import { FreelancerProjectCard } from "./components/FreelancerProjectCard";
import { FreelancerProjectFilters } from "./components/FreelancerProjectFilters";
import { FreelancerProjectsPagination } from "./components/FreelancerProjectsPagination";

export function FreelancerProjectsPage() {
  const {
    activeTab,
    setActiveTab,
    counts,
    currentPage,
    setCurrentPage,
    totalPages,
    projectsPerPage,
    paginatedProjects,
    getProgress,
  } = useFreelancerProjects();

  const emptySlots = Math.max(projectsPerPage - paginatedProjects.length, 0);

  return (
    <div
      dir="rtl"
      className="min-h-screen rounded-3xl bg-[#F8F9FB] p-4 sm:p-6 lg:p-10"
    >
      <div className="space-y-6">
        <header className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-[#1F2937] sm:text-3xl">
            المشاريع
          </h1>
        </header>

        <FreelancerProjectFilters
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={counts}
        />

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {paginatedProjects.map((project) => (
            <FreelancerProjectCard
              key={project.id}
              project={project}
              progress={getProgress(project.startDate, project.totalDays)}
            />
          ))}
        </section>

        <FreelancerProjectsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
