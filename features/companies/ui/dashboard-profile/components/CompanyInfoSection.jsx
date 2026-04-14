"use client";

import { Button } from "@/components/ui/button";
import { SquarePen, SquarePlus } from "lucide-react";

/**
 * Company bio / description section with edit button.
 */
export function CompanyInfoSection({ description, onEdit }) {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl border p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground">معلومات الشركة</h2>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-[#462EA8] hover:bg-[#462EA8]/10 hover:text-[#462EA8]"
                    onClick={onEdit}
                >
                    {description ? <SquarePen size={18} /> : <SquarePlus size={18} />}
                </Button>
            </div>
            {description ? (
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {description}
                </p>
            ) : (
                <p className="text-muted-foreground/50 italic">
                    لم يتم إضافة وصف للشركة بعد. اضغط على زر التعديل لإضافة وصف.
                </p>
            )}
        </div>
    );
}
