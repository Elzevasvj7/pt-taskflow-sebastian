import { Suspense } from 'react';
import { TodoContainer } from '@/components/todo';

export default async function Home() {
  return (
    <div className="flex min-h-screen items-start justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950">
      <Suspense>
        <TodoContainer/>
      </Suspense>
    </div>
  );
}
