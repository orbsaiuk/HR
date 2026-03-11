import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MarkdownContent } from "@/components/ui/markdown-content";

export function CareerDetailContent({ position }) {
    const hasDescription = Boolean(position.description);
    const hasRequirements = Boolean(position.requirements);

    if (!hasDescription && !hasRequirements) return null;

    return (
        <div className="lg:col-span-2 space-y-6">
            {hasDescription && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg md:text-xl font-semibold">
                            عن الوظيفة
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <MarkdownContent content={position.description} />
                    </CardContent>
                </Card>
            )}

            {hasRequirements && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg md:text-xl font-semibold">
                            المتطلبات
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <MarkdownContent content={position.requirements} />
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
