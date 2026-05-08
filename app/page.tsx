import { Suspense } from "react";
import { TodoContainer } from "@/components/todo";

export default async function Home() {
  return (
    <div className="relative flex min-h-screen items-start justify-center overflow-hidden px-4 py-8 sm:py-12">
      <div className="pointer-events-none absolute left-1/2 top-20 h-56 w-[46rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,123,142,0.26)_0%,rgba(255,123,142,0)_68%)] blur-3xl" />
      <Suspense>
        <TodoContainer />
      </Suspense>
    </div>
  );
}
