import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { AuditReport, CheckStatus } from "../../types/audit";
import Card from "../shared/Card";
import Badge from "../shared/Badge";
import BenchmarkRadar from "./BenchmarkRadar";

interface BenchmarksPageProps {
  report: AuditReport;
}

function getBenchmarkStatus(actual: number, benchmark: number): CheckStatus {
  if (benchmark === 0) return "N/A";
  const ratio = actual / benchmark;
  if (ratio >= 0.9) return "PASS";
  if (ratio >= 0.75) return "WARNING";
  return "FAIL";
}

function formatValue(value: number, unit: string): string {
  if (unit === "%") return `${value.toFixed(1)}%`;
  if (unit === "$") return `$${value.toFixed(2)}`;
  if (unit === "x") return `${value.toFixed(1)}x`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return value.toFixed(2);
}

export default function BenchmarksPage({ report }: BenchmarksPageProps) {
  const { benchmarks } = report;

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-bold text-navy-900 dark:text-white">
          Benchmarks
        </h1>
        <p className="mt-1 text-sm text-navy-400">
          Compare your performance metrics against industry benchmarks.
        </p>
      </header>

      {/* Radar chart */}
      <Card>
        <h2 className="mb-2 text-sm font-semibold text-navy-700 dark:text-navy-200">
          Performance Radar
        </h2>
        <p className="mb-4 text-xs text-navy-400">
          Values normalized as percentage of benchmark (100% = meets benchmark).
        </p>
        <BenchmarkRadar benchmarks={benchmarks} />
      </Card>

      {/* Benchmarks table */}
      <Card>
        <h2 className="mb-4 text-sm font-semibold text-navy-700 dark:text-navy-200">
          Detailed Comparison
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-200 dark:border-navy-700">
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-navy-400">
                  Metric
                </th>
                <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-navy-400">
                  Your Value
                </th>
                <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-navy-400">
                  Benchmark
                </th>
                <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-navy-400">
                  Delta
                </th>
                <th className="px-3 py-2 text-center text-xs font-semibold uppercase tracking-wider text-navy-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {benchmarks.map((b) => {
                const status = getBenchmarkStatus(b.actual, b.benchmark);
                const delta =
                  b.benchmark !== 0
                    ? ((b.actual - b.benchmark) / b.benchmark) * 100
                    : 0;
                const isPositive = delta >= 0;

                return (
                  <tr
                    key={b.metric}
                    className="border-b border-navy-100 last:border-0 dark:border-navy-800"
                  >
                    <td className="px-3 py-3">
                      <span className="font-medium text-navy-900 dark:text-white">
                        {b.metric}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-navy-700 dark:text-navy-200">
                      {formatValue(b.actual, b.unit)}
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-navy-500 dark:text-navy-400">
                      {formatValue(b.benchmark, b.unit)}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span
                        className={[
                          "inline-flex items-center gap-1 font-mono text-sm font-semibold",
                          isPositive
                            ? "text-score-pass"
                            : "text-score-fail",
                        ].join(" ")}
                      >
                        {isPositive ? (
                          <ArrowUpRight size={14} />
                        ) : (
                          <ArrowDownRight size={14} />
                        )}
                        {isPositive ? "+" : ""}
                        {delta.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <Badge status={status} size="sm" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
