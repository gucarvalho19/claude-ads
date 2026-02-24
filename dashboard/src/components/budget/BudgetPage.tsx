import { TrendingUp, XCircle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { AuditReport } from "../../types/audit";
import { PLATFORM_NAMES } from "../../types/audit";
import Card from "../shared/Card";
import PlatformIcon from "../shared/PlatformIcon";
import AllocationPie from "./AllocationPie";

interface BudgetPageProps {
  report: AuditReport;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function BudgetPage({ report }: BudgetPageProps) {
  const { budget } = report;
  const totalRecommended = budget.allocations.reduce(
    (sum, a) => sum + a.recommendedSpend,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-bold text-navy-900 dark:text-white">
          Budget Analysis
        </h1>
        <p className="mt-1 text-sm text-navy-400">
          Current allocation vs. recommended rebalancing across platforms.
        </p>
      </header>

      {/* Total budget */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-navy-400">
              Total Monthly Budget
            </p>
            <p className="mt-1 text-3xl font-bold text-navy-900 dark:text-white">
              {formatCurrency(budget.totalMonthly)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium uppercase tracking-wider text-navy-400">
              Recommended
            </p>
            <p className="mt-1 text-3xl font-bold text-navy-900 dark:text-white">
              {formatCurrency(totalRecommended)}
            </p>
          </div>
        </div>
      </Card>

      {/* Pie charts */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <AllocationPie
            allocations={budget.allocations}
            type="current"
            title="Current Allocation"
          />
        </Card>
        <Card>
          <AllocationPie
            allocations={budget.allocations}
            type="recommended"
            title="Recommended Allocation"
          />
        </Card>
      </div>

      {/* Allocation comparison table */}
      <Card>
        <h2 className="mb-4 text-sm font-semibold text-navy-700 dark:text-navy-200">
          Allocation Comparison
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-200 dark:border-navy-700">
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-navy-400">
                  Platform
                </th>
                <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-navy-400">
                  Current %
                </th>
                <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-navy-400">
                  Current Spend
                </th>
                <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-navy-400">
                  Recommended %
                </th>
                <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-navy-400">
                  Recommended Spend
                </th>
                <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-navy-400">
                  Delta
                </th>
              </tr>
            </thead>
            <tbody>
              {budget.allocations.map((a) => {
                const delta = a.recommendedPercent - a.currentPercent;
                const deltaSpend = a.recommendedSpend - a.monthlySpend;
                const isPositive = delta > 0;
                const isNeutral = delta === 0;

                return (
                  <tr
                    key={a.platform}
                    className="border-b border-navy-100 last:border-0 dark:border-navy-800"
                  >
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <PlatformIcon platform={a.platform} size={24} />
                        <span className="font-medium text-navy-900 dark:text-white">
                          {PLATFORM_NAMES[a.platform]}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-navy-700 dark:text-navy-200">
                      {a.currentPercent}%
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-navy-700 dark:text-navy-200">
                      {formatCurrency(a.monthlySpend)}
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-navy-700 dark:text-navy-200">
                      {a.recommendedPercent}%
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-navy-700 dark:text-navy-200">
                      {formatCurrency(a.recommendedSpend)}
                    </td>
                    <td className="px-3 py-3 text-right">
                      {isNeutral ? (
                        <span className="font-mono text-navy-400">&mdash;</span>
                      ) : (
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
                          <span className="text-xs font-normal text-navy-400">
                            ({isPositive ? "+" : ""}
                            {formatCurrency(deltaSpend)})
                          </span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Scale & Kill lists */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Scale List */}
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-score-pass/10 text-score-pass dark:bg-score-pass/20">
              <TrendingUp size={18} />
            </div>
            <h2 className="text-sm font-semibold text-navy-700 dark:text-navy-200">
              Scale List
            </h2>
            <span className="rounded-full bg-score-pass/10 px-2 py-0.5 text-xs font-semibold text-score-pass dark:bg-score-pass/20">
              {budget.scaleList.length}
            </span>
          </div>
          {budget.scaleList.length > 0 ? (
            <ul className="space-y-2">
              {budget.scaleList.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 rounded-lg bg-score-pass/5 px-3 py-2 text-sm text-navy-700 dark:bg-score-pass/10 dark:text-navy-200"
                >
                  <TrendingUp size={14} className="mt-0.5 shrink-0 text-score-pass" />
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm italic text-navy-400">
              No campaigns identified for scaling.
            </p>
          )}
        </Card>

        {/* Kill List */}
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-score-fail/10 text-score-fail dark:bg-score-fail/20">
              <XCircle size={18} />
            </div>
            <h2 className="text-sm font-semibold text-navy-700 dark:text-navy-200">
              Kill List
            </h2>
            <span className="rounded-full bg-score-fail/10 px-2 py-0.5 text-xs font-semibold text-score-fail dark:bg-score-fail/20">
              {budget.killList.length}
            </span>
          </div>
          {budget.killList.length > 0 ? (
            <ul className="space-y-2">
              {budget.killList.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 rounded-lg bg-score-fail/5 px-3 py-2 text-sm text-navy-700 dark:bg-score-fail/10 dark:text-navy-200"
                >
                  <XCircle size={14} className="mt-0.5 shrink-0 text-score-fail" />
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm italic text-navy-400">
              No campaigns flagged for removal.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
