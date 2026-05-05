"use client";

import { useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DeleteConfirmDialog,
  FreelancerProfileEditDialog,
  FreelancerProjectEditDialog,
  FreelancerServiceEditDialog,
  ProfileContent,
  ProfileHeader,
  ProfileSidebar,
} from "../components";
import { useFreelancerProfile } from "../../model/useFreelancerProfile";

export function FreelancerProfilePage() {
  const {
    profile,
    loading,
    error,
    updateProfile,
    uploadPortfolioImage,
    saving,
    refetch,
  } = useFreelancerProfile();

  const [editSection, setEditSection] = useState(null);
  const isEditDialogOpen = Boolean(editSection);

  const [serviceDialogState, setServiceDialogState] = useState({
    isOpen: false,
    service: null,
  });

  const [projectDialogState, setProjectDialogState] = useState({
    isOpen: false,
    project: null,
  });

  const [deleteConfirmState, setDeleteConfirmState] = useState({
    isOpen: false,
    service: null,
  });

  const [deleteProjectConfirmState, setDeleteProjectConfirmState] = useState({
    isOpen: false,
    project: null,
  });

  function handleEdit(section) {
    setEditSection(section);
  }

  function handleCloseDialog() {
    setEditSection(null);
  }

  function handleAddService() {
    setServiceDialogState({ isOpen: true, service: null });
  }

  function handleEditService(service) {
    setServiceDialogState({ isOpen: true, service });
  }

  function handleDeleteServiceClick(service) {
    setDeleteConfirmState({ isOpen: true, service });
  }

  async function handleConfirmDeleteService() {
    const { service } = deleteConfirmState;
    if (!service) return;

    try {
      const currentServices = profile?.services || [];
      const updatedServices = currentServices.filter(
        (s) =>
          (s._key && s._key !== service._key) || (s.id && s.id !== service.id),
      );
      await handleSave({ services: updatedServices });
    } finally {
      setDeleteConfirmState({ isOpen: false, service: null });
    }
  }

  function handleAddProject() {
    setProjectDialogState({ isOpen: true, project: null });
  }

  function handleEditProject(project) {
    setProjectDialogState({ isOpen: true, project });
  }

  function handleDeleteProjectClick(project) {
    setDeleteProjectConfirmState({ isOpen: true, project });
  }

  async function handleConfirmDeleteProject() {
    const { project } = deleteProjectConfirmState;
    if (!project) return;

    try {
      const currentProjects = profile?.portfolioProjects || [];
      const updatedProjects = currentProjects.filter(
        (p) =>
          (p._key && p._key !== project._key) || (p.id && p.id !== project.id),
      );
      await handleSave({ portfolioProjects: updatedProjects });
    } finally {
      setDeleteProjectConfirmState({ isOpen: false, project: null });
    }
  }

  async function handleSaveProject(projectData) {
    const { imageFile, ...data } = projectData;
    let imageUrl = data.imageUrl || "";
    let image = data.image;

    try {
      if (imageFile) {
        const uploadResult = await uploadPortfolioImage(imageFile);
        imageUrl = uploadResult.imageUrl;
        image = uploadResult.image;
      }

      const currentProjects = profile?.portfolioProjects || [];
      let updatedProjects;

      const projectWithFullData = { ...data, imageUrl, image };
      delete projectWithFullData.imageFile;

      if (projectWithFullData._key || projectWithFullData.id) {
        updatedProjects = currentProjects.map((p) =>
          (p._key && p._key === projectWithFullData._key) ||
          (p.id && p.id === projectWithFullData.id)
            ? { ...p, ...projectWithFullData }
            : p,
        );
      } else {
        updatedProjects = [...currentProjects, projectWithFullData];
      }

      await handleSave({ portfolioProjects: updatedProjects });
      setProjectDialogState({ isOpen: false, project: null });
    } catch (err) {
      // Error handled in hooks
    }
  }

  async function handleSaveService(serviceData) {
    const currentServices = profile?.services || [];
    let updatedServices;

    if (serviceData._key || serviceData.id) {
      updatedServices = currentServices.map((s) =>
        (s._key && s._key === serviceData._key) ||
        (s.id && s.id === serviceData.id)
          ? { ...s, ...serviceData }
          : s,
      );
    } else {
      updatedServices = [...currentServices, serviceData];
    }

    await handleSave({ services: updatedServices });
    setServiceDialogState({ isOpen: false, service: null });
  }

  async function handleSave(payload) {
    try {
      await updateProfile(payload);
      toast.success("تم حفظ التغييرات بنجاح");
    } catch (err) {
      toast.error(err.message || "فشل حفظ التغييرات");
      throw err;
    }
  }

  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen p-3 sm:p-4 lg:p-6">
        <Skeleton className="mb-4 h-8 w-32 sm:mb-6" />
        <Skeleton className="mb-4 h-28 rounded-2xl sm:mb-6" />
        <div
          className="grid gap-4 sm:gap-6 lg:grid-cols-[19rem_minmax(0,1fr)]"
          style={{ direction: "ltr" }}
        >
          <aside
            dir="rtl"
            className="order-2 space-y-4 sm:space-y-6 lg:order-1"
          >
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-40 rounded-2xl" />
          </aside>
          <section
            dir="rtl"
            className="order-1 space-y-4 sm:space-y-6 lg:order-2"
          >
            <Skeleton className="h-72 rounded-2xl" />
            <Skeleton className="h-44 rounded-2xl" />
            <Skeleton className="h-56 rounded-2xl" />
          </section>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        dir="rtl"
        className="flex min-h-[60vh] items-center justify-center p-6 text-center"
      >
        <Card className="w-full max-w-md rounded-2xl border-red-100 p-6 shadow-none">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
            <AlertCircle className="h-6 w-6" />
          </div>
          <p className="text-base font-bold text-slate-800">
            تعذر تحميل البروفايل
          </p>
          <p className="mt-2 break-words text-sm text-slate-500">{error}</p>
          {refetch ? (
            <Button type="button" className="mt-5 rounded-xl" onClick={refetch}>
              <RefreshCw className="h-4 w-4" />
              إعادة المحاولة
            </Button>
          ) : null}
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 text-center text-slate-500">
        لم يتم العثور على البروفايل
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen p-3 sm:p-4 lg:p-6">
      <header className="mb-4 flex flex-col gap-3 px-1 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:px-2">
        <h1 className="text-xl font-bold text-[#1F2937] sm:text-2xl lg:text-3xl">
          البروفايل
        </h1>
      </header>

      <div
        className="grid gap-4 sm:gap-6 lg:grid-cols-[19rem_minmax(0,1fr)]"
        style={{ direction: "ltr" }}
      >
        <aside dir="rtl" className="order-2 space-y-4 sm:space-y-6 lg:order-1">
          <ProfileSidebar profile={profile} onEdit={handleEdit} />
        </aside>

        <section
          dir="rtl"
          className="order-1 space-y-4 sm:space-y-6 lg:order-2"
        >
          <ProfileHeader
            profile={profile}
            onEdit={() => handleEdit("header")}
          />
          <ProfileContent
            profile={profile}
            onEdit={handleEdit}
            onAddService={handleAddService}
            onEditService={handleEditService}
            onDeleteService={handleDeleteServiceClick}
            onAddProject={handleAddProject}
            onEditProject={handleEditProject}
            onDeleteProject={handleDeleteProjectClick}
          />
        </section>
      </div>

      <FreelancerProfileEditDialog
        open={isEditDialogOpen}
        onOpenChange={handleCloseDialog}
        section={editSection}
        profile={profile}
        saving={saving}
        onSave={handleSave}
        onUploadPortfolioImage={uploadPortfolioImage}
      />

      <FreelancerServiceEditDialog
        open={serviceDialogState.isOpen}
        onOpenChange={(isOpen) =>
          setServiceDialogState((prev) => ({ ...prev, isOpen }))
        }
        service={serviceDialogState.service}
        saving={saving}
        onSave={handleSaveService}
      />

      <DeleteConfirmDialog
        open={deleteConfirmState.isOpen}
        onOpenChange={(isOpen) =>
          setDeleteConfirmState((prev) => ({ ...prev, isOpen }))
        }
        title="حذف الخدمة"
        description="هل أنت متأكد من حذف هذه الخدمة؟ لا يمكن التراجع عن هذا الإجراء."
        onConfirm={handleConfirmDeleteService}
        isDeleting={saving}
      />

      <FreelancerProjectEditDialog
        open={projectDialogState.isOpen}
        onOpenChange={(isOpen) =>
          setProjectDialogState((prev) => ({ ...prev, isOpen }))
        }
        project={projectDialogState.project}
        saving={saving}
        onSave={handleSaveProject}
      />

      <DeleteConfirmDialog
        open={deleteProjectConfirmState.isOpen}
        onOpenChange={(isOpen) =>
          setDeleteProjectConfirmState((prev) => ({ ...prev, isOpen }))
        }
        title="حذف العمل"
        description="هل أنت متأكد من حذف هذا العمل من معرض أعمالك؟ لا يمكن التراجع عن هذا الإجراء."
        onConfirm={handleConfirmDeleteProject}
        isDeleting={saving}
      />
    </div>
  );
}
