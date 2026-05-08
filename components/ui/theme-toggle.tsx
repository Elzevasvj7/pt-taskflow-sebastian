"use client";

import { useSyncExternalStore } from "react";
import { MoonStar, SunMedium } from "lucide-react";
import {
  THEME_STORAGE_KEY,
  getServerThemeSnapshot,
  getThemeSnapshot,
  subscribeToTheme,
} from "@/lib/theme";

export function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );
  const isDark = theme === "dark";

  const handleToggle = () => {
    const next = isDark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem(THEME_STORAGE_KEY, next);
    window.dispatchEvent(new Event("themechange"));
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[color:var(--panel)] px-3 py-2 text-xs font-semibold text-[color:var(--foreground)] shadow-[0_8px_25px_-20px_rgba(0,0,0,0.75)] transition hover:-translate-y-px"
      aria-label="Cambiar tema"
    >
      {isDark ? (
        <SunMedium className="h-4 w-4" />
      ) : (
        <MoonStar className="h-4 w-4" />
      )}
    </button>
  );
}
