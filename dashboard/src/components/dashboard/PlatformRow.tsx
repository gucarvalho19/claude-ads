import { Link } from "react-router-dom";
import type { PlatformReport } from "../../types/audit";
import { getGradeColor } from "../../data/scoring";
import Card from "../shared/Card";
import PlatformIcon from "../shared/PlatformIcon";

interface PlatformRowProps {
  platform: PlatformReport;
}

export default function PlatformRow({ platform }: PlatformRowProps) {
  const gradeColor = getGradeColor(platform.grade);

  const passCount = platform.checks.filter(
    (c) => c.status === "PASS",
  ).length;
  const warnCount = platform.checks.filter(
    (c) => c.status === "WARNING",
  ).length;
  const failCount = platform.checks.filter(
    (c) => c.status === "FAIL",
  ).length;

  return (
    <Link
      to={`/platform/${platform.platform}`}
      className="block transition-transform duration-150 hover:scale-[1.01] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-accent"
    >
      <Card className="flex flex-col gap-4 transition-shadow duration-150 hover:shadow-md sm:flex-row sm:items-center sm:gap-6">
        {/* Left: Platform identity */}
        <div className="flex items-center gap-3 sm:w-48">
          <PlatformIcon platform={platform.platform} size={36} />
          <span className="text-base font-semibold text-navy-900 dark:text-white">
            {platform.name}
          </span>
        </div>

        {/* Center: Score, grade, and progress */}
        <div className="flex flex-1 items-center gap-4">
          {/* Score */}
          <span className="font-mono text-2xl font-bold text-navy-900 dark:text-white">
            {Math.round(platform.score)}
          </span>

          {/* Grade badge */}
          <span
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg font-mono text-sm font-bold text-white"
            style={{ backgroundColor: gradeColor }}
          >
            {platform.grade}
          </span>

          {/* Progress bar */}
          <div className="hidden flex-1 md:block">
            <div className="relative h-2 overflow-hidden rounded-full bg-navy-200 dark:bg-navy-700">
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${Math.min(100, platform.score)}%`,
                  backgroundColor: gradeColor,
                }}
              />
            </div>
          </div>

          {/* Budget share */}
          <span className="whitespace-nowrap text-xs text-navy-500 dark:text-navy-400">
            {Math.round(platform.budgetShare * 100)}% budget
          </span>
        </div>

        {/* Right: Check stats */}
        <div className="flex items-center gap-4 sm:w-52 sm:justify-end">
          <StatDot
            count={passCount}
            colorClass="bg-score-pass"
            label="passed"
          />
          <StatDot
            count={warnCount}
            colorClass="bg-score-warning"
            label="warnings"
          />
          <StatDot
            count={failCount}
            colorClass="bg-score-fail"
            label="failed"
          />
        </div>

        {/* Category indicators */}
        <div className="hidden items-center gap-1 lg:flex">
          {platform.categories.map((cat) => {
            const catColor =
              cat.score >= 80
                ? "var(--color-score-pass)"
                : cat.score >= 60
                  ? "var(--color-score-warning)"
                  : "var(--color-score-fail)";
            return (
              <div
                key={cat.name}
                title={`${cat.name}: ${Math.round(cat.score)}%`}
                className="h-2.5 w-2.5 rounded-full transition-transform duration-150 hover:scale-150"
                style={{ backgroundColor: catColor }}
              />
            );
          })}
        </div>

        {/* Chevron */}
        <svg
          className="hidden h-5 w-5 shrink-0 text-navy-400 dark:text-navy-500 sm:block"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </Card>
    </Link>
  );
}

// Small helper component for the colored dot + count
function StatDot({
  count,
  colorClass,
  label,
}: {
  count: number;
  colorClass: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5" title={`${count} ${label}`}>
      <span className={`inline-block h-2.5 w-2.5 rounded-full ${colorClass}`} />
      <span className="font-mono text-xs text-navy-600 dark:text-navy-300">
        {count}
      </span>
    </div>
  );
}
