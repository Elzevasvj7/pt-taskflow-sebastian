export const THEME_STORAGE_KEY = "taskflow-theme";

export type ThemeMode = "light" | "dark";

export function resolveTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function getThemeSnapshot(): ThemeMode {
  return typeof window === "undefined" ? "light" : resolveTheme();
}

export function getServerThemeSnapshot(): ThemeMode {
  return "light";
}

export function subscribeToTheme(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleThemeChange = () => callback();
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  window.addEventListener("themechange", handleThemeChange);
  mediaQuery.addEventListener("change", handleThemeChange);

  return () => {
    window.removeEventListener("themechange", handleThemeChange);
    mediaQuery.removeEventListener("change", handleThemeChange);
  };
}

export const themeScript = `
(() => {
  const storageKey = "${THEME_STORAGE_KEY}";
  const storedTheme = localStorage.getItem(storageKey);
  const theme =
    storedTheme === "light" || storedTheme === "dark"
      ? storedTheme
      : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
  document.documentElement.dataset.theme = theme;
})();
`;
