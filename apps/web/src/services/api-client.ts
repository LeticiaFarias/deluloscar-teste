const API=import.meta.env.VITE_API_URL || "http://localhost:3333/api";

interface ApiError {
  message?: string;
}

export class ApiRequestError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "ApiRequestError";
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem("deluloscar_token");
  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(API + path, { ...options, headers });

  if (response.status === 401) {
    localStorage.removeItem("deluloscar_token");
    localStorage.removeItem("deluloscar_user");
    if (location.pathname !== "/login") location.assign("/login");
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => ({
      message: "Falha na solicitação.",
    }))) as ApiError;

    throw new ApiRequestError(
      body.message ?? "Falha na solicitação.",
      response.status,
    );
  }

  return response.status === 204
    ? (undefined as T)
    : (response.json() as Promise<T>);
}
