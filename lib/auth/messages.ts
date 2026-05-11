export function getAuthErrorMessage(message: string): string {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("invalid login credentials") ||
    normalized.includes("invalid email or password")
  ) {
    return "El email o la contraseña son incorrectos.";
  }

  if (normalized.includes("email not confirmed")) {
    return "Debes confirmar tu email antes de iniciar sesión.";
  }

  if (normalized.includes("user already registered")) {
    return "Ese correo ya está registrado. Intenta iniciar sesión.";
  }

  if (normalized.includes("password should be at least")) {
    return "La contraseña debe tener al menos 6 caracteres.";
  }

  if (normalized.includes("unable to validate email address")) {
    return "El email ingresado no es válido.";
  }

  if (normalized.includes("signup is disabled")) {
    return "El registro está deshabilitado temporalmente.";
  }

  if (normalized.includes("network") || normalized.includes("fetch")) {
    return "No se pudo conectar con el servidor. Intenta nuevamente.";
  }

  return message;
}
