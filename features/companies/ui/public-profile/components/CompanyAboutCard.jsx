import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Building2 } from "lucide-react";

export function CompanyAboutCard({ company }) {
    if (!company.description) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 size={18} />
                    عن {company.name}
                </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                    {company.description}
                </p>
            </CardContent>
        </Card>
    );
}
