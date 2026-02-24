import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import type { BudgetAllocation, PlatformId } from "../../types/audit";
import { PLATFORM_NAMES } from "../../types/audit";

interface AllocationPieProps {
  allocations: BudgetAllocation[];
  type: "current" | "recommended";
  title: string;
}

const PLATFORM_COLORS: Record<PlatformId, string> = {
  google: "#4285F4",
  meta: "#0081FB",
  linkedin: "#0A66C2",
  tiktok: "#000000",
  microsoft: "#00A4EF",
};

interface PieDataEntry {
  name: string;
  value: number;
  spend: number;
  color: string;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

interface CustomLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  value: number;
}

function renderCustomLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  value,
}: CustomLabelProps) {
  if (value < 5) return null;

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-xs font-semibold"
    >
      {`${Math.round(value)}%`}
    </text>
  );
}

interface CustomTooltipPayloadEntry {
  name: string;
  value: number;
  payload: PieDataEntry;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: CustomTooltipPayloadEntry[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0];
  return (
    <div className="rounded-lg border border-navy-200 bg-white px-3 py-2 shadow-lg dark:border-navy-700 dark:bg-navy-800">
      <p className="text-sm font-semibold text-navy-900 dark:text-white">
        {data.name}
      </p>
      <p className="text-xs text-navy-500 dark:text-navy-400">
        {data.value}% &middot; {formatCurrency(data.payload.spend)}
      </p>
    </div>
  );
}

export default function AllocationPie({
  allocations,
  type,
  title,
}: AllocationPieProps) {
  const data: PieDataEntry[] = allocations.map((a) => ({
    name: PLATFORM_NAMES[a.platform],
    value: type === "current" ? a.currentPercent : a.recommendedPercent,
    spend: type === "current" ? a.monthlySpend : a.recommendedSpend,
    color: PLATFORM_COLORS[a.platform],
  }));

  return (
    <div className="flex flex-col items-center">
      <h3 className="mb-4 text-sm font-semibold text-navy-700 dark:text-navy-200">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="85%"
            paddingAngle={2}
            dataKey="value"
            label={renderCustomLabel}
            labelLine={false}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} strokeWidth={0} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
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
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
