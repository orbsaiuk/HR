"use client";

import { FormViewer } from "@/features/forms/components/FormViewer/FormViewer.jsx";
import { Card, CardContent } from "@/components/ui/card";

export function ApplyWithFormSection({ form, onSubmit, submitting }) {
    return (
        <Card>
            <CardContent className="pt-6">
                <FormViewer form={form} onSubmit={onSubmit} submitting={submitting} />
            </CardContent>
        </Card>
    );
}
