"use client";

import { Trash2, FileText, Shield } from "lucide-react";

export function TeamMembersList({ teamMembers, onRemove, ownerTeamMemberId }) {
  if (teamMembers.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Active Team Members
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({teamMembers.length})
          </span>
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Team Member
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Forms
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {teamMembers.map((teamMember) => {
              const isOwnerRow = teamMember._id === ownerTeamMemberId;
              return (
                <tr
                  key={teamMember._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {teamMember.avatar ? (
                        <img
                          src={teamMember.avatar}
                          alt={teamMember.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {teamMember.name?.charAt(0)?.toUpperCase() || "?"}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          {teamMember.name}
                        </span>
                        {isOwnerRow && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                            <Shield size={10} />
                            Owner
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {teamMember.email}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                      <FileText size={14} className="text-gray-400" />
                      {teamMember.formCount || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">
                      {teamMember.createdAt
                        ? new Date(teamMember.createdAt).toLocaleDateString()
                        : "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {!isOwnerRow && (
                      <button
                        onClick={() => {
                          if (
                            confirm(
                              `Remove ${teamMember.name} as a team member? This cannot be undone.`,
                            )
                          ) {
                            onRemove(teamMember._id);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove team member"
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
