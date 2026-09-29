import { createContext, useCallback, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "portfolio-theme";
const TRANSITION_DURATION = 250;

const ThemeContext = createContext(null);

let transitionTimer;

function getInitialTheme() {
  if (typeof window === "undefined") return "light";

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme) {
  const root = document.documentElement;
  root.classList.add("theme-transition");
  root.classList.toggle("dark", theme === "dark");

  window.clearTimeout(transitionTimer);
  transitionTimer = window.setTimeout(() => {
    root.classList.remove("theme-transition");
  }, TRANSITION_DURATION);
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // localStorage tidak tersedia (mis. private mode) - abaikan
    }
  }, [theme]);

  // Ikuti perubahan preferensi sistem selama user belum memilih manual
  useEffect(() => {
    if (window.localStorage.getItem(STORAGE_KEY)) return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event) =>
      setTheme(event.matches ? "dark" : "light");

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  return (
    <ThemeContext.Provider
      value={{ theme, isDark: theme === "dark", setTheme, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme harus digunakan di dalam ThemeProvider");
  }
  return context;
}
