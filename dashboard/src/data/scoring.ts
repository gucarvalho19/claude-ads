import type {
  CheckResult,
  CheckStatus,
  CategoryScore,
  Grade,
  Severity,
} from "../types/audit";
import { SEVERITY_MULTIPLIER, GRADE_THRESHOLDS } from "../types/audit";

const STATUS_POINTS: Record<CheckStatus, number | null> = {
  PASS: 1.0,
  WARNING: 0.5,
  FAIL: 0,
  "N/A": null,
};

export function calculateCategoryScore(
  checks: CheckResult[],
  categoryName: string,
  weight: number,
): CategoryScore {
  const categoryChecks = checks.filter((c) => c.category === categoryName);
  let earned = 0;
  let possible = 0;
  let passed = 0;
  let warnings = 0;
  let failed = 0;
  let na = 0;

  for (const check of categoryChecks) {
    const points = STATUS_POINTS[check.status];
    const sevMult = SEVERITY_MULTIPLIER[check.severity];

    if (points === null) {
      na++;
      continue;
    }

    possible += sevMult;
    earned += points * sevMult;

    if (check.status === "PASS") passed++;
    else if (check.status === "WARNING") warnings++;
    else failed++;
  }

  return {
    name: categoryName,
    weight,
    score: possible > 0 ? (earned / possible) * 100 : 0,
    totalChecks: categoryChecks.length,
    passed,
    warnings,
    failed,
    na,
  };
}

export function calculatePlatformScore(categories: CategoryScore[]): number {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const cat of categories) {
    weightedSum += cat.score * cat.weight;
    totalWeight += cat.weight;
  }

  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

export function getGrade(score: number): Grade {
  for (const t of GRADE_THRESHOLDS) {
    if (score >= t.min) return t.grade;
  }
  return "F";
}

export function getGradeLabel(grade: Grade): string {
  const t = GRADE_THRESHOLDS.find((t) => t.grade === grade);
  return t?.label ?? "Unknown";
}

export function getGradeColor(grade: Grade): string {
  const colors: Record<Grade, string> = {
    A: "var(--color-grade-a)",
    B: "var(--color-grade-b)",
    C: "var(--color-grade-c)",
    D: "var(--color-grade-d)",
    F: "var(--color-grade-f)",
  };
  return colors[grade];
}

export function getStatusColor(status: CheckStatus): string {
  const colors: Record<CheckStatus, string> = {
    PASS: "var(--color-score-pass)",
    WARNING: "var(--color-score-warning)",
    FAIL: "var(--color-score-fail)",
    "N/A": "var(--color-score-na)",
  };
  return colors[status];
}

export function getSeverityOrder(severity: Severity): number {
  const order: Record<Severity, number> = {
    Critical: 0,
    High: 1,
    Medium: 2,
    Low: 3,
  };
  return order[severity];
}
