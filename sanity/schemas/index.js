
// Organization schemas
import organizationSchemas from "./organizations";

// User management schemas
import userSchemas from "./users";

// Form schemas
import formSchemas from "./forms";

// Messaging schemas
import messagingSchemas from "./messaging";

// Recruitment schemas
import recruitmentSchemas from "./recruitment";

// Audit schemas
import auditSchemas from "./audit";

// API Key schemas
import { apiKey } from "./api-keys";

// Combine all schemas
export const schemaTypes = [
  ...organizationSchemas,
  ...userSchemas,
  ...formSchemas,
  ...messagingSchemas,
  ...recruitmentSchemas,
  ...auditSchemas,
  apiKey,
];

export const schema = {
  types: schemaTypes,
};

// Re-export individual schemas for convenience
export { organization, organizationRequest } from "./organizations";
export { user } from "./users";
export { form, formField } from "./forms";
export { conversation, message } from "./messaging";
export { jobPosition, application, evaluationScorecard, scorecardCriterion } from "./recruitment";
export { auditLog } from "./audit";
