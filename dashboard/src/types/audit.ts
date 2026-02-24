export type Severity = "Critical" | "High" | "Medium" | "Low";
export type CheckStatus = "PASS" | "WARNING" | "FAIL" | "N/A";
export type Grade = "A" | "B" | "C" | "D" | "F";
export type PlatformId = "google" | "meta" | "linkedin" | "tiktok" | "microsoft";

export interface CheckResult {
  id: string;
  check: string;
  category: string;
  severity: Severity;
  status: CheckStatus;
  finding: string;
  recommendation: string;
  estimatedTime?: string;
  isQuickWin?: boolean;
}

export interface CategoryScore {
  name: string;
  weight: number;
  score: number;
  totalChecks: number;
  passed: number;
  warnings: number;
  failed: number;
  na: number;
}

export interface PlatformReport {
  platform: PlatformId;
  name: string;
  score: number;
  grade: Grade;
  budgetShare: number;
  categories: CategoryScore[];
  checks: CheckResult[];
}

export interface BudgetAllocation {
  platform: PlatformId;
  currentPercent: number;
  recommendedPercent: number;
  monthlySpend: number;
  recommendedSpend: number;
}

export interface BenchmarkMetric {
  metric: string;
  actual: number;
  benchmark: number;
  unit: string;
}

export interface CreativeAlert {
  platform: PlatformId;
  type: "fatigue" | "missing_format" | "low_diversity" | "spec_violation";
  severity: Severity;
  message: string;
  detail: string;
}

export interface AuditReport {
  generatedAt: string;
  businessType: string;
  industry: string;
  totalScore: number;
  totalGrade: Grade;
  platforms: PlatformReport[];
  budget: {
    totalMonthly: number;
    allocations: BudgetAllocation[];
    scaleList: string[];
    killList: string[];
  };
  benchmarks: BenchmarkMetric[];
  creativeAlerts: CreativeAlert[];
  quickWins: CheckResult[];
  topIssues: CheckResult[];
}

// Scoring constants
export const SEVERITY_MULTIPLIER: Record<Severity, number> = {
  Critical: 5.0,
  High: 3.0,
  Medium: 1.5,
  Low: 0.5,
};

export const STATUS_POINTS: Record<CheckStatus, number | null> = {
  PASS: 1.0,
  WARNING: 0.5,
  FAIL: 0,
  "N/A": null,
};

export const GRADE_THRESHOLDS: { min: number; grade: Grade; label: string }[] = [
  { min: 90, grade: "A", label: "Excellent" },
  { min: 75, grade: "B", label: "Good" },
  { min: 60, grade: "C", label: "Needs Improvement" },
  { min: 40, grade: "D", label: "Poor" },
  { min: 0, grade: "F", label: "Critical" },
];

export const PLATFORM_NAMES: Record<PlatformId, string> = {
  google: "Google Ads",
  meta: "Meta Ads",
  linkedin: "LinkedIn Ads",
  tiktok: "TikTok Ads",
  microsoft: "Microsoft Ads",
};
