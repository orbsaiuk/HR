/**
 * Team member stats component
 */

import { FileText } from "lucide-react";

export function TeamMemberStats({ forms, teamMember }) {
  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <FileText size={20} className="text-gray-400" />
        <span className="text-gray-700">
          {forms.length} {forms.length === 1 ? "Form" : "Forms"}
        </span>
      </div>
    </div>
  );
}
