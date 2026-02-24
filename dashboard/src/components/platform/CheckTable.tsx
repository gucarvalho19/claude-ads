import { useState, useMemo } from "react";
import type { CheckResult, Severity, CheckStatus } from "../../types/audit";
import { getSeverityOrder } from "../../data/scoring";
import FilterBar from "../shared/FilterBar";
import Card from "../shared/Card";
import CheckRow from "./CheckRow";

interface CheckTableProps {
  checks: CheckResult[];
}

const allSeverities: Severity[] = ["Critical", "High", "Medium", "Low"];
const allStatuses: CheckStatus[] = ["PASS", "WARNING", "FAIL", "N/A"];

export default function CheckTable({ checks }: CheckTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [severities, setSeverities] = useState<Severity[]>(allSeverities);
  const [statuses, setStatuses] = useState<CheckStatus[]>(allStatuses);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredChecks = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return checks
      .filter((check) => {
        // Severity filter
        if (!severities.includes(check.severity)) return false;

        // Status filter
        if (!statuses.includes(check.status)) return false;

        // Search filter
        if (term) {
          const searchable = [
            check.id,
            check.check,
            check.finding,
            check.recommendation,
          ]
            .join(" ")
            .toLowerCase();
          if (!searchable.includes(term)) return false;
        }

        return true;
      })
      .sort((a, b) => getSeverityOrder(a.severity) - getSeverityOrder(b.severity));
  }, [checks, severities, statuses, searchTerm]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card padding="sm">
        <FilterBar
          severities={severities}
          statuses={statuses}
          searchTerm={searchTerm}
          onSeverityChange={setSeverities}
          onStatusChange={setStatuses}
          onSearchChange={setSearchTerm}
        />
      </Card>

      {/* Summary count */}
      <div className="flex items-center justify-between px-1">
        <p className="text-sm text-navy-500 dark:text-navy-400">
          <span className="font-semibold text-navy-700 dark:text-navy-200">
            {filteredChecks.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-navy-700 dark:text-navy-200">
            {checks.length}
          </span>{" "}
          checks shown
        </p>
      </div>

      {/* Table */}
      <Card padding="sm" className="overflow-hidden !p-0">
        {/* Header */}
        <div
          className={[
            "flex items-center gap-3 border-b px-4 py-2.5 text-xs font-semibold uppercase tracking-wider",
            "border-navy-100 bg-navy-50 text-navy-500",
            "dark:border-navy-700 dark:bg-navy-800 dark:text-navy-400",
          ].join(" ")}
        >
          <span className="w-4 shrink-0" />
          <span className="w-14 shrink-0">ID</span>
          <span className="min-w-0 flex-1">Check</span>
          <span className="w-16 shrink-0 text-center">Severity</span>
          <span className="w-16 shrink-0 text-center">Status</span>
        </div>

        {/* Rows */}
        {filteredChecks.length > 0 ? (
          <div>
            {filteredChecks.map((check) => (
              <CheckRow
                key={check.id}
                check={check}
                isExpanded={expandedRows.has(check.id)}
                onToggle={() => toggleRow(check.id)}
              />
            ))}
          </div>
        ) : (
          <div className="px-4 py-12 text-center text-sm text-navy-400 dark:text-navy-500">
            No checks match the current filters.
          </div>
        )}
      </Card>
    </div>
  );
}
