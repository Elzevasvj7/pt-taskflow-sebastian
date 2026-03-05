export class ApiError extends Error {
  readonly status: number;
  readonly statusText: string;

  constructor(status: number, statusText: string, message?: string) {
    super(message ?? `Error ${status}: ${statusText}`);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  get isServerError(): boolean {
    return this.status >= 500;
  }

  get isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }
}

const STATUS_MESSAGES: Record<number, string> = {
  400: "La solicitud contiene datos inválidos",
  401: "No tienes autorización para realizar esta acción",
  403: "No tienes permisos para acceder a este recurso",
  404: "El recurso solicitado no fue encontrado",
  408: "La solicitud tardó demasiado tiempo",
  422: "Los datos enviados no son válidos",
  429: "Demasiadas solicitudes, intenta más tarde",
  500: "Error interno del servidor",
  502: "El servidor no está disponible temporalmente",
  503: "El servicio no está disponible en este momento",
};

export function getHumanMessage(status: number, fallback?: string): string {
  return STATUS_MESSAGES[status] ?? fallback ?? `Error inesperado (${status})`;
}
