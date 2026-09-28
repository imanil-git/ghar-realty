import { apiBaseUrl } from "./config";

export class ApiError extends Error {
  constructor(message, status = 400, fields = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fields = fields;
  }
}

export async function request(path, { method = "GET", data, signal } = {}) {
  const isForm = data instanceof FormData;
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method,
    signal,
    credentials: "include",
    headers:
      data && !isForm ? { "Content-Type": "application/json" } : undefined,
    body: data ? (isForm ? data : JSON.stringify(data)) : undefined,
  });
  const body =
    response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 401)
      window.dispatchEvent(new Event("ghar:session-expired"));
    throw new ApiError(
      body?.message || "The request could not be completed. Please try again.",
      response.status,
      body?.fields,
    );
  }
  return body;
}
