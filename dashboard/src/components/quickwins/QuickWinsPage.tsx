import { useState } from "react";
import { Zap, Clock } from "lucide-react";
import type { AuditReport, Severity } from "../../types/audit";
import { getSeverityOrder } from "../../data/scoring";
import Card from "../shared/Card";
import Badge from "../shared/Badge";
import PlatformIcon from "../shared/PlatformIcon";
import EmptyState from "../shared/EmptyState";

interface QuickWinsPageProps {
  report: AuditReport;
}

const severityBadgeStyles: Record<Severity, string> = {
  Critical: "bg-score-fail/10 text-score-fail dark:bg-score-fail/20",
  High: "bg-amber-accent/10 text-amber-accent dark:bg-amber-accent/20",
  Medium: "bg-score-warning/10 text-score-warning dark:bg-score-warning/20",
  Low: "bg-navy-400/10 text-navy-400 dark:bg-navy-400/20",
};

export default function QuickWinsPage({ report }: QuickWinsPageProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const quickWins = [...report.quickWins].sort(
    (a, b) => getSeverityOrder(a.severity) - getSeverityOrder(b.severity),
  );

  if (quickWins.length === 0) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-navy-900 dark:text-white">
            Quick Wins
          </h1>
          <p className="mt-1 text-sm text-navy-400">
            Low-effort, high-impact improvements you can make right now.
          </p>
        </header>
        <Card>
          <EmptyState
            title="No quick wins identified"
            description="Your campaigns are well-optimized. There are no quick wins to address at this time."
            icon={<Zap />}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 dark:text-white">
            Quick Wins
          </h1>
          <p className="mt-1 text-sm text-navy-400">
            {quickWins.length} low-effort improvement{quickWins.length !== 1 ? "s" : ""} sorted by impact.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-amber-accent/10 px-3 py-2 text-amber-accent dark:bg-amber-accent/20">
          <Zap size={18} />
          <span className="text-sm font-semibold">{quickWins.length} wins</span>
        </div>
      </header>

      <div className="space-y-4">
        {quickWins.map((win) => {
          const isExpanded = expandedId === win.id;

          return (
            <Card key={win.id} padding="sm" className="transition-shadow hover:shadow-md">
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : win.id)}
                className="w-full text-left"
              >
                <div className="flex items-start gap-4">
                  {/* Zap accent */}
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-accent/10 text-amber-accent dark:bg-amber-accent/20">
                    <Zap size={18} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <PlatformIcon platform={win.id.startsWith("G") ? "google" : win.id.startsWith("M") ? "meta" : win.id.startsWith("L") ? "linkedin" : win.id.startsWith("T") ? "tiktok" : "microsoft"} size={24} />
                      <span className="font-mono text-xs font-semibold text-navy-500 dark:text-navy-400">
                        {win.id}
                      </span>
                      <span
                        className={[
                          "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                          severityBadgeStyles[win.severity],
                        ].join(" ")}
                      >
                        {win.severity}
                      </span>
                      <Badge status={win.status} size="sm" />
                      {win.estimatedTime && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-navy-100 px-2 py-0.5 text-[10px] font-medium text-navy-500 dark:bg-navy-700 dark:text-navy-300">
                          <Clock size={10} />
                          {win.estimatedTime}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-1.5 text-sm font-semibold text-navy-900 dark:text-white">
                      {win.check}
                    </h3>

                    <p className="mt-1 text-sm text-navy-500 dark:text-navy-400">
                      {win.finding}
                    </p>
                  </div>

                  {/* Expand indicator */}
                  <div className="shrink-0 text-navy-400">
                    <svg
                      className={[
                        "h-5 w-5 transition-transform duration-200",
                        isExpanded ? "rotate-180" : "",
                      ].join(" ")}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="mt-4 ml-13 border-t border-navy-100 pt-4 dark:border-navy-700">
                  <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-navy-400">
                    Recommendation
                  </h4>
                  <p className="text-sm text-navy-700 dark:text-navy-200">
                    {win.recommendation}
                  </p>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
