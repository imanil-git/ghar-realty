export function safeReturnTo(value) {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\")
  ) {
    return "/account/profile";
  }

  try {
    const url = new URL(value, "https://ghar.example");
    if (url.origin !== "https://ghar.example" || url.pathname === "/login") {
      return "/account/profile";
    }
    return url.pathname + url.search + url.hash;
  } catch {
    return "/account/profile";
  }
}
