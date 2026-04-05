import { COMMON_TECHNOLOGIES } from "./projectsFilterOptions";

export function mapOptionsWithCounts(options, counts) {
  return options.map((option) => ({
    ...option,
    count: counts[option.value] || 0,
  }));
}

export function mapTechnologyOptionsWithCounts(
  apiTechnologies,
  technologyCounts,
) {
  const technologiesFromApi = Array.isArray(apiTechnologies)
    ? apiTechnologies.filter(
        (item) => typeof item === "string" && item.trim().length > 0,
      )
    : [];

  const technologies =
    technologiesFromApi.length > 0 ? technologiesFromApi : COMMON_TECHNOLOGIES;

  return technologies.map((technology) => ({
    value: technology,
    label: technology,
    count: technologyCounts[technology] || 0,
  }));
}
