export const LEARNING_ACCESS_MODE = "open-preview" as const;

export const learningAccess = {
  mode: LEARNING_ACCESS_MODE,
  isOpen: true,
  label: "Free learning access",
  detail: "Payments are not required during this learning-access period.",
} as const;
