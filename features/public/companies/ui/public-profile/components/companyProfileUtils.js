/**
 * Sort an array of positions by the given key.
 *
 * @param {Array} positions
 * @param {"date"|"salary"|"title"} sortBy
 * @returns {Array} A new sorted array (does not mutate the original).
 */
export function sortPositions(positions, sortBy) {
    const sorted = [...positions];
    switch (sortBy) {
        case "date":
            return sorted.sort(
                (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
            );
        case "salary":
            return sorted.sort(
                (a, b) =>
                    (b.salaryMax || b.salaryMin || 0) - (a.salaryMax || a.salaryMin || 0),
            );
        case "title":
            return sorted.sort((a, b) =>
                (a.title || "").localeCompare(b.title || "", "ar"),
            );
        default:
            return sorted;
    }
}
