export const ITEMS_PER_PAGE = 5;

export const DURATION_RANGES = [
  { key: "0-1", min: 0, max: 1 },
  { key: "1-3", min: 1, max: 3 },
  { key: "3-6", min: 3, max: 6 },
  { key: "6+", min: 6, max: Infinity },
];

function matchesSearch(project, searchTerm) {
  if (!searchTerm) return true;

  const query = searchTerm.toLowerCase();
  return (
    project.title?.toLowerCase().includes(query) ||
    project.shortDescription?.toLowerCase().includes(query) ||
    project.clientName?.toLowerCase().includes(query) ||
    project.technologies?.some((technology) =>
      technology.toLowerCase().includes(query),
    )
  );
}

function matchesDurationRange(project, selectedDurations) {
  if (selectedDurations.length === 0) return true;

  const months = project.duration?.value || 0;
  return selectedDurations.some((rangeKey) => {
    const range = DURATION_RANGES.find((item) => item.key === rangeKey);
    if (!range) return false;
    return months >= range.min && months <= range.max;
  });
}

function applySorting(projects, sortBy) {
  if (sortBy === "date") {
    projects.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    return;
  }

  if (sortBy === "duration") {
    projects.sort(
      (a, b) => (b.duration?.value || 0) - (a.duration?.value || 0),
    );
  }
}

export function filterProjects({
  allProjects,
  search,
  selectedTypes,
  selectedIndustries,
  selectedTechnologies,
  selectedStatuses,
  selectedDurations,
  selectedTeamSizes,
  sortBy,
}) {
  const result = allProjects
    .filter((project) => matchesSearch(project, search))
    .filter(
      (project) =>
        selectedTypes.length === 0 ||
        selectedTypes.includes(project.projectType),
    )
    .filter(
      (project) =>
        selectedIndustries.length === 0 ||
        selectedIndustries.includes(project.industry),
    )
    .filter(
      (project) =>
        selectedTechnologies.length === 0 ||
        project.technologies?.some((technology) =>
          selectedTechnologies.includes(technology),
        ),
    )
    .filter(
      (project) =>
        selectedStatuses.length === 0 ||
        selectedStatuses.includes(project.status),
    )
    .filter((project) => matchesDurationRange(project, selectedDurations))
    .filter(
      (project) =>
        selectedTeamSizes.length === 0 ||
        selectedTeamSizes.includes(project.teamSize),
    );

  applySorting(result, sortBy);
  return result;
}

export function computeFilterCounts(allProjects) {
  const typeCounts = {};
  const industryCounts = {};
  const technologyCounts = {};
  const statusCounts = {};
  const durationRangeCounts = {};
  const teamSizeCounts = {};

  allProjects.forEach((project) => {
    if (project.projectType) {
      typeCounts[project.projectType] =
        (typeCounts[project.projectType] || 0) + 1;
    }

    if (project.industry) {
      industryCounts[project.industry] =
        (industryCounts[project.industry] || 0) + 1;
    }

    if (project.technologies && Array.isArray(project.technologies)) {
      project.technologies.forEach((technology) => {
        technologyCounts[technology] = (technologyCounts[technology] || 0) + 1;
      });
    }

    if (project.status) {
      statusCounts[project.status] = (statusCounts[project.status] || 0) + 1;
    }

    const months = project.duration?.value || 0;
    if (months > 0) {
      DURATION_RANGES.forEach((range) => {
        if (months >= range.min && months <= range.max) {
          durationRangeCounts[range.key] =
            (durationRangeCounts[range.key] || 0) + 1;
        }
      });
    }

    if (project.teamSize) {
      teamSizeCounts[project.teamSize] =
        (teamSizeCounts[project.teamSize] || 0) + 1;
    }
  });

  return {
    typeCounts,
    industryCounts,
    technologyCounts,
    statusCounts,
    durationRangeCounts,
    teamSizeCounts,
  };
}

export function toggleMultiSelectValue(previousValues, value) {
  return previousValues.includes(value)
    ? previousValues.filter((item) => item !== value)
    : [...previousValues, value];
}

export function hasActiveProjectsFilters({
  search,
  selectedTypes,
  selectedIndustries,
  selectedTechnologies,
  selectedStatuses,
  selectedDurations,
  selectedTeamSizes,
}) {
  return Boolean(
    search ||
    selectedTypes.length > 0 ||
    selectedIndustries.length > 0 ||
    selectedTechnologies.length > 0 ||
    selectedStatuses.length > 0 ||
    selectedDurations.length > 0 ||
    selectedTeamSizes.length > 0,
  );
}
