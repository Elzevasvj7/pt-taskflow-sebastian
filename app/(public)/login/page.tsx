import { LoginForm } from "@/components/auth/LoginForm";

const LoginPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--foreground)]/45">
            Taskflow
          </p>
          <h1 className="mt-4 max-w-[9ch] text-6xl font-semibold tracking-[-0.08em] text-[color:var(--foreground)]">
            Tu tablero de notas personales.
          </h1>
          <p className="mt-5 max-w-xl text-base text-[color:var(--foreground)]/62">
            Organiza tareas como notas adhesivas, con autenticación y una experiencia visual mucho más cuidada.
          </p>
        </div>

        <div className="flex justify-center lg:justify-end">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
