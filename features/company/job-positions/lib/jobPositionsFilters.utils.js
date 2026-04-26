const WORK_TYPE_TO_TYPE = {
  "دوام كامل": "full-time",
  "دوام جزئي": "part-time",
  عقد: "contract",
  تدريب: "internship",
  "عن بعد": "remote",
};

function normalizePositionType(position) {
  if (position?.type) return position.type;
  if (!position?.workType) return null;
  return WORK_TYPE_TO_TYPE[position.workType] || null;
}

function toTimestamp(value) {
  if (!value) return 0;
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function getApplicationsCount(position) {
  return Number(position?.applicationCount ?? position?.applications ?? 0);
}

function getDeadlineTimestamp(position) {
  const deadline = toTimestamp(position?.deadline);
  return deadline || Number.MAX_SAFE_INTEGER;
}

export function filterPositions(
  positions,
  { searchQuery, statusFilter, typeFilter },
) {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return positions.filter((position) => {
    const matchesStatus =
      statusFilter === "all" || (position?.status || "draft") === statusFilter;

    const matchesType =
      typeFilter === "all" || normalizePositionType(position) === typeFilter;

    const matchesQuery =
      !normalizedQuery ||
      [
        position?.title,
        position?.location,
        position?.department,
        position?.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);

    return matchesStatus && matchesType && matchesQuery;
  });
}

export function sortPositions(positions, sortBy) {
  const items = [...positions];

  items.sort((a, b) => {
    switch (sortBy) {
      case "oldest":
        return (
          toTimestamp(a?.createdAt || a?.updatedAt) -
          toTimestamp(b?.createdAt || b?.updatedAt)
        );
      case "applications-desc":
        return getApplicationsCount(b) - getApplicationsCount(a);
      case "deadline-nearest":
        return getDeadlineTimestamp(a) - getDeadlineTimestamp(b);
      case "title-asc":
        return (a?.title || "").localeCompare(b?.title || "", "ar");
      case "newest":
      default:
        return (
          toTimestamp(b?.createdAt || b?.updatedAt) -
          toTimestamp(a?.createdAt || a?.updatedAt)
        );
    }
  });

  return items;
}
