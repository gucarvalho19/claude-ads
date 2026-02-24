import { Search } from "lucide-react";
import type { Severity, CheckStatus } from "../../types/audit";

interface FilterBarProps {
  severities: Severity[];
  statuses: CheckStatus[];
  searchTerm: string;
  onSeverityChange: (severities: Severity[]) => void;
  onStatusChange: (statuses: CheckStatus[]) => void;
  onSearchChange: (term: string) => void;
}

const allSeverities: Severity[] = ["Critical", "High", "Medium", "Low"];
const allStatuses: CheckStatus[] = ["PASS", "WARNING", "FAIL", "N/A"];

const severityColors: Record<
  Severity,
  { active: string; inactive: string }
> = {
  Critical: {
    active: "bg-score-fail text-white",
    inactive:
      "bg-score-fail/10 text-score-fail hover:bg-score-fail/20 dark:bg-score-fail/20 dark:hover:bg-score-fail/30",
  },
  High: {
    active: "bg-amber-accent text-white",
    inactive:
      "bg-amber-accent/10 text-amber-accent hover:bg-amber-accent/20 dark:bg-amber-accent/20 dark:hover:bg-amber-accent/30",
  },
  Medium: {
    active: "bg-score-warning text-navy-900",
    inactive:
      "bg-score-warning/10 text-score-warning hover:bg-score-warning/20 dark:bg-score-warning/20 dark:hover:bg-score-warning/30",
  },
  Low: {
    active: "bg-navy-400 text-white",
    inactive:
      "bg-navy-400/10 text-navy-400 hover:bg-navy-400/20 dark:bg-navy-400/20 dark:hover:bg-navy-400/30",
  },
};

const statusColors: Record<
  CheckStatus,
  { active: string; inactive: string }
> = {
  PASS: {
    active: "bg-score-pass text-white",
    inactive:
      "bg-score-pass/10 text-score-pass hover:bg-score-pass/20 dark:bg-score-pass/20 dark:hover:bg-score-pass/30",
  },
  WARNING: {
    active: "bg-score-warning text-navy-900",
    inactive:
      "bg-score-warning/10 text-score-warning hover:bg-score-warning/20 dark:bg-score-warning/20 dark:hover:bg-score-warning/30",
  },
  FAIL: {
    active: "bg-score-fail text-white",
    inactive:
      "bg-score-fail/10 text-score-fail hover:bg-score-fail/20 dark:bg-score-fail/20 dark:hover:bg-score-fail/30",
  },
  "N/A": {
    active: "bg-score-na text-white",
    inactive:
      "bg-score-na/10 text-score-na hover:bg-score-na/20 dark:bg-score-na/20 dark:hover:bg-score-na/30",
  },
};

function toggleItem<T>(list: T[], item: T): T[] {
  return list.includes(item)
    ? list.filter((i) => i !== item)
    : [...list, item];
}

export default function FilterBar({
  severities,
  statuses,
  searchTerm,
  onSeverityChange,
  onStatusChange,
  onSearchChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Search input */}
      <div className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-navy-400"
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search checks..."
          className={[
            "w-full rounded-lg border py-2 pl-9 pr-3 text-sm outline-none",
            "border-navy-200 bg-white text-navy-800 placeholder:text-navy-400",
            "focus:border-amber-accent focus:ring-1 focus:ring-amber-accent",
            "dark:border-navy-700 dark:bg-navy-900 dark:text-navy-100 dark:placeholder:text-navy-500",
            "dark:focus:border-amber-accent dark:focus:ring-amber-accent",
          ].join(" ")}
        />
      </div>

      {/* Severity chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-navy-400 dark:text-navy-500">
          Severity
        </span>
        {allSeverities.map((sev) => {
          const isActive = severities.includes(sev);
          const colors = severityColors[sev];
          return (
            <button
              key={sev}
              type="button"
              onClick={() => onSeverityChange(toggleItem(severities, sev))}
              className={[
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                isActive ? colors.active : colors.inactive,
              ].join(" ")}
            >
              {sev}
            </button>
          );
        })}
      </div>

      {/* Status chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-navy-400 dark:text-navy-500">
          Status
        </span>
        {allStatuses.map((st) => {
          const isActive = statuses.includes(st);
          const colors = statusColors[st];
          return (
            <button
              key={st}
              type="button"
              onClick={() => onStatusChange(toggleItem(statuses, st))}
              className={[
                "rounded-full px-3 py-1 font-mono text-xs font-medium transition-colors",
                isActive ? colors.active : colors.inactive,
              ].join(" ")}
            >
              {st}
            </button>
          );
        })}
      </div>
    </div>
  );
}
