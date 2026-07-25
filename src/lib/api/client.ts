/**
 * Minimal typed HTTP client for a future backend.
 *
 * The site is fully static today. When a backend exists, set VITE_API_BASE_URL
 * (locally in .env.local, in production via Vercel project settings) and the
 * service modules in this folder start working against it — no component changes.
 */

const baseUrl: string | undefined = import.meta.env.VITE_API_BASE_URL;

/** True when a backend API is configured for this deployment. */
export const isApiConfigured = Boolean(baseUrl);

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  signal?: AbortSignal;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!baseUrl) {
    throw new ApiError(
      "No backend is configured. Set VITE_API_BASE_URL to enable API requests."
    );
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method: options.method ?? "GET",
    headers: options.body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
  });

  if (!response.ok) {
    throw new ApiError(`Request to ${path} failed with status ${response.status}`, response.status);
  }

  // Tolerate empty bodies (e.g. 204 No Content).
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
