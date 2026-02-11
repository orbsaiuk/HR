"use client";

export function PositionReviewSummary({ formData }) {
  return (
    <div className="rounded-lg border bg-white p-6 space-y-4">
      <h3 className="text-lg font-semibold">Review Summary</h3>
      <div className="grid gap-3 text-sm">
        <div>
          <p className="font-medium">Title</p>
          <p className="text-muted-foreground">{formData.title || "Not set"}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <p className="font-medium">Department</p>
            <p className="text-muted-foreground">
              {formData.department || "Not set"}
            </p>
          </div>
          <div>
            <p className="font-medium">Location</p>
            <p className="text-muted-foreground">
              {formData.location || "Not set"}
            </p>
          </div>
        </div>
        <div>
          <p className="font-medium">Type</p>
          <p className="text-muted-foreground">{formData.type || "Not set"}</p>
        </div>
        <div>
          <p className="font-medium">Salary Range</p>
          <p className="text-muted-foreground">
            {formData.salaryMin && formData.salaryMax
              ? `${formData.currency} ${formData.salaryMin} - ${formData.salaryMax}`
              : "Not set"}
          </p>
        </div>
        <div>
          <p className="font-medium">Application Deadline</p>
          <p className="text-muted-foreground">
            {formData.deadline || "Not set"}
          </p>
        </div>
      </div>
    </div>
  );
}
