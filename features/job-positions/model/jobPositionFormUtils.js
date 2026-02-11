export function getFormCompleteness(formData) {
  const fields = [
    "title",
    "department",
    "description",
    "requirements",
    "location",
    "type",
    "salaryMin",
    "salaryMax",
    "deadline",
  ];

  const filled = fields.filter((field) => {
    const value = formData[field];
    if (typeof value === "string") return value.trim().length > 0;
    return value !== null && value !== undefined && value !== "";
  }).length;

  return Math.round((filled / fields.length) * 100);
}
