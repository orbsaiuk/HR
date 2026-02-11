/**
 * Team member card component
 */

import Link from "next/link";
import { User, FileText } from "lucide-react";

export function TeamMemberCard({ teamMember }) {
  return (
    <Link
      href={`/team-members/${teamMember._id}`}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-blue-300 transition-colors"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <User className="text-blue-600" size={32} />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">{teamMember.name}</h3>
          <p className="text-sm text-gray-500">{teamMember.email}</p>
        </div>
      </div>
      {teamMember.bio && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {teamMember.bio}
        </p>
      )}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <FileText size={16} />
        <span>{teamMember.formCount || 0} forms</span>
      </div>
    </Link>
  );
}
