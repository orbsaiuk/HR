// Organization schemas
import organizationSchemas from "./organizations";

// User management schemas
import userSchemas from "./users";

// Combine all schemas
export const schemaTypes = [
  ...organizationSchemas,
  ...userSchemas,
];

export const schema = {
  types: schemaTypes,
};

// Re-export individual schemas for convenience
export { organization, organizationRequest } from "./organizations";
export { user, freelancerProfile } from "./users";
