export const safeRedirect = (value: unknown, fallback = "/homepage"): string => {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\") ? value : fallback;
}