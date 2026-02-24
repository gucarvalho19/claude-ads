import { useState } from "react";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  ChevronDown,
} from "lucide-react";
import type {
  AuditReport,
  CheckResult,
  Severity,
  PlatformId,
} from "../../types/audit";
import Card from "../shared/Card";
import Badge from "../shared/Badge";
import PlatformIcon from "../shared/PlatformIcon";
import ProgressBar from "../shared/ProgressBar";

interface ActionPlanPageProps {
  report: AuditReport;
}

interface SeveritySection {
  severity: Severity;
  icon: typeof AlertTriangle;
  color: string;
  bgColor: string;
  defaultExpanded: boolean;
}

const sectionConfig: SeveritySection[] = [
  {
    severity: "Critical",
    icon: AlertTriangle,
    color: "text-score-fail",
    bgColor: "bg-score-fail/10 dark:bg-score-fail/20",
    defaultExpanded: true,
  },
  {
    severity: "High",
    icon: AlertCircle,
    color: "text-amber-accent",
    bgColor: "bg-amber-accent/10 dark:bg-amber-accent/20",
    defaultExpanded: true,
  },
  {
    severity: "Medium",
    icon: Info,
    color: "text-score-warning",
    bgColor: "bg-score-warning/10 dark:bg-score-warning/20",
    defaultExpanded: false,
  },
  {
    severity: "Low",
    icon: CheckCircle,
    color: "text-navy-400",
    bgColor: "bg-navy-400/10 dark:bg-navy-400/20",
    defaultExpanded: false,
  },
];

function inferPlatform(checkId: string): PlatformId {
  if (checkId.startsWith("G")) return "google";
  if (checkId.startsWith("M") && checkId.startsWith("MS")) return "microsoft";
  if (checkId.startsWith("M")) return "meta";
  if (checkId.startsWith("L")) return "linkedin";
  if (checkId.startsWith("T")) return "tiktok";
  return "google";
}

export default function ActionPlanPage({ report }: ActionPlanPageProps) {
  // Gather all checks across all platforms
  const allChecks: (CheckResult & { platform: PlatformId })[] =
    report.platforms.flatMap((p) =>
      p.checks.map((c) => ({ ...c, platform: p.platform })),
    );

  // Failed and warning checks
  const actionableChecks = allChecks.filter(
    (c) => c.status === "FAIL" || c.status === "WARNING",
  );

  // Total check counts for progress
  const totalChecks = allChecks.filter((c) => c.status !== "N/A").length;
  const passedChecks = allChecks.filter((c) => c.status === "PASS").length;
  const progressPercent =
    totalChecks > 0 ? (passedChecks / totalChecks) * 100 : 0;

  // Group by severity
  const bySeverity = sectionConfig.map((section) => ({
    ...section,
    checks: actionableChecks
      .filter((c) => c.severity === section.severity)
      .sort((a, b) => {
        // FAIL before WARNING within same severity
        if (a.status !== b.status) return a.status === "FAIL" ? -1 : 1;
        return a.id.localeCompare(b.id);
      }),
  }));

  // Track expanded sections
  const [expanded, setExpanded] = useState<Record<Severity, boolean>>(() =>
    Object.fromEntries(
      sectionConfig.map((s) => [s.severity, s.defaultExpanded]),
    ) as Record<Severity, boolean>,
  );

  const toggleSection = (severity: Severity) => {
    setExpanded((prev) => ({ ...prev, [severity]: !prev[severity] }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-bold text-navy-900 dark:text-white">
          Action Plan
        </h1>
        <p className="mt-1 text-sm text-navy-400">
          All issues across platforms, prioritized by severity.
        </p>
      </header>

      {/* Progress overview */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-navy-700 dark:text-navy-200">
              Overall Progress
            </h2>
            <p className="mt-0.5 text-xs text-navy-400">
              {passedChecks} of {totalChecks} items addressed
            </p>
          </div>
          <span className="font-mono text-lg font-bold text-navy-900 dark:text-white">
            {Math.round(progressPercent)}%
          </span>
        </div>
        <div className="mt-3">
          <ProgressBar value={progressPercent} showLabel={false} />
        </div>
        <div className="mt-3 flex gap-4 text-xs text-navy-400">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-score-fail" />
            {actionableChecks.filter((c) => c.status === "FAIL").length} Failed
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-score-warning" />
            {actionableChecks.filter((c) => c.status === "WARNING").length} Warnings
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-score-pass" />
            {passedChecks} Passed
          </span>
        </div>
      </Card>

      {/* Severity sections */}
      {bySeverity.map((section) => {
        const Icon = section.icon;
        const isExpanded = expanded[section.severity];

        return (
          <div key={section.severity} className="space-y-3">
            {/* Section header */}
            <button
              type="button"
              onClick={() => toggleSection(section.severity)}
              className={[
                "flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-colors",
                section.bgColor,
              ].join(" ")}
            >
              <Icon size={20} className={section.color} />
              <span
                className={[
                  "text-sm font-semibold",
                  section.color,
                ].join(" ")}
              >
                {section.severity}
              </span>
              <span className="rounded-full bg-white/60 px-2 py-0.5 text-xs font-semibold text-navy-700 dark:bg-navy-800/60 dark:text-navy-200">
                {section.checks.length}
              </span>
              <ChevronDown
                size={16}
                className={[
                  "ml-auto transition-transform duration-200",
                  section.color,
                  isExpanded ? "rotate-180" : "",
                ].join(" ")}
              />
            </button>

            {/* Section items */}
            {isExpanded && section.checks.length > 0 && (
              <div className="space-y-2 pl-2">
                {section.checks.map((check) => (
                  <Card key={check.id} padding="sm">
                    <div className="flex items-start gap-3">
                      <PlatformIcon
                        platform={check.platform ?? inferPlatform(check.id)}
                        size={28}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-navy-500 dark:text-navy-400">
                            {check.id}
                          </span>
                          <Badge status={check.status} size="sm" />
                        </div>
                        <h3 className="mt-1 text-sm font-semibold text-navy-900 dark:text-white">
                          {check.check}
                        </h3>
                        <p className="mt-0.5 text-sm text-navy-500 dark:text-navy-400">
                          {check.finding}
                        </p>
                        {check.recommendation && (
                          <p className="mt-2 rounded-lg bg-navy-50 px-3 py-2 text-xs text-navy-600 dark:bg-navy-900 dark:text-navy-300">
                            {check.recommendation}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {isExpanded && section.checks.length === 0 && (
              <p className="py-3 pl-6 text-sm italic text-navy-400">
                No {section.severity.toLowerCase()} issues found.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
