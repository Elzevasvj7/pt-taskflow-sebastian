"use client";

import { createClient } from "@/lib/supabase/client";
import { getAuthErrorMessage } from "@/lib/auth/messages";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  UserPlus,
} from "lucide-react";

export const RegisterForm = () => {
  const router = useRouter();
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const email = formState.email.trim();

    if (!email || !formState.password.trim() || !formState.confirmPassword.trim()) {
      setErrorMessage("Completa todos los campos para crear tu cuenta.");
      return;
    }

    if (formState.password !== formState.confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }

    if (formState.password.length < 6) {
      setErrorMessage("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.auth.signUp({
      email,
      password: formState.password,
    });

    if (error) {
      setErrorMessage(getAuthErrorMessage(error.message));
    } else {
      setSuccessMessage(
        "Registro enviado. Si el correo puede registrarse, revisa tu email para continuar.",
      );
      setTimeout(() => {
        router.push("/login");
      }, 1200);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="w-full max-w-md rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_30px_80px_-40px_rgba(27,20,15,0.4)] sm:p-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--foreground)]/45">
          Create account
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-[color:var(--foreground)]">
          Regístrate
        </h1>
        <p className="mt-3 text-sm text-[color:var(--foreground)]/62">
          Crea tu cuenta para guardar tus notas y personalizar tu espacio.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-[color:var(--foreground)]/75"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formState.email}
            onChange={(e) =>
              setFormState({ ...formState, email: e.target.value })
            }
            className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--panel-strong)] px-5 py-4 text-sm text-[color:var(--foreground)] outline-none transition focus:border-[var(--accent)]"
            placeholder="tu@email.com"
            autoComplete="email"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-[color:var(--foreground)]/75"
          >
            Contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formState.password}
              onChange={(e) =>
                setFormState({ ...formState, password: e.target.value })
              }
              className="w-full rounded-[1.4rem] border border-[var(--border)] bg-[var(--panel-strong)] px-5 py-4 pr-14 text-sm text-[color:var(--foreground)] outline-none transition focus:border-[var(--accent)]"
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-[color:var(--foreground)]/55 transition hover:bg-[var(--accent-soft)]"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-[color:var(--foreground)]/75"
          >
            Confirmar contraseña
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formState.confirmPassword}
              onChange={(e) =>
                setFormState({ ...formState, confirmPassword: e.target.value })
              }
              className="w-full rounded-[1.4rem] border border-[var(--border)] bg-[var(--panel-strong)] px-5 py-4 pr-14 text-sm text-[color:var(--foreground)] outline-none transition focus:border-[var(--accent)]"
              placeholder="Repite tu contraseña"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((current) => !current)}
              className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-[color:var(--foreground)]/55 transition hover:bg-[var(--accent-soft)]"
              aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="flex items-start gap-3 rounded-[1.4rem] border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-4 py-3 text-sm text-[var(--danger)]">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{errorMessage}</p>
          </div>
        )}

        {successMessage && (
          <div className="rounded-[1.4rem] border border-[var(--success)]/30 bg-[var(--success)]/10 px-4 py-3 text-sm text-[var(--success)]">
            {successMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--foreground)] px-5 py-3.5 text-sm font-semibold text-[var(--panel)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <UserPlus className="h-4 w-4" />
          )}
          {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>

      <div className="mt-6 flex items-center justify-between gap-4 text-sm text-[color:var(--foreground)]/62">
        <span>Ya tienes cuenta?</span>
        <Link
          href="/login"
          className="inline-flex items-center gap-1 font-semibold text-[color:var(--foreground)] transition hover:text-[var(--accent-strong)]"
        >
          Iniciar sesión
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};
