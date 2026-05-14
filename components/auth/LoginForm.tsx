"use client";

import { createClient } from "@/lib/supabase/client";
import { getAuthErrorMessage } from "@/lib/auth/messages";
import {
  AlertCircle,
  ArrowRight,
  CircleUserRound,
  Eye,
  EyeOff,
  LoaderCircle,
  LogIn,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export const LoginForm = () => {
  const router = useRouter();
  const [formState, setFormState] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const supabase = createClient();

  async function signInWithUsername(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    const email = formState.username.trim();

    if (!email || !formState.password.trim()) {
      setErrorMessage("Completa tu email y contraseña para continuar.");
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: formState.password,
    });

    if (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } else {
      setSuccessMessage("Inicio de sesión exitoso. Redirigiendo...");
      router.push("/");
      router.refresh();
    }

    setIsSubmitting(false);
  }

  async function signInWithGithub() {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsGithubLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `http://localhost:3000/auth/callback`,
      },
    });

    if (error) {
      setErrorMessage(getAuthErrorMessage(error));
      setIsGithubLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-[2rem] border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_30px_80px_-40px_rgba(27,20,15,0.4)] sm:p-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--foreground)]/45">
          Welcome back
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-[color:var(--foreground)]">
          Inicia sesión
        </h1>
        <p className="mt-3 text-sm text-[color:var(--foreground)]/62">
          Accede a tus notas y continua donde te quedaste.
        </p>
      </div>

      <form onSubmit={signInWithUsername} className="mt-8 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="username"
            className="text-sm font-medium text-[color:var(--foreground)]/75"
          >
            Email
          </label>
          <input
            id="username"
            type="email"
            name="username"
            value={formState.username}
            onChange={(e) =>
              setFormState({ ...formState, username: e.target.value })
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
              placeholder="Tu contraseña"
              autoComplete="current-password"
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
            <LogIn className="h-4 w-4" />
          )}
          {isSubmitting ? "Ingresando..." : "Entrar"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[color:var(--foreground)]/35">
        <span className="h-px flex-1 bg-[var(--border)]" />
        <span>o continua con</span>
        <span className="h-px flex-1 bg-[var(--border)]" />
      </div>

      <button
        type="button"
        onClick={signInWithGithub}
        disabled={isGithubLoading}
        className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-[var(--border)] bg-[var(--panel-strong)] px-5 py-3.5 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[var(--accent-soft)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isGithubLoading ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : (
          <CircleUserRound className="h-4 w-4" />
        )}
        {isGithubLoading ? "Redirigiendo..." : "Continuar con GitHub"}
      </button>

      <div className="mt-6 flex items-center justify-between gap-4 text-sm text-[color:var(--foreground)]/62">
        <span>No tienes cuenta?</span>
        <Link
          href="/register"
          className="inline-flex items-center gap-1 font-semibold text-[color:var(--foreground)] transition hover:text-[var(--accent-strong)]"
        >
          Crear cuenta
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};
