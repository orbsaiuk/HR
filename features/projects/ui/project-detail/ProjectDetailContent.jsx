import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ProjectDetailContent({ project }) {
  const hasDescription = Boolean(project.description || project.shortDescription);
  const hasRequirements = Boolean(project.requirements?.length);
  const hasDeliverables = Boolean(project.deliverables?.length);
  const hasSkills = Boolean(project.skills?.length);

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Project Description */}
      {hasDescription && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl font-semibold">
              وصف المشروع
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {project.description || project.shortDescription}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Requirements */}
      {hasRequirements && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl font-semibold">
              المتطلبات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              {project.requirements.map((req, index) => (
                <li key={index} className="leading-relaxed">
                  {req}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      {/* Deliverables */}
      {hasDeliverables && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl font-semibold">
              المخرجات المطلوبة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              {project.deliverables.map((item, index) => (
                <li key={index} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      {/* Required Skills */}
      {hasSkills && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl font-semibold">
              المهارات المطلوبة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {project.skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
