export const CONTRACT_TYPES = {
  FREELANCER_SINGLE_PROJECT: "فريلانسر ",
  FULL_TIME: "دوام كامل",
  PART_TIME: "دوام جزئي",
  INTERNSHIP: "تدريب",
};

export const CONTRACT_TYPE_VALUES = Object.values(CONTRACT_TYPES);

export const CONTRACT_CURRENCIES = ["EGP", "SAR", "USD", "AED"];

export function isEmployeeContractType(type) {
  const normalizedType = String(type || "").trim();

  return (
    normalizedType.includes(CONTRACT_TYPES.FULL_TIME) ||
    normalizedType.includes(CONTRACT_TYPES.PART_TIME) ||
    normalizedType.includes(CONTRACT_TYPES.INTERNSHIP)
  );
}
