import type { CheckStatus } from "../../types/audit";

interface BadgeProps {
  status: CheckStatus;
  size?: "sm" | "md";
}

const statusStyles: Record<
  CheckStatus,
  { bg: string; text: string; label: string }
> = {
  PASS: {
    bg: "bg-score-pass",
    text: "text-white",
    label: "PASS",
  },
  WARNING: {
    bg: "bg-score-warning",
    text: "text-navy-900",
    label: "WARNING",
  },
  FAIL: {
    bg: "bg-score-fail",
    text: "text-white",
    label: "FAIL",
  },
  "N/A": {
    bg: "bg-score-na/20 dark:bg-score-na/30",
    text: "text-score-na",
    label: "N/A",
  },
};

const sizeClasses: Record<string, string> = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-1 text-xs",
};

export default function Badge({ status, size = "md" }: BadgeProps) {
  const style = statusStyles[status];

  return (
    <span
      className={[
        "inline-flex items-center rounded-full font-mono font-semibold uppercase leading-none",
        style.bg,
        style.text,
        sizeClasses[size],
      ].join(" ")}
    >
      {style.label}
    </span>
  );
}
