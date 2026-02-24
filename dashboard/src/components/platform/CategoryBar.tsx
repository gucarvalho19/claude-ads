import type { CategoryScore } from "../../types/audit";
import Card from "../shared/Card";
import ProgressBar from "../shared/ProgressBar";

interface CategoryBarProps {
  category: CategoryScore;
}

function getScoreColor(score: number): string {
  if (score >= 75) return "bg-score-pass";
  if (score >= 60) return "bg-score-warning";
  if (score >= 40) return "bg-amber-accent";
  return "bg-score-fail";
}

export default function CategoryBar({ category }: CategoryBarProps) {
  const weightPct = Math.round(category.weight * 100);

  return (
    <Card padding="sm" className="flex items-center gap-4">
      {/* Category name */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className="truncate text-sm font-semibold text-navy-800 dark:text-navy-100">
            {category.name}
          </h4>
          <span
            className={[
              "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
              "bg-navy-100 text-navy-500",
              "dark:bg-navy-700 dark:text-navy-400",
            ].join(" ")}
          >
            {weightPct}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-1.5">
          <ProgressBar
            value={category.score}
            color={getScoreColor(category.score)}
            height="sm"
          />
        </div>
      </div>

      {/* Score */}
      <span className="shrink-0 font-mono text-lg font-bold text-navy-800 dark:text-navy-100">
        {Math.round(category.score)}
      </span>

      {/* Check counts */}
      <div className="flex shrink-0 items-center gap-2 text-xs tabular-nums">
        <span className="font-medium text-score-pass">{category.passed}</span>
        <span className="text-navy-300 dark:text-navy-600">/</span>
        <span className="font-medium text-score-warning">
          {category.warnings}
        </span>
        <span className="text-navy-300 dark:text-navy-600">/</span>
        <span className="font-medium text-score-fail">{category.failed}</span>
      </div>
    </Card>
  );
}
