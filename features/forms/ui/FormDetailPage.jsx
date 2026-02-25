/**
 * Form detail page component
 */

"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  Share2,
  Trash2,
  MessageSquare,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { useFormDetail } from "../model/useFormDetail";
import { Loading } from "@/shared/components/feedback/Loading";
import { Error } from "@/shared/components/feedback/Error";
import { usePermissions } from "@/features/team-member-management/model/usePermissions";
import { PERMISSIONS } from "@/shared/lib/permissions";

export function FormDetailPage({ formId }) {
  const router = useRouter();
  const { form, loading, error, deleteForm, refetch } = useFormDetail(formId);
  const { hasPermission } = usePermissions();
  const canManageForms = hasPermission(PERMISSIONS.MANAGE_FORMS);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this form?")) return;

    const result = await deleteForm();
    if (!result.success) {
      alert(result.error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) return <Loading fullPage />;
  if (error) return <Error message={error} onRetry={refetch} />;
  if (!form) return <Error message="Form not found" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{form.title}</h1>
            <p className="text-gray-600 mt-1">
              {form.description || "No description"}
            </p>
          </div>
        </div>
        {canManageForms && (
          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard/forms/${form._id}/edit`}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Edit size={20} />
              Edit
            </Link>
            <Link
              href={`/dashboard/forms/${form._id}/share`}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Share2 size={20} />
              Share
            </Link>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
            >
              <Trash2 size={20} />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Responses</p>
              <p className="text-2xl font-bold text-gray-900">
                {form.responseCount || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="text-lg font-bold text-gray-900">
                {formatDate(form.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href={`/dashboard/forms/${form._id}/responses`}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-blue-300 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                View Responses
              </h3>
              <p className="text-gray-600">See all responses for this form</p>
            </div>
            <MessageSquare size={32} className="text-gray-400" />
          </div>
        </Link>

        <Link
          href={`/dashboard/forms/${form._id}/analytics`}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-blue-300 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                View Analytics
              </h3>
              <p className="text-gray-600">Analyze response data and trends</p>
            </div>
            <TrendingUp size={32} className="text-gray-400" />
          </div>
        </Link>
      </div>

      {/* Form Fields */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Form Fields</h2>
        {form.fields && form.fields.length > 0 ? (
          <div className="space-y-3">
            {form.fields.map((field, index) => (
              <div
                key={field._key || index}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-sm font-medium text-gray-500 w-8">
                  {index + 1}.
                </span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{field.label}</p>
                  <p className="text-sm text-gray-500 capitalize">
                    {field.type}
                  </p>
                </div>
                {field.required && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                    Required
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No fields added yet</p>
        )}
      </div>
    </div>
  );
}
