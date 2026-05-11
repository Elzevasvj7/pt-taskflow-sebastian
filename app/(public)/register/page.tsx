import { RegisterForm } from "@/components/auth/RegisterForm";
import React from "react";

const RegisterPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--foreground)]/45">
            Join Taskflow
          </p>
          <h1 className="mt-4 max-w-[10ch] text-6xl font-semibold tracking-[-0.08em] text-[color:var(--foreground)]">
            Crea tu espacio y empieza a organizar.
          </h1>
          <p className="mt-5 max-w-xl text-base text-[color:var(--foreground)]/62">
            Regístrate para guardar tus notas, personalizar colores y mantener tu tablero siempre disponible.
          </p>
        </div>

        <div className="flex justify-center lg:justify-end">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
