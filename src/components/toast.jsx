import { Toaster } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";

/**
 * Toaster yang mengikuti tema aktif (light/dark).
 * Render sekali di main.jsx agar konsisten di semua route.
 */
export default function ThemedToaster() {
  const { isDark } = useTheme();

  return (
    <Toaster
      position="top-right"
      theme={isDark ? "dark" : "light"}
      toastOptions={{
        style: {
          background: "var(--background)",
          color: "var(--foreground)",
          border: "1px solid var(--border-custom)",
        },
      }}
    />
  );
}
