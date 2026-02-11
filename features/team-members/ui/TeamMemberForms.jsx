/**
 * Team member forms list component
 */

import Link from "next/link";
import { FileText } from "lucide-react";

export function TeamMemberForms({ forms }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Published Forms</h2>
      {forms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {forms.map((form) => (
            <Link
              key={form._id}
              href={`/forms/${form._id}`}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-blue-300 transition-colors"
            >
              <h3 className="font-bold text-gray-900 mb-2">{form.title}</h3>
              {form.description && (
                <p className="text-gray-600 text-sm line-clamp-2">
                  {form.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No published forms yet
          </h3>
          <p className="text-gray-500">
            Check back later for forms from this team member
          </p>
        </div>
      )}
    </div>
  );
}
