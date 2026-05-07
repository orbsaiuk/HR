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

  // Auth
  AUTH_USER: "/api/auth/user",

  // Chat/Messages
  CONVERSATIONS: "/api/conversations",
  CONVERSATION_BY_ID: (id) => `/api/conversations/${id}`,
  MESSAGES: (conversationId) => `/api/conversations/${conversationId}/messages`,
  MARK_AS_READ: (conversationId) =>
    `/api/conversations/${conversationId}/mark-read`,

  // Team Member Management
  TEAM_MEMBER_INVITES: "/api/org-members/invites",
  TEAM_MEMBER_INVITE_BY_ID: (id) => `/api/org-members/invites/${id}`,
  TEAM_MEMBERS_MANAGED: "/api/org-members/managed",
  TEAM_MEMBER_REMOVE: (id) => `/api/org-members/${id}/remove`,
  TEAM_MEMBER_CHANGE_ROLE: (id) => `/api/org-members/${id}/role`,
  TEAM_MEMBER_MY_PERMISSIONS: "/api/org-members/my-permissions",
  TEAM_MEMBER_IS_OWNER: "/api/org-members/is-owner",

  // Roles
  ROLES: "/api/roles",

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

  // Categories
  CATEGORIES: "/api/categories",

  // Projects (public)
  PROJECTS: "/api/projects",
  PROJECT_BY_ID: (id) => `/api/projects/${id}`,
  PROJECT_FILTERS: "/api/projects/filters",

  // Contracts
  CONTRACTS: "/api/contracts",
  CONTRACT_TEMPLATES: "/api/contracts/templates",
  CONTRACT_BY_ID: (id) => `/api/contracts/${id}`,
  CONTRACT_SEND_WHATSAPP: (id) => `/api/contracts/${id}/send-whatsapp`,
  CONTRACT_DOWNLOAD_PDF: (id) => `/api/contracts/${id}/download`,

  // Organizations
  ORGANIZATIONS: "/api/organizations",
  ORGANIZATION_BY_ID: (id) => `/api/organizations/${id}`,
  ORGANIZATION_MEMBERS: (id) => `/api/organizations/${id}/members`,

  // Companies (public)
  COMPANIES: "/api/companies",
  COMPANY_BY_SLUG: (slug) => `/api/companies/${slug}`,
  COMPANY_PROFILE: "/api/company/profile",
  COMPANY_PROJECTS: "/api/company/projects",
  COMPANY_PROJECT_BY_ID: (id) => `/api/company/projects/${id}`,
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

  // Freelancer Profile
  FREELANCER_PROFILE: "/api/freelancer/profile",
  FREELANCER_PROFILE_PORTFOLIO_IMAGE: "/api/freelancer/profile/portfolio-image",
  FREELANCER_PROJECTS: "/api/freelancer/projects",
  FREELANCER_PROJECT_BY_ID: (id) => `/api/freelancer/projects/${id}`,

  // Freelancer Contracts
  FREELANCER_CONTRACTS: "/api/freelancer/contracts",
  FREELANCER_CONTRACT_BY_ID: (id) => `/api/freelancer/contracts/${id}`,
  FREELANCER_CONTRACT_DOWNLOAD_PDF: (id) =>
    `/api/freelancer/contracts/${id}/download`,

  // Freelancer Surveys
  FREELANCER_SURVEYS: "/api/freelancer/surveys",
  FREELANCER_SURVEY_BY_ID: (id) => `/api/freelancer/surveys/${id}`,
  FREELANCER_SURVEY_RESPONSES: (id) =>
    `/api/freelancer/surveys/${id}/responses`,
  FREELANCER_SURVEY_RESPONSE_BY_ID: (id, responseId) =>
    `/api/freelancer/surveys/${id}/responses/${responseId}`,

  // Candidate Portal (user)
  MY_APPLICATIONS: "/api/user/applications",
  MY_APPLICATION_BY_ID: (id) => `/api/user/applications/${id}`,

  // Audit Logs
  AUDIT_LOGS: "/api/audit-logs",

  // Permissions version check (lightweight)
  PERMISSIONS_VERSION: "/api/user/permissions-version",

  // API Keys
  API_KEYS: "/api/api-keys",
  API_KEY_BY_ID: (id) => `/api/api-keys/${id}`,

  // Temporary Grants
  TEMPORARY_GRANTS: (memberId) =>
    `/api/org-members/${memberId}/temporary-grants`,
  TEMPORARY_GRANT_BY_KEY: (memberId, grantKey) =>
    `/api/org-members/${memberId}/temporary-grants/${grantKey}`,
  TEMPORARY_GRANTS_CLEANUP: "/api/org-members/temporary-grants/cleanup",
};
