/**
 * Compare responses page component
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { formsApi } from "@/features/forms/api/formsApi";
import { responsesApi } from "../api/responsesApi";
import { ResponseCompareTable } from "../components/ResponseCompareTable";
import { Loading } from "@/shared/components/feedback/Loading";
import { Error } from "@/shared/components/feedback/Error";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ComparePage({ formId }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const selectedIds =
    searchParams.get("selectedIds")?.split(",").filter(Boolean) || [];

  useEffect(() => {
    const fetchData = async () => {
      if (!formId || selectedIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch form data
        const formData = await formsApi.getById(formId);
        setForm(formData);

        // Fetch selected responses
        const allResponses = await responsesApi.getByFormId(formId);
        const selectedResponses = allResponses.filter((r) =>
          selectedIds.includes(r._id),
        );

        setResponses(selectedResponses);

        // Check if any IDs weren't found
        const foundIds = selectedResponses.map((r) => r._id);
        const missingIds = selectedIds.filter((id) => !foundIds.includes(id));

        if (missingIds.length > 0) {
          console.warn("Some responses not found:", missingIds);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch comparison data");
        console.error("Error fetching comparison data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [formId, searchParams.get("selectedIds")]);

  const handleBack = () => {
    router.push(`/dashboard/forms/${formId}/responses`);
  };

  if (loading) return <Loading fullPage />;

  if (selectedIds.length === 0) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={handleBack} className="gap-2">
          <ArrowLeft size={20} />
          Back to Responses
        </Button>
        <Card className="p-12 text-center">
          <div className="text-muted-foreground text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No Responses Selected
          </h3>
          <p className="text-muted-foreground mb-6">
            Please select responses from the list to compare them.
          </p>
          <Button onClick={handleBack}>Go to Responses</Button>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={handleBack} className="gap-2">
          <ArrowLeft size={20} />
          Back to Responses
        </Button>
        <Error message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  const foundIds = responses.map((r) => r._id);
  const missingIds = selectedIds.filter((id) => !foundIds.includes(id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between print:hidden">
        <div className="space-y-1">
          <Button variant="ghost" onClick={handleBack} className="gap-2 mb-2">
            <ArrowLeft size={20} />
            Back to Responses
          </Button>
          <h1 className="text-3xl font-bold text-foreground">
            Compare Responses
          </h1>
          <p className="text-muted-foreground">
            {form?.title || "Form"} • Comparing {responses.length} of{" "}
            {selectedIds.length} selected responses
          </p>
        </div>
      </div>

      {/* Warning for missing responses */}
      {missingIds.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3 print:hidden">
          <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-medium text-amber-800">
              {missingIds.length} response{missingIds.length > 1 ? "s" : ""} not
              found
            </p>
            <p className="text-sm text-amber-700 mt-1">
              Some selected responses may have been deleted or are no longer
              available.
            </p>
          </div>
        </div>
      )}

      {/* Comparison Table */}
      <ResponseCompareTable form={form} responses={responses} />
    </div>
  );
}
