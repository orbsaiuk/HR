"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { OrgBasicInfoFields } from "./OrgBasicInfoFields";
import { OrgContactFields } from "./OrgContactFields";
import { OrgDetailsFields } from "./OrgDetailsFields";
import { OrgLogoUpload } from "./OrgLogoUpload";
import { OrgRegistrationSubmitBar } from "./OrgRegistrationSubmitBar";

const orgRegistrationSchema = z.object({
    orgName: z.string().min(2, "Organization name must be at least 2 characters"),
    orgSlug: z
        .string()
        .regex(/^[a-z0-9-]*$/, "Slug must contain only lowercase letters, numbers, and hyphens")
        .optional()
        .or(z.literal("")),
    orgDescription: z.string().optional(),
    orgWebsite: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    orgIndustry: z.string().optional(),
    orgSize: z.string().optional(),
    contactEmail: z.string().email("Must be a valid email address"),
    contactPhone: z.string().optional(),
    orgLogo: z
        .any()
        .refine((val) => val instanceof File, { message: "Organization logo is required" }),
});

const defaultValues = {
    orgName: "",
    orgSlug: "",
    orgDescription: "",
    orgWebsite: "",
    orgIndustry: "",
    orgSize: "",
    contactEmail: "",
    contactPhone: "",
    orgLogo: null,
};

export function OrgRegistrationForm({ onSubmit, submitting }) {
    const methods = useForm({
        resolver: zodResolver(orgRegistrationSchema),
        defaultValues,
    });

    const handleSubmit = methods.handleSubmit((data) => {
        // Clean up empty optional fields
        const cleaned = { ...data };
        if (!cleaned.orgSlug) delete cleaned.orgSlug;
        if (!cleaned.orgWebsite) delete cleaned.orgWebsite;
        if (!cleaned.orgIndustry) delete cleaned.orgIndustry;
        if (!cleaned.orgSize) delete cleaned.orgSize;
        if (!cleaned.contactPhone) delete cleaned.contactPhone;
        if (!cleaned.orgDescription) delete cleaned.orgDescription;

        onSubmit(cleaned);
    });

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <OrgBasicInfoFields />
                <OrgContactFields />
                <OrgDetailsFields />
                <OrgLogoUpload />
                <OrgRegistrationSubmitBar submitting={submitting} />
            </form>
        </FormProvider>
    );
}
