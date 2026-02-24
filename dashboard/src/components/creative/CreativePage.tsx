import {
  Flame,
  Layout,
  Layers,
  AlertTriangle,
  Palette,
} from "lucide-react";
import type {
  AuditReport,
  CreativeAlert,
  Severity,
} from "../../types/audit";
import Card from "../shared/Card";
import PlatformIcon from "../shared/PlatformIcon";
import EmptyState from "../shared/EmptyState";

interface CreativePageProps {
  report: AuditReport;
}

type AlertType = CreativeAlert["type"];

interface AlertGroupConfig {
  type: AlertType;
  label: string;
  icon: typeof Flame;
  color: string;
  bgColor: string;
}

const alertGroupConfig: AlertGroupConfig[] = [
  {
    type: "fatigue",
    label: "Creative Fatigue",
    icon: Flame,
    color: "text-score-fail",
    bgColor: "bg-score-fail/10 dark:bg-score-fail/20",
  },
  {
    type: "missing_format",
    label: "Missing Formats",
    icon: Layout,
    color: "text-amber-accent",
    bgColor: "bg-amber-accent/10 dark:bg-amber-accent/20",
  },
  {
    type: "low_diversity",
    label: "Low Diversity",
    icon: Layers,
    color: "text-score-warning",
    bgColor: "bg-score-warning/10 dark:bg-score-warning/20",
  },
  {
    type: "spec_violation",
    label: "Spec Violations",
    icon: AlertTriangle,
    color: "text-score-fail",
    bgColor: "bg-score-fail/10 dark:bg-score-fail/20",
  },
];

const severityBadgeStyles: Record<Severity, string> = {
  Critical: "bg-score-fail/10 text-score-fail dark:bg-score-fail/20",
  High: "bg-amber-accent/10 text-amber-accent dark:bg-amber-accent/20",
  Medium: "bg-score-warning/10 text-score-warning dark:bg-score-warning/20",
  Low: "bg-navy-400/10 text-navy-400 dark:bg-navy-400/20",
};

export default function CreativePage({ report }: CreativePageProps) {
  const { creativeAlerts } = report;

  if (creativeAlerts.length === 0) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-navy-900 dark:text-white">
            Creative Analysis
          </h1>
          <p className="mt-1 text-sm text-navy-400">
            Creative health alerts and recommendations.
          </p>
        </header>
        <Card>
          <EmptyState
            title="No creative alerts"
            description="Your creative assets look healthy. No fatigue, format, or spec issues detected."
            icon={<Palette />}
          />
        </Card>
      </div>
    );
  }

  // Group alerts by type
  const groupedAlerts = alertGroupConfig
    .map((config) => ({
      ...config,
      alerts: creativeAlerts.filter((a) => a.type === config.type),
    }))
    .filter((group) => group.alerts.length > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 dark:text-white">
            Creative Analysis
          </h1>
          <p className="mt-1 text-sm text-navy-400">
            {creativeAlerts.length} creative alert{creativeAlerts.length !== 1 ? "s" : ""} across your campaigns.
          </p>
        </div>
        <div className="flex gap-2">
          {groupedAlerts.map((group) => {
            const Icon = group.icon;
            return (
              <div
                key={group.type}
                className={[
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5",
                  group.bgColor,
                ].join(" ")}
              >
                <Icon size={14} className={group.color} />
                <span className={["text-xs font-semibold", group.color].join(" ")}>
                  {group.alerts.length}
                </span>
              </div>
            );
          })}
        </div>
      </header>

      {/* Alert groups */}
      {groupedAlerts.map((group) => {
        const Icon = group.icon;

        return (
          <div key={group.type} className="space-y-3">
            {/* Group header */}
            <div className="flex items-center gap-2">
              <div
                className={[
                  "flex h-8 w-8 items-center justify-center rounded-lg",
                  group.bgColor,
                ].join(" ")}
              >
                <Icon size={16} className={group.color} />
              </div>
              <h2 className="text-sm font-semibold text-navy-700 dark:text-navy-200">
                {group.label}
              </h2>
              <span
                className={[
                  "rounded-full px-2 py-0.5 text-xs font-semibold",
                  group.bgColor,
                  group.color,
                ].join(" ")}
              >
                {group.alerts.length}
              </span>
            </div>

            {/* Alert cards */}
            <div className="space-y-2 pl-2">
              {group.alerts.map((alert, i) => (
                <Card key={`${group.type}-${i}`} padding="sm">
                  <div className="flex items-start gap-3">
                    <PlatformIcon platform={alert.platform} size={28} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={[
                            "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                            severityBadgeStyles[alert.severity],
                          ].join(" ")}
                        >
                          {alert.severity}
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-semibold text-navy-900 dark:text-white">
                        {alert.message}
                      </p>
                      <p className="mt-0.5 text-sm text-navy-500 dark:text-navy-400">
                        {alert.detail}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
