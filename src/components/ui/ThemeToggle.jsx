import { Moon, Sun } from "lucide-react";
import { useUIStore } from "../../store/uiStore";

export default function ThemeToggle() {
  const theme = useUIStore((state) => state.theme);
  const setTheme = useUIStore((state) => state.setTheme);
  const isDark = theme === "dark";
  const label = `Switch to ${isDark ? "light" : "dark"} mode`;

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      title={label}
      className="inline-flex size-12 shrink-0 items-center justify-center rounded-sm bg-background hover:bg-surface"
    >
      {isDark ? <Sun size={22} /> : <Moon size={22} />}
    </button>
  );
}
