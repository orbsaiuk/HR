export const careerQueries = {
  /**
   * Get all published/open positions for the public careers page.
   * No auth scoping — only shows "open" positions.
   * Includes organization info for multi-tenant display.
   */
  getPublicPositions: `*[_type == "jobPosition" && status == "open"] | order(createdAt desc) {
    _id,
    title,
    department,
    description,
    location,
    type,
    salaryMin,
    salaryMax,
    currency,
    deadline,
    applicationMethod,
    createdAt,
    "teamMember": teamMember->{
      _id,
      name
    },
    "organizationName": organization->name,
    "organizationLogo": organization->logo,
    "organizationSlug": organization->slug.current,
    "applicationCount": count(*[_type == "application" && jobPosition._ref == ^._id])
  }`,

  /**
   * Get a single open position by ID for the public detail page.
   * Includes full requirements, linked form fields, and organization info.
   */
  getPublicPositionById: `*[_type == "jobPosition" && _id == $id && status == "open"][0] {
    _id,
    title,
    department,
    description,
    requirements,
    location,
    type,
    salaryMin,
    salaryMax,
    currency,
    deadline,
    applicationMethod,
    createdAt,
    "teamMember": teamMember->{
      _id,
      name
    },
    "organizationName": organization->name,
    "organizationLogo": organization->logo,
    "organizationSlug": organization->slug.current,
    "form": form->{
      _id,
      title,
      fields,
      settings
    },
    "applicationCount": count(*[_type == "application" && jobPosition._ref == ^._id])
  }`,

  /**
   * List unique departments from open positions (for filter dropdown)
   */
  getDepartments: `array::unique(*[_type == "jobPosition" && status == "open"].department)`,

  /**
   * List unique locations from open positions (for filter dropdown)
   */
  getLocations: `array::unique(*[_type == "jobPosition" && status == "open"].location)`,
};
