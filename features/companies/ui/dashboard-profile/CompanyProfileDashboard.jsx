"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useCompanyProfile } from "../../model/useCompanyProfile";
import { CompanyProfileDashboardSkeleton } from "./CompanyProfileDashboardSkeleton";
import { CompanyProfileHeader } from "./components/CompanyProfileHeader";
import { CompanyInfoSection } from "./components/CompanyInfoSection";
import { CompanyContactSection } from "./components/CompanyContactSection";
import { CompanyServicesSection } from "./components/CompanyServicesSection";
import { CompanyLocationsSection } from "./components/CompanyLocationsSection";
import { CompanyPositionsSection } from "./components/CompanyPositionsSection";
import { EditHeaderDialog } from "./components/dialogs/EditHeaderDialog";
import { EditBioDialog } from "./components/dialogs/EditBioDialog";
import { EditContactDialog } from "./components/dialogs/EditContactDialog";
import { EditLocationsDialog } from "./components/dialogs/EditLocationsDialog";
import { Error } from "@/shared/components/feedback/Error";

/**
 * Main company profile dashboard page component.
 * Displays editable company profile sections.
 */
export function CompanyProfileDashboard() {
    const { company, loading, saving, error, updateProfile } = useCompanyProfile();

    // Dialog open states
    const [headerOpen, setHeaderOpen] = useState(false);
    const [bioOpen, setBioOpen] = useState(false);
    const [contactOpen, setContactOpen] = useState(false);
    const [locationsOpen, setLocationsOpen] = useState(false);

    if (loading) return <CompanyProfileDashboardSkeleton />;
    if (error) return <Error message={error} />;
    if (!company) return <Error message="لم يتم العثور على بيانات الشركة" />;

    const handleSave = async (updates) => {
        const result = await updateProfile(updates);
        if (result.success) {
            toast.success("تم تحديث البيانات بنجاح");
            // Close all dialogs
            setHeaderOpen(false);
            setBioOpen(false);
            setContactOpen(false);
            setLocationsOpen(false);
        } else {
            toast.error(result.error || "فشل في تحديث البيانات");
        }
    };

    return (
        <div dir="rtl" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <CompanyProfileHeader
                company={company}
                onEdit={() => setHeaderOpen(true)}
            />

            {/* Body: Main Content + Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content - 2/3 */}
                <div className="lg:col-span-2 space-y-8">
                    <CompanyInfoSection
                        description={company.description}
                        onEdit={() => setBioOpen(true)}
                    />

                    <CompanyContactSection
                        socialLinks={company.socialLinks}
                        onEdit={() => setContactOpen(true)}
                    />

                    <CompanyServicesSection
                        services={company.services || []}
                        onSave={handleSave}
                        saving={saving}
                    />

                    <CompanyPositionsSection
                        positions={company.openPositions || []}
                    />
                </div>

                {/* Sidebar - 1/3 */}
                <div className="space-y-8">
                    <CompanyLocationsSection
                        location={company.location}
                        officeLocations={company.officeLocations || []}
                        onEdit={() => setLocationsOpen(true)}
                    />
                </div>
            </div>

            {/* Edit Dialogs */}
            <EditHeaderDialog
                open={headerOpen}
                onOpenChange={setHeaderOpen}
                company={company}
                onSave={handleSave}
                saving={saving}
            />

            <EditBioDialog
                open={bioOpen}
                onOpenChange={setBioOpen}
                description={company.description}
                onSave={handleSave}
                saving={saving}
            />

            <EditContactDialog
                open={contactOpen}
                onOpenChange={setContactOpen}
                socialLinks={company.socialLinks}
                onSave={handleSave}
                saving={saving}
            />

            <EditLocationsDialog
                open={locationsOpen}
                onOpenChange={setLocationsOpen}
                officeLocations={company.officeLocations || []}
                onSave={handleSave}
                saving={saving}
            />
        </div>
    );
}
