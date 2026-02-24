import { useRef } from "react";
import { useLocation } from "react-router-dom";
import { Sun, Moon, Upload, Database } from "lucide-react";

interface HeaderProps {
  theme: "dark" | "light";
  onThemeToggle: () => void;
  onFileLoad: (file: File) => void;
  isCustomReport: boolean;
  onLoadSample: () => void;
}

const routeTitles: Record<string, string> = {
  "/": "Dashboard",
  "/platform/google": "Google Ads",
  "/platform/meta": "Meta Ads",
  "/platform/linkedin": "LinkedIn Ads",
  "/platform/tiktok": "TikTok Ads",
  "/platform/microsoft": "Microsoft Ads",
  "/quick-wins": "Quick Wins",
  "/action-plan": "Action Plan",
  "/budget": "Budget Allocation",
  "/benchmarks": "Benchmarks",
  "/creative": "Creative Analysis",
};

export default function Header({
  theme,
  onThemeToggle,
  onFileLoad,
  isCustomReport,
  onLoadSample,
}: HeaderProps) {
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pageTitle = routeTitles[location.pathname] ?? "Dashboard";

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      onFileLoad(file);
      // Reset so the same file can be re-selected
      e.target.value = "";
    }
  }

  return (
    <header
      className={[
        "flex h-16 shrink-0 items-center justify-between border-b px-6",
        "border-navy-200 bg-white/80 backdrop-blur-sm",
        "dark:border-navy-800 dark:bg-navy-900/80 dark:backdrop-blur-sm",
      ].join(" ")}
    >
      {/* Page title */}
      <h1 className="text-xl font-semibold text-navy-900 dark:text-white">
        {pageTitle}
      </h1>

      {/* Right-side actions */}
      <div className="flex items-center gap-2">
        {/* Load Report */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className={[
            "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            "border border-navy-200 text-navy-600 hover:bg-navy-50",
            "dark:border-navy-700 dark:text-navy-300 dark:hover:bg-navy-800",
          ].join(" ")}
          aria-label="Load audit report JSON file"
        >
          <Upload size={16} />
          <span className="hidden sm:inline">Load Report</span>
        </button>

        {/* Sample Data (shown only when a custom report is loaded) */}
        {isCustomReport && (
          <button
            onClick={onLoadSample}
            className={[
              "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              "border border-navy-200 text-navy-600 hover:bg-navy-50",
              "dark:border-navy-700 dark:text-navy-300 dark:hover:bg-navy-800",
            ].join(" ")}
            aria-label="Load sample data"
          >
            <Database size={16} />
            <span className="hidden sm:inline">Sample Data</span>
          </button>
        )}

        {/* Theme toggle */}
        <button
          onClick={onThemeToggle}
          className={[
            "inline-flex items-center justify-center rounded-lg p-2 transition-colors",
            "text-navy-500 hover:bg-navy-50 hover:text-navy-700",
            "dark:text-navy-400 dark:hover:bg-navy-800 dark:hover:text-navy-200",
          ].join(" ")}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
