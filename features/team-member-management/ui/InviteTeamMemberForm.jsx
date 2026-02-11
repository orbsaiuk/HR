"use client";

import { useState } from "react";
import { Mail, Plus } from "lucide-react";

export function InviteTeamMemberForm({ onInvite }) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) return;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    setSubmitting(true);
    const result = await onInvite(trimmedEmail);

    if (result.success) {
      setEmail("");
    } else {
      setError(result.error);
    }

    setSubmitting(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">
        Invite a Team Member
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Enter an email address to whitelist. When that person signs up,
        they&apos;ll automatically become a team member.
      </p>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <Mail
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="email"
            placeholder="team.member@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            disabled={submitting}
          />
        </div>
        <button
          type="submit"
          disabled={submitting || !email.trim()}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Plus size={18} />
          {submitting ? "Inviting..." : "Invite"}
        </button>
      </form>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
