"use client";

import { Trash2, Clock, CheckCircle, Mail } from "lucide-react";

export function InvitesList({ invites, onDelete }) {
  const pendingInvites = invites.filter((i) => i.status === "pending");
  const joinedInvites = invites.filter((i) => i.status === "joined");

  if (invites.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <Mail className="mx-auto text-gray-300 mb-3" size={40} />
        <h3 className="text-base font-semibold text-gray-700 mb-1">
          No invites yet
        </h3>
        <p className="text-sm text-gray-500">
          Invite team members by entering their email above.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Invites
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({pendingInvites.length} pending, {joinedInvites.length} joined)
          </span>
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invited
              </th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {invites.map((invite) => (
              <tr
                key={invite._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-gray-900">
                    {invite.email}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {invite.status === "pending" ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                      <Clock size={12} />
                      Pending
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                      <CheckCircle size={12} />
                      Joined
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-500">
                    {invite.createdAt
                      ? new Date(invite.createdAt).toLocaleDateString()
                      : "—"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {invite.status === "pending" && (
                    <button
                      onClick={() => onDelete(invite._id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Revoke invite"
                    >
                      <Trash2 size={14} />
                      Revoke
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
