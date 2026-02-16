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

  // Scorecards
  SCORECARDS: (applicationId) =>
    `/api/applications/${applicationId}/scorecards`,
  SCORECARD_MINE: (applicationId) =>
    `/api/applications/${applicationId}/scorecards/mine`,
  SCORECARD_SUMMARY: (applicationId) =>
    `/api/applications/${applicationId}/scorecards/summary`,

  // Careers (public)
  CAREERS: "/api/careers",
  CAREER_BY_ID: (id) => `/api/careers/${id}`,
  CAREER_FILTERS: "/api/careers/filters",
  CAREER_APPLY: (id) => `/api/careers/${id}/apply`,

  // Organizations
  ORGANIZATIONS: "/api/organizations",
  ORGANIZATION_BY_ID: (id) => `/api/organizations/${id}`,
  ORGANIZATION_MEMBERS: (id) => `/api/organizations/${id}/members`,

  // Companies (public)
  COMPANIES: "/api/companies",
  COMPANY_BY_SLUG: (slug) => `/api/companies/${slug}`,
  PLATFORM_STATS: "/api/platform/stats",
  FEATURED_POSITIONS: "/api/platform/featured-positions",

  // Organization Requests
  ORG_REQUESTS: "/api/organization-requests",
  ORG_REQUEST_BY_ID: (id) => `/api/organization-requests/${id}`,
  ORG_REQUEST_APPROVE: (id) => `/api/organization-requests/${id}/approve`,
  ORG_REQUEST_REJECT: (id) => `/api/organization-requests/${id}/reject`,

  // User Profile
  USER_PROFILE: "/api/user/profile",
  USER_PROFILE_RESUME: "/api/user/profile/resume",
  USER_PROFILE_COMPLETENESS: "/api/user/profile/completeness",

  // Candidate Portal (user)
  MY_APPLICATIONS: "/api/user/applications",
  MY_APPLICATION_BY_ID: (id) => `/api/user/applications/${id}`,

  // Evaluation Scorecards
  SCORECARDS: (applicationId) =>
    `/api/applications/${applicationId}/scorecards`,
  SCORECARD_MINE: (applicationId) =>
    `/api/applications/${applicationId}/scorecards/mine`,
  SCORECARD_SUMMARY: (applicationId) =>
    `/api/applications/${applicationId}/scorecards/summary`,
};
