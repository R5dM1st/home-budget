import { useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "system";
export type Accent = "ocean" | "violet" | "emerald";

function resolveTheme(theme: ThemeMode): "light" | "dark" {
  if (theme !== "system") return theme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem("hb-theme") as ThemeMode | null) ?? "system";
  });

  const [accent, setAccentState] = useState<Accent>(() => {
    return (localStorage.getItem("hb-accent") as Accent | null) ?? "ocean";
  });

  useEffect(() => {
    const apply = () => {
      const activeTheme = resolveTheme(theme);
      document.documentElement.classList.toggle("dark", activeTheme === "dark");
      document.documentElement.dataset.accent = accent;
    };

    apply();
    localStorage.setItem("hb-theme", theme);
    localStorage.setItem("hb-accent", accent);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme, accent]);

  return {
    theme,
    accent,
    setTheme: setThemeState,
    setAccent: setAccentState,
  };
}
