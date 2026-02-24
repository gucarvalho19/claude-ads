import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import type { AuditReport, PlatformId } from "../../types/audit";
import { getGradeColor, getGradeLabel } from "../../data/scoring";
import PlatformIcon from "../shared/PlatformIcon";
import Card from "../shared/Card";
import CategoryBar from "./CategoryBar";
import CheckTable from "./CheckTable";

interface PlatformPageProps {
  report: AuditReport;
}

export default function PlatformPage({ report }: PlatformPageProps) {
  const { id } = useParams<{ id: string }>();
  const platform = report.platforms.find(
    (p) => p.platform === (id as PlatformId),
  );

  if (!platform) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
        <h2 className="mb-2 text-xl font-semibold text-navy-800 dark:text-navy-100">
          Platform not found
        </h2>
        <p className="mb-6 text-sm text-navy-400">
          No report data found for platform &ldquo;{id}&rdquo;.
        </p>
        <Link
          to="/"
          className={[
            "inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors",
            "bg-amber-accent text-white hover:bg-amber-dark",
            "focus:outline-none focus:ring-2 focus:ring-amber-accent focus:ring-offset-2",
            "dark:focus:ring-offset-navy-900",
          ].join(" ")}
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const gradeColor = getGradeColor(platform.grade);
  const gradeLabel = getGradeLabel(platform.grade);

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link
        to="/"
        className={[
          "inline-flex items-center gap-1.5 text-sm font-medium transition-colors",
          "text-navy-500 hover:text-navy-700",
          "dark:text-navy-400 dark:hover:text-navy-200",
        ].join(" ")}
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>

      {/* Header */}
      <Card padding="lg">
        <div className="flex items-center gap-5">
          <PlatformIcon platform={platform.platform} size={56} />

          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-navy-900 dark:text-white">
              {platform.name}
            </h1>
            <p className="mt-1 text-sm text-navy-500 dark:text-navy-400">
              {platform.checks.length} checks &middot;{" "}
              {platform.categories.length} categories &middot;{" "}
              {Math.round(platform.budgetShare * 100)}% of total budget
            </p>
          </div>

          {/* Score */}
          <div className="flex shrink-0 items-center gap-4">
            <div className="text-right">
              <span className="font-mono text-4xl font-bold text-navy-900 dark:text-white">
                {Math.round(platform.score)}
              </span>
              <span className="ml-1 text-sm text-navy-400">/100</span>
            </div>

            {/* Grade badge */}
            <div
              className="flex size-14 items-center justify-center rounded-xl font-mono text-2xl font-bold text-white"
              style={{ backgroundColor: gradeColor }}
              title={gradeLabel}
            >
              {platform.grade}
            </div>
          </div>
        </div>
      </Card>

      {/* Category scores */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-navy-800 dark:text-navy-100">
          Category Scores
        </h2>
        <div className="grid gap-3">
          {platform.categories.map((cat) => (
            <CategoryBar key={cat.name} category={cat} />
          ))}
        </div>
      </section>

      {/* Check table */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-navy-800 dark:text-navy-100">
          All Checks
        </h2>
        <CheckTable checks={platform.checks} />
      </section>
    </div>
  );
}
