interface ProgressBarProps {
  value: number;
  color?: string;
  height?: "sm" | "md";
  showLabel?: boolean;
}

const heightClasses: Record<string, string> = {
  sm: "h-1.5",
  md: "h-3",
};

export default function ProgressBar({
  value,
  color,
  height = "md",
  showLabel = false,
}: ProgressBarProps) {
  const clampedValue = Math.max(0, Math.min(100, value));
  const fillColor = color ?? "bg-amber-accent";

  return (
    <div className="flex items-center gap-3">
      <div
        className={[
          "relative flex-1 overflow-hidden rounded-full",
          "bg-navy-200 dark:bg-navy-700",
          heightClasses[height],
        ].join(" ")}
      >
        <div
          className={[
            "absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out",
            fillColor,
          ].join(" ")}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showLabel && (
        <span className="min-w-[3ch] text-right font-mono text-sm text-navy-400 dark:text-navy-300">
          {Math.round(clampedValue)}%
        </span>
      )}
    </div>
  );
}
