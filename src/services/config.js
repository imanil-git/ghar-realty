export const apiMode = import.meta.env.VITE_API_MODE || "mock";
export const isMockMode = apiMode === "mock";
export const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "/api").replace(
  /\/$/,
  "",
);
