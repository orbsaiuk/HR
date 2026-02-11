/**
 * Team member header component
 */

import { User } from "lucide-react";

export function TeamMemberHeader({ teamMember }) {
  return (
    <>
      <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
        <User className="text-blue-600" size={48} />
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {teamMember.name}
        </h1>
        <p className="text-gray-600 mb-4">
          {teamMember.bio || "No bio available"}
        </p>
      </div>
    </>
  );
}
