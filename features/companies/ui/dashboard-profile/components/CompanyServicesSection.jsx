"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SquarePlus, Briefcase, Pencil, Trash2 } from "lucide-react";
import { urlFor } from "@/shared/lib/sanityImage";
import { ServiceDialog } from "./dialogs/ServiceDialog";
import { DeleteServiceDialog } from "./dialogs/DeleteServiceDialog";

/**
 * Services section displaying service cards with inline actions.
 */
export function CompanyServicesSection({ services = [], onSave, saving }) {
    const [addOpen, setAddOpen] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [deleteIndex, setDeleteIndex] = useState(null);

    const handleAddSave = async (serviceData) => {
        const newService = {
            _key: `service-${Date.now()}`,
            title: serviceData.title,
            description: serviceData.description,
        };
        // Add image info if provided
        if (serviceData.imageBase64) newService.imageBase64 = serviceData.imageBase64;
        
        await onSave({ services: [...services, newService] });
        setAddOpen(false);
    };

    const handleEditSave = async (serviceData) => {
        if (editIndex === null) return;
        const updatedServices = [...services];
        const existingService = updatedServices[editIndex];
        
        const updatedService = {
            _key: existingService._key || `service-${Date.now()}`,
            title: serviceData.title,
            description: serviceData.description,
        };

        if (serviceData.imageBase64) {
            updatedService.imageBase64 = serviceData.imageBase64;
        } else if (serviceData.image && !serviceData.removeImage) {
            updatedService.image = serviceData.image;
        }
        
        updatedServices[editIndex] = updatedService;
        await onSave({ services: updatedServices });
        setEditIndex(null);
    };

    const handleDelete = async () => {
        if (deleteIndex === null) return;
        const updatedServices = services.filter((_, i) => i !== deleteIndex);
        await onSave({ services: updatedServices });
        setDeleteIndex(null);
    };

    const isEditing = editIndex !== null;
    const isDeleting = deleteIndex !== null;
    const editingService = isEditing ? services[editIndex] : null;
    const deletingService = isDeleting ? services[deleteIndex] : null;

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl border p-6">
            <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-foreground">الخدمات</h2>
                
                {services.length > 0 && (
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 text-[#462EA8] hover:bg-[#462EA8]/10 hover:text-[#462EA8] "
                        onClick={() => setAddOpen(true)}
                    >
                        <SquarePlus size={16} />
                    </Button>
                )}
            </div>

            {services.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {services.map((service, index) => (
                        <div
                            key={service._key || index}
                            className="group relative border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 bg-background flex flex-col h-full animate-in fade-in slide-in-from-bottom-4"
                            style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                        >
                            {/* Hover Actions Overlay */}
                            <div className="absolute top-2 left-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className="h-8 w-8 bg-white/90 hover:bg-white text-gray-700 shadow-sm backdrop-blur-sm"
                                    onClick={() => setEditIndex(index)}
                                    title="تعديل"
                                >
                                    <Pencil size={14} />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="destructive"
                                    className="h-8 w-8 shadow-sm backdrop-blur-sm text-white"
                                    onClick={() => setDeleteIndex(index)}
                                    title="حذف"
                                >
                                    <Trash2 size={14} />
                                </Button>
                            </div>

                            {/* Service Image */}
                            <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center overflow-hidden shrink-0">
                                {service.image ? (
                                    <Image
                                        src={urlFor(service.image).width(400).height(200).url()}
                                        alt={service.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        fill
                                    />
                                ) : (
                                    <div className="bg-white/50 dark:bg-black/20 p-4 rounded-full">
                                        <Briefcase size={32} className="text-muted-foreground/50" />
                                    </div>
                                )}
                                {/* Subtle overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            {/* Service Details */}
                            <div className="p-4 flex flex-col flex-1">
                                <h3 className="font-semibold text-foreground text-base mb-2 group-hover:text-primary transition-colors line-clamp-1">{service.title}</h3>
                                {service.description && (
                                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-2 flex-1">
                                        {service.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center py-12 border-2 border-dashed rounded-xl bg-muted/20">
                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                        <Briefcase size={32} className="text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">لا توجد خدمات مضافة</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mb-6">
                        قم بإضافة الخدمات التي تقدمها شركتك لتوضيح مجالات خبرتكم للعملاء والموظفين المحتملين.
                    </p>
                    <Button onClick={() => setAddOpen(true)} className="gap-2">
                        <Plus size={16} />
                        إضافة أول خدمة
                    </Button>
                </div>
            )}

            {/* Dialogs */}
            <ServiceDialog
                open={addOpen}
                onOpenChange={setAddOpen}
                service={null}
                onSave={handleAddSave}
                saving={saving}
            />

            <ServiceDialog
                open={isEditing}
                onOpenChange={(op) => !op && setEditIndex(null)}
                service={editingService}
                onSave={handleEditSave}
                saving={saving}
            />

            <DeleteServiceDialog
                open={isDeleting}
                onOpenChange={(op) => !op && setDeleteIndex(null)}
                title={deletingService?.title || ""}
                onConfirm={handleDelete}
                saving={saving}
            />
        </div>
    );
}
