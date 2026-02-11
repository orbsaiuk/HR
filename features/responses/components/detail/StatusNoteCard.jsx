/**
 * Status note card component
 */

"use client";

export function StatusNoteCard({
  statusNote,
  onNoteChange,
  onSave,
  isSaving,
  hasChanges,
  isTeamMember = true,
  status,
  rejectionReason,
}) {
  // For students, only show the rejection reason if status is rejected
  if (!isTeamMember) {
    if (status === "rejected" && rejectionReason) {
      return (
        <div className="bg-red-50 rounded-lg border border-red-200 p-6">
          <h3 className="text-lg font-bold text-red-900 mb-3">
            Rejection Reason
          </h3>
          <p className="text-red-800 whitespace-pre-wrap">{rejectionReason}</p>
        </div>
      );
    }
    return null;
  }

  // Team member view - editable status note
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3">
          Status Note (Team Members Only)
        </h3>
        <textarea
          value={statusNote}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="Add a private note about this status (optional)"
          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          rows={3}
        />
        <div className="flex items-center justify-between mt-3">
          <p className="text-sm text-gray-500">
            This note is only visible to team members.
          </p>
          {hasChanges && (
            <button
              onClick={onSave}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {isSaving ? "Saving..." : "Save Note"}
            </button>
          )}
        </div>
      </div>

      {/* Show rejection reason if status is rejected */}
      {status === "rejected" && rejectionReason && (
        <div className="bg-red-50 rounded-lg border border-red-200 p-6">
          <h3 className="text-lg font-bold text-red-900 mb-3">
            Rejection Reason
          </h3>
          <p className="text-red-800 whitespace-pre-wrap">{rejectionReason}</p>
        </div>
      )}
    </div>
  );
}
