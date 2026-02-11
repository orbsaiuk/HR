/**
 * Team members empty state component
 */

import { User } from "lucide-react";

export function TeamMembersEmpty({ hasSearch }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
      <User className="mx-auto text-gray-300 mb-4" size={48} />
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        {hasSearch ? "No team members found" : "No team members yet"}
      </h3>
      <p className="text-gray-500">
        {hasSearch
          ? "Try adjusting your search"
          : "Check back later for team members"}
      </p>
    </div>
  );
}
