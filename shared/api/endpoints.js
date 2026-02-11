/**
 * API endpoint definitions
 * Centralized location for all API routes
 */

export const API_ENDPOINTS = {
  // Forms
  FORMS: "/api/forms",
  FORM_BY_ID: (id) => `/api/forms/${id}`,
  FORM_PUBLISH: (id) => `/api/forms/${id}/publish`,
  FORM_CLOSE: (id) => `/api/forms/${id}/close`,

  // Responses
  RESPONSES: "/api/responses",
  RESPONSE_BY_ID: (id) => `/api/responses/${id}`,
  FORM_RESPONSES: (formId) => `/api/forms/${formId}/responses`,

  // Analytics
  ANALYTICS: "/api/analytics",
  FORM_ANALYTICS: (formId) => `/api/analytics/${formId}`,

  // Auth
  AUTH_USER: "/api/auth/user",

  // Chat/Messages
  CONVERSATIONS: "/api/conversations",
  CONVERSATION_BY_ID: (id) => `/api/conversations/${id}`,
  MESSAGES: (conversationId) => `/api/conversations/${conversationId}/messages`,
  MARK_AS_READ: (conversationId) =>
    `/api/conversations/${conversationId}/mark-read`,

  // User Submissions
  USER_SUBMISSIONS: "/api/user/submissions",
  USER_SUBMISSION_BY_ID: (id) => `/api/user/submissions/${id}`,
  USER_SUBMISSION_MARK_READ: (id) => `/api/user/submissions/${id}/mark-read`,
  USER_SUBMISSIONS_MARK_ALL_READ: "/api/user/submissions/mark-all-read",

  // Team Member Management
  TEAM_MEMBER_INVITES: "/api/team-members/invites",
  TEAM_MEMBER_INVITE_BY_ID: (id) => `/api/team-members/invites/${id}`,
  TEAM_MEMBERS_MANAGED: "/api/team-members/managed",
  TEAM_MEMBER_REMOVE: (id) => `/api/team-members/${id}/remove`,
  TEAM_MEMBER_IS_OWNER: "/api/team-members/is-owner",

  // Job Positions
  JOB_POSITIONS: "/api/job-positions",
  JOB_POSITION_BY_ID: (id) => `/api/job-positions/${id}`,
  JOB_POSITION_STATUS: (id) => `/api/job-positions/${id}/status`,
  JOB_POSITION_STATS: "/api/job-positions/stats",

  // Applications
  APPLICATIONS: "/api/applications",
  APPLICATION_BY_ID: (id) => `/api/applications/${id}`,
  APPLICATION_STATUS: (id) => `/api/applications/${id}/status`,
  APPLICATION_STATS: "/api/applications/stats",
};
