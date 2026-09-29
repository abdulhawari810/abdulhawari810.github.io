import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

function SunIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v1.5m0 15V21m9-9h-1.5m-15 0H3m15.364-6.364l-1.06 1.06M6.696 17.304l-1.06 1.06m12.728 0l-1.06-1.06M6.696 6.696l-1.06-1.06M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
      />
    </svg>
  );
}

function MoonIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  );
}

export default function ThemeToggle({ className }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? "Light mode" : "Dark mode"}
      aria-label={isDark ? "Aktifkan light mode" : "Aktifkan dark mode"}
      aria-pressed={isDark}
      className={cn(
        "w-10 h-10 rounded-full border border-border-custom flex items-center justify-center hover:bg-border-custom/20 transition-colors",
        className,
      )}
    >
      {isDark ? (
        <SunIcon className="w-5 h-5" />
      ) : (
        <MoonIcon className="w-5 h-5" />
      )}
    </button>
  );
}
