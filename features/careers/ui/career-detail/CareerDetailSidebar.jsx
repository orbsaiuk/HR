import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { MapPin, Users, Briefcase, Lock } from "lucide-react";
import {
  TYPE_LABELS,
  formatSalary,
} from "../components/position-card/positionCardUtils";

export function CareerDetailSidebar({
  position,
  positionId,
  isSignedIn,
  isLoaded,
}) {
  const salary = formatSalary(
    position.salaryMin,
    position.salaryMax,
    position.currency,
  );

  return (
    <div className="space-y-4 lg:sticky lg:top-8 lg:self-start">
      {/* Action + Details Card */}
      <Card>
        <CardHeader>
          <div className="space-y-3">
            {isLoaded && !isSignedIn ? (
              <SignInButton
                mode="modal"
                forceRedirectUrl={`/careers/${positionId}/apply`}
              >
                <Button
                  className="w-full bg-[#5286A5] hover:bg-[#5286A5]/90"
                  size="lg"
                >
                  <Lock size={16} className="me-2" />
                  سجّل دخول للتقديم
                </Button>
              </SignInButton>
            ) : (
              <Button
                asChild
                className="w-full bg-[#5286A5] hover:bg-[#5286A5]/90"
                size="lg"
              >
                <Link href={`/careers/${positionId}/apply`}>للتقديم الآن</Link>
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <dl className="divide-y divide-gray-100">
            {position.type && (
              <DetailRow
                icon={<Briefcase size={14} />}
                label="نوع الوظيفة"
                value={TYPE_LABELS[position.type] || position.type}
              />
            )}

            {salary && (
              <DetailRow
                icon={
                  <span className="text-xs font-semibold uppercase text-muted-foreground">
                    {position.currency || "USD"}
                  </span>
                }
                label="الراتب"
                value={salary}
              />
            )}

            {position.location && (
              <DetailRow
                icon={<MapPin size={14} />}
                label="الموقع"
                value={position.location}
              />
            )}

            {position.applicationCount != null && (
              <DetailRow
                icon={<Users size={14} />}
                label="المتقدمون"
                value={`${position.applicationCount} متقدم`}
              />
            )}
          </dl>
        </CardContent>
      </Card>

      {/* Posted date */}
      {position.createdAt && (
        <p className="text-xs text-gray-400 text-center">
          تم النشر{" "}
          {new Date(position.createdAt).toLocaleDateString("ar-EG", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      )}
    </div>
  );
}

/* ── tiny presentational helper ── */
function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between px-6 py-3">
      <dt className="text-sm text-muted-foreground flex items-center gap-2">
        {icon}
        {label}
      </dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}
