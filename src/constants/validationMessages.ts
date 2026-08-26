export const VALIDATION_MESSAGES = {
  INFO_INVALID: "General settings are missing a name or password.",
  PASSIVE_SENSING_INVALID: "Passive sensing configuration has empty or duplicate schedules.",
  ACTIVE_SENSING_INVALID: "Active sensing configuration is invalid.",
  WEBAPP_INVALID: "A web app is missing an icon.",
  TRIGGER_INVALID: "One or more triggers are incomplete.",
  FIX_ISSUES_PROMPT: "Cannot save campaign. Please fix the following issues:",
  FIX_ISSUES_TOOLTIP: "Please fix the issues highlighted in the banner to save.",
  NO_CHANGES: "No changes to save",
} as const;
