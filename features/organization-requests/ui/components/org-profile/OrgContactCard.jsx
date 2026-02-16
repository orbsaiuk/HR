import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Mail, Phone, Globe, ExternalLink } from "lucide-react";
import { DetailRow } from "./DetailRow";

/**
 * Card displaying organization contact information.
 */
export function OrgContactCard({ request }) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                    <Mail size={16} className="text-blue-600" />
                    Contact Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
                <DetailRow icon={Mail} label="Email">
                    <a
                        href={`mailto:${request.contactEmail}`}
                        className="text-blue-600 hover:underline"
                    >
                        {request.contactEmail}
                    </a>
                </DetailRow>
                {request.contactPhone && (
                    <DetailRow icon={Phone} label="Phone">
                        {request.contactPhone}
                    </DetailRow>
                )}
                {request.orgWebsite && (
                    <DetailRow icon={Globe} label="Website">
                        <a
                            href={request.orgWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                            {request.orgWebsite.replace(/^https?:\/\//, "")}
                            <ExternalLink size={12} />
                        </a>
                    </DetailRow>
                )}
            </CardContent>
        </Card>
    );
}
