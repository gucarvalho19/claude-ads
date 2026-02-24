import type { Grade } from "../../types/audit";
import { getGradeColor, getGradeLabel } from "../../data/scoring";
import Card from "../shared/Card";

interface GradeCardProps {
  grade: Grade;
  label: string;
  score: number;
}

export default function GradeCard({ grade, label, score }: GradeCardProps) {
  const gradeColor = getGradeColor(grade);
  const gradeLabel = getGradeLabel(grade);

  return (
    <Card className="flex items-center gap-5" padding="md">
      {/* Grade letter */}
      <div
        className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl font-mono text-5xl font-bold"
        style={{
          color: gradeColor,
          backgroundColor: `color-mix(in srgb, ${gradeColor} 12%, transparent)`,
        }}
      >
        {grade}
      </div>

      {/* Score and label */}
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-3xl font-bold text-navy-900 dark:text-white">
            {Math.round(score)}
          </span>
          <span className="text-sm text-navy-500 dark:text-navy-400">
            / 100
          </span>
        </div>
        <span className="text-sm font-medium text-navy-600 dark:text-navy-300">
          {label}
        </span>
        <span
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: gradeColor }}
        >
          {gradeLabel}
        </span>
      </div>
    </Card>
  );
}
