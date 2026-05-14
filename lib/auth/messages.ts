import type { AuthError } from "@supabase/supabase-js";

type AuthLikeError = Pick<AuthError, "message" | "code">;
type AuthErrorCode = Exclude<AuthError["code"], undefined>;

const AUTH_ERROR_MESSAGES: Partial<Record<AuthErrorCode, string>> = {
  email_exists: "Ese correo ya está registrado. Intenta iniciar sesión.",
  email_not_confirmed: "Debes confirmar tu email antes de iniciar sesión.",
  signup_disabled: "El registro está deshabilitado temporalmente.",
  user_already_exists: "Ese correo ya está registrado. Intenta iniciar sesión.",
  user_banned: "Tu cuenta no puede iniciar sesión en este momento.",
  user_not_found: "No encontramos una cuenta con ese correo.",
  validation_failed: "Revisa los datos ingresados e inténtalo nuevamente.",
  weak_password: "La contraseña no cumple los requisitos de seguridad.",
  over_request_rate_limit: "Demasiados intentos. Espera un momento e inténtalo otra vez.",
  over_email_send_rate_limit:
    "Se alcanzó el límite de envíos de email. Intenta nuevamente más tarde.",
  request_timeout: "La solicitud tardó demasiado. Intenta nuevamente.",
  invalid_credentials: "El email o la contraseña son incorrectos.",
};

export function getAuthErrorMessage(error: AuthLikeError): string {
  if (error.code && error.code in AUTH_ERROR_MESSAGES) {
    return AUTH_ERROR_MESSAGES[error.code] ?? error.message;
  }
  return error.message;
}
