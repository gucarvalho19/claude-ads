import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from "recharts";
import type { BenchmarkMetric } from "../../types/audit";

interface BenchmarkRadarProps {
  benchmarks: BenchmarkMetric[];
}

interface RadarDataEntry {
  metric: string;
  actual: number;
  benchmark: number;
}

interface CustomTooltipPayloadEntry {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: CustomTooltipPayloadEntry[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-lg border border-navy-200 bg-white px-3 py-2 shadow-lg dark:border-navy-700 dark:bg-navy-800">
      <p className="mb-1 text-xs font-semibold text-navy-900 dark:text-white">
        {label}
      </p>
      {payload.map((entry) => (
        <p
          key={entry.name}
          className="text-xs"
          style={{ color: entry.color }}
        >
          {entry.name}: {Math.round(entry.value)}%
        </p>
      ))}
    </div>
  );
}

export default function BenchmarkRadar({ benchmarks }: BenchmarkRadarProps) {
  // Normalize values to a 0-100 scale: (actual / benchmark) * 100, capped at 120
  const data: RadarDataEntry[] = benchmarks.map((b) => ({
    metric: b.metric,
    actual: Math.min((b.actual / b.benchmark) * 100, 120),
    benchmark: 100,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
        <PolarGrid
          stroke="var(--color-navy-300)"
          strokeOpacity={0.3}
        />
        <PolarAngleAxis
          dataKey="metric"
          tick={{
            fontSize: 11,
            fill: "var(--color-navy-500)",
          }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 120]}
          tick={{
            fontSize: 10,
            fill: "var(--color-navy-400)",
          }}
          tickCount={5}
        />
        <Radar
          name="Industry Benchmark"
          dataKey="benchmark"
          stroke="var(--color-navy-400)"
          fill="var(--color-navy-400)"
          fillOpacity={0.15}
          strokeWidth={2}
        />
        <Radar
          name="Your Performance"
          dataKey="actual"
          stroke="#ed8936"
          fill="#ed8936"
          fillOpacity={0.25}
          strokeWidth={2}
        />
        <Legend
          verticalAlign="bottom"
          iconType="circle"
          iconSize={8}
          formatter={(value: string) => (
            <span className="text-xs text-navy-600 dark:text-navy-300">
              {value}
            </span>
          )}
        />
        <Tooltip content={<CustomTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
