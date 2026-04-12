export const careerQueries = {
  /**
   * Get all published/open positions for the public careers page.
   * No auth scoping — shows positions that are publicly published.
   * Includes organization info for multi-tenant display.
   */
  getPublicPositions: `*[_type == "jobPosition" && status in ["open", "published"]] | order(createdAt desc) {
    _id,
    title,
    department,
    description,
    location,
    type,
    seniority,
    salaryMin,
    salaryMax,
    currency,
    deadline,
    applicationMethod,
    createdAt,
    "recruiter": recruiter->{
      _id,
      name,
      email,
      avatar
    },
    "organizationName": organization->name,
    "organizationLogo": organization->logo,
    "organizationSlug": organization->slug.current,
    "applicationCount": count(*[_type == "application" && jobPosition._ref == ^._id])
  }`,

  /**
   * Get a single published/open position by ID for the public detail page.
   * Includes full requirements, linked form fields, and organization info.
   */
  getPublicPositionById: `*[_type == "jobPosition" && _id == $id && status in ["open", "published"]][0] {
    _id,
    title,
    department,
    description,
    requirements,
    location,
    type,
    seniority,
    salaryMin,
    salaryMax,
    currency,
    deadline,
    applicationMethod,
    createdAt,
    "recruiter": recruiter->{
      _id,
      name,
      email,
      avatar
    },
    "organizationId": organization->_id,
    "organizationName": organization->name,
    "organizationLogo": organization->logo,
    "organizationSlug": organization->slug.current,
    "organizationSize": organization->size,
    "form": form->{
      _id,
      title,
      fields,
      settings
    },
    "applicationCount": count(*[_type == "application" && jobPosition._ref == ^._id])
  }`,

  /**
   * List unique departments from published/open positions (for filter dropdown)
   */
  getDepartments: `array::unique(*[_type == "jobPosition" && status in ["open", "published"]].department)`,

  /**
   * List unique locations from published/open positions (for filter dropdown)
   */
  getLocations: `array::unique(*[_type == "jobPosition" && status in ["open", "published"]].location)`,

  /**
   * Check if a user has already applied to a position (returns boolean)
   */
  checkApplicationExists: `count(*[_type == "application" && jobPosition._ref == $positionId && applicant._ref == $userId]) > 0`,
};
