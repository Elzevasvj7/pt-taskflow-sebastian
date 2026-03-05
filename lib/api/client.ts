import { ApiError, getHumanMessage } from "./errors";

const API_BASE_URL = process.env.API_URL ?? "http://localhost:3001";

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
  } catch {
    throw new ApiError(
      0,
      "Network Error",
      "No se pudo conectar con el servidor. Verifica tu conexión a internet.",
    );
  }
  if (!response.ok) {
    let detail: string | undefined;

    try {
      const payload = (await response.json()) as { message?: string };
      detail = payload?.message;
    } catch {
      // Response body is not JSON — use default message
    }

    const message = detail ?? getHumanMessage(response.status);
    throw new ApiError(response.status, response.statusText, message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
