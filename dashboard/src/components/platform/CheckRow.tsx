import { ChevronDown, ChevronRight, Zap, Clock } from "lucide-react";
import type { CheckResult } from "../../types/audit";
import Badge from "../shared/Badge";

interface CheckRowProps {
  check: CheckResult;
  isExpanded: boolean;
  onToggle: () => void;
}

const severityStyles: Record<string, string> = {
  Critical: "bg-score-fail/10 text-score-fail dark:bg-score-fail/20",
  High: "bg-amber-accent/10 text-amber-accent dark:bg-amber-accent/20",
  Medium:
    "bg-score-warning/10 text-score-warning dark:bg-score-warning/20",
  Low: "bg-navy-400/10 text-navy-400 dark:bg-navy-400/20",
};

export default function CheckRow({
  check,
  isExpanded,
  onToggle,
}: CheckRowProps) {
  return (
    <div className="border-b border-navy-100 dark:border-navy-700 last:border-b-0">
      {/* Main row */}
      <button
        type="button"
        onClick={onToggle}
        className={[
          "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors",
          "hover:bg-navy-50 dark:hover:bg-navy-800/60",
          isExpanded ? "bg-navy-50/50 dark:bg-navy-800/40" : "",
        ].join(" ")}
      >
        {/* Expand icon */}
        <span className="shrink-0 text-navy-400 dark:text-navy-500">
          {isExpanded ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
        </span>

        {/* Check ID */}
        <span className="w-14 shrink-0 font-mono text-xs font-medium text-navy-500 dark:text-navy-400">
          {check.id}
        </span>

        {/* Check name */}
        <span className="min-w-0 flex-1 truncate text-sm text-navy-800 dark:text-navy-100">
          {check.check}
        </span>

        {/* Quick win indicator */}
        {check.isQuickWin && (
          <span
            className="shrink-0 text-amber-accent"
            title="Quick Win"
          >
            <Zap size={14} />
          </span>
        )}

        {/* Severity badge */}
        <span
          className={[
            "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
            severityStyles[check.severity],
          ].join(" ")}
        >
          {check.severity}
        </span>

        {/* Status badge */}
        <span className="shrink-0">
          <Badge status={check.status} size="sm" />
        </span>
      </button>

      {/* Expanded detail */}
      <div
        className={[
          "grid transition-[grid-template-rows] duration-200 ease-in-out",
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        ].join(" ")}
      >
        <div className="overflow-hidden">
          <div className="space-y-3 px-4 pb-4 pl-[3.25rem] pt-1">
            {/* Finding */}
            {check.finding && (
              <div>
                <span className="text-xs font-bold text-navy-600 dark:text-navy-300">
                  Finding:
                </span>
                <p className="mt-0.5 text-sm leading-relaxed text-navy-600 dark:text-navy-300">
                  {check.finding}
                </p>
              </div>
            )}

            {/* Recommendation */}
            {check.recommendation && (
              <div>
                <span className="text-xs font-bold text-navy-600 dark:text-navy-300">
                  Recommendation:
                </span>
                <p className="mt-0.5 text-sm leading-relaxed text-navy-600 dark:text-navy-300">
                  {check.recommendation}
                </p>
              </div>
            )}

            {/* Meta: Quick win + estimated time */}
            <div className="flex flex-wrap items-center gap-3">
              {check.isQuickWin && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-accent/10 px-2.5 py-1 text-xs font-medium text-amber-accent dark:bg-amber-accent/20">
                  <Zap size={12} />
                  Quick Win
                </span>
              )}
              {check.estimatedTime && (
                <span className="inline-flex items-center gap-1 text-xs text-navy-400 dark:text-navy-500">
                  <Clock size={12} />
                  {check.estimatedTime}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
