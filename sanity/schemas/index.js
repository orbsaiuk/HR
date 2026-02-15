/**
 * Sanity Schema Types
 *
 * Schemas are organized by domain for better maintainability:
 * - users: User, TeamMember, TeamMemberInvite
 * - forms: Form, FormField
 * - messaging: Conversation, Message
 * - recruitment: JobPosition, Application, EvaluationScorecard, ScorecardCriterion
 */

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

// Combine all schemas
export const schemaTypes = [
  ...organizationSchemas,
  ...userSchemas,
  ...formSchemas,
  ...messagingSchemas,
  ...recruitmentSchemas,
];

export const schema = {
  types: schemaTypes,
};

// Re-export individual schemas for convenience
export { organization } from "./organizations";
export { user, teamMember, teamMemberInvite } from "./users";
export { form, formField } from "./forms";
export { conversation, message } from "./messaging";
export { jobPosition, application, evaluationScorecard, scorecardCriterion } from "./recruitment";
