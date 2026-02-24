import type { AuditReport, CheckResult, Severity } from "../../types/audit";
import { SEVERITY_MULTIPLIER } from "../../types/audit";
import Card from "../shared/Card";
import Badge from "../shared/Badge";
import PlatformIcon from "../shared/PlatformIcon";
import HealthGauge from "./HealthGauge";
import GradeCard from "./GradeCard";
import PlatformRow from "./PlatformRow";

interface DashboardPageProps {
  report: AuditReport;
}

const severityColors: Record<Severity, string> = {
  Critical: "bg-score-fail text-white",
  High: "bg-score-warning text-navy-900",
  Medium: "bg-amber-accent text-white",
  Low: "bg-score-na/40 text-navy-700 dark:text-navy-200",
};

export default function DashboardPage({ report }: DashboardPageProps) {
  // Top issues: top 5 FAIL items sorted by severity weight (descending)
  const topIssues = getTopIssues(report);
  // Quick wins: top 5 items flagged as quick wins
  const quickWins = getQuickWins(report);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-navy-900 dark:text-white">
          Audit Dashboard
        </h1>
        <p className="text-sm text-navy-500 dark:text-navy-400">
          {report.businessType} &mdash;{" "}
          {new Date(report.generatedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Top row: HealthGauge + GradeCard */}
      <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
        <div className="flex justify-center">
          <HealthGauge
            score={report.totalScore}
            grade={report.totalGrade}
            size={220}
          />
        </div>
        <GradeCard
          grade={report.totalGrade}
          label="Overall Health Score"
          score={report.totalScore}
        />
      </div>

      {/* Platform rows */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-navy-900 dark:text-white">
          Platform Breakdown
        </h2>
        <div className="space-y-3">
          {report.platforms.map((p) => (
            <PlatformRow key={p.platform} platform={p} />
          ))}
        </div>
      </section>

      {/* Bottom: Top Issues + Quick Wins */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Issues */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-navy-900 dark:text-white">
            Top Issues
          </h2>
          <Card padding="sm">
            {topIssues.length === 0 ? (
              <p className="py-6 text-center text-sm text-navy-400">
                No critical issues found.
              </p>
            ) : (
              <ul className="divide-y divide-navy-100 dark:divide-navy-700">
                {topIssues.map((item) => (
                  <IssueItem key={`${item.platform}-${item.check.id}`} item={item} />
                ))}
              </ul>
            )}
          </Card>
        </section>

        {/* Quick Wins */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-navy-900 dark:text-white">
            Quick Wins
          </h2>
          <Card padding="sm">
            {quickWins.length === 0 ? (
              <p className="py-6 text-center text-sm text-navy-400">
                No quick wins identified.
              </p>
            ) : (
              <ul className="divide-y divide-navy-100 dark:divide-navy-700">
                {quickWins.map((item) => (
                  <IssueItem key={`${item.platform}-${item.check.id}`} item={item} />
                ))}
              </ul>
            )}
          </Card>
        </section>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface PlatformCheck {
  platform: string;
  platformId: string;
  check: CheckResult;
}

function getTopIssues(report: AuditReport): PlatformCheck[] {
  // Prefer report-level topIssues if available, otherwise derive from checks
  if (report.topIssues && report.topIssues.length > 0) {
    return report.topIssues.slice(0, 5).map((check) => {
      const plat = report.platforms.find((p) =>
        p.checks.some((c) => c.id === check.id),
      );
      return {
        platform: plat?.name ?? "",
        platformId: plat?.platform ?? "google",
        check,
      };
    });
  }

  // Derive: collect all FAIL checks, sort by severity
  const allFails: PlatformCheck[] = [];
  for (const p of report.platforms) {
    for (const c of p.checks) {
      if (c.status === "FAIL") {
        allFails.push({
          platform: p.name,
          platformId: p.platform,
          check: c,
        });
      }
    }
  }
  allFails.sort(
    (a, b) =>
      SEVERITY_MULTIPLIER[b.check.severity] -
      SEVERITY_MULTIPLIER[a.check.severity],
  );
  return allFails.slice(0, 5);
}

function getQuickWins(report: AuditReport): PlatformCheck[] {
  // Prefer report-level quickWins if available
  if (report.quickWins && report.quickWins.length > 0) {
    return report.quickWins.slice(0, 5).map((check) => {
      const plat = report.platforms.find((p) =>
        p.checks.some((c) => c.id === check.id),
      );
      return {
        platform: plat?.name ?? "",
        platformId: plat?.platform ?? "google",
        check,
      };
    });
  }

  // Derive: collect all checks with isQuickWin, sort by severity
  const wins: PlatformCheck[] = [];
  for (const p of report.platforms) {
    for (const c of p.checks) {
      if (c.isQuickWin) {
        wins.push({
          platform: p.name,
          platformId: p.platform,
          check: c,
        });
      }
    }
  }
  wins.sort(
    (a, b) =>
      SEVERITY_MULTIPLIER[b.check.severity] -
      SEVERITY_MULTIPLIER[a.check.severity],
  );
  return wins.slice(0, 5);
}

// ---------------------------------------------------------------------------
// Issue/Quick-Win row sub-component
// ---------------------------------------------------------------------------

function IssueItem({ item }: { item: PlatformCheck }) {
  const { check, platformId } = item;

  return (
    <li className="flex items-start gap-3 px-2 py-3">
      {/* Platform icon */}
      <div className="mt-0.5 shrink-0">
        <PlatformIcon
          platform={platformId as "google" | "meta" | "linkedin" | "tiktok" | "microsoft"}
          size={24}
        />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {/* Check ID */}
          <span className="font-mono text-xs font-semibold text-navy-600 dark:text-navy-300">
            {check.id}
          </span>

          {/* Severity badge */}
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase leading-none ${severityColors[check.severity]}`}
          >
            {check.severity}
          </span>

          {/* Status badge */}
          <Badge status={check.status} size="sm" />
        </div>

        {/* Check name */}
        <p className="mt-1 text-sm font-medium text-navy-900 dark:text-white">
          {check.check}
        </p>

        {/* Finding (truncated) */}
        <p className="mt-0.5 line-clamp-2 text-xs text-navy-500 dark:text-navy-400">
          {check.finding}
        </p>

        {/* Estimated time if available */}
        {check.estimatedTime && (
          <span className="mt-1 inline-flex items-center gap-1 text-[10px] text-navy-400 dark:text-navy-500">
            <svg
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {check.estimatedTime}
          </span>
        )}
      </div>
    </li>
  );
}
