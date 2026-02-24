import { useEffect, useRef } from "react";
import type { Grade } from "../../types/audit";
import { getGradeColor, getGradeLabel } from "../../data/scoring";

interface HealthGaugeProps {
  score: number;
  grade: Grade;
  size?: number;
}

// The gauge arc spans 270 degrees: from 135 degrees to 405 degrees (225 to 315 in
// standard positioning, but we use SVG rotation where 0 is at 3 o'clock).
// We rotate the arc so it starts at bottom-left and sweeps clockwise to bottom-right.
const ARC_START_ANGLE = 135; // degrees (bottom-left)
const ARC_SWEEP = 270; // degrees of total arc

export default function HealthGauge({
  score,
  grade,
  size = 200,
}: HealthGaugeProps) {
  const filledRef = useRef<SVGCircleElement>(null);

  const center = size / 2;
  const strokeWidth = size * 0.08;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  // The visible arc is 270/360 of the full circle
  const arcLength = (ARC_SWEEP / 360) * circumference;
  const gapLength = circumference - arcLength;

  // How much of the arc to fill based on score (0-100)
  const clampedScore = Math.max(0, Math.min(100, score));
  const filledLength = (clampedScore / 100) * arcLength;
  const unfilledLength = arcLength - filledLength;

  const gradeColor = getGradeColor(grade);
  const gradeLabel = getGradeLabel(grade);

  // Animate stroke-dashoffset on mount
  useEffect(() => {
    const el = filledRef.current;
    if (!el) return;
    // Start fully hidden, then transition to target
    el.style.transition = "none";
    el.style.strokeDashoffset = `${arcLength}`;

    // Force reflow
    void el.getBoundingClientRect();

    el.style.transition = "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)";
    el.style.strokeDashoffset = `${unfilledLength}`;
  }, [arcLength, unfilledLength]);

  // Tick marks for the gauge (at 0, 25, 50, 75, 100 positions)
  const ticks = [0, 25, 50, 75, 100];
  const tickElements = ticks.map((tick) => {
    const angle = ARC_START_ANGLE + (tick / 100) * ARC_SWEEP;
    const rad = (angle * Math.PI) / 180;
    const innerR = radius - strokeWidth * 0.8;
    const outerR = radius + strokeWidth * 0.8;
    return (
      <line
        key={tick}
        x1={center + innerR * Math.cos(rad)}
        y1={center + innerR * Math.sin(rad)}
        x2={center + outerR * Math.cos(rad)}
        y2={center + outerR * Math.sin(rad)}
        className="stroke-navy-400 dark:stroke-navy-500"
        strokeWidth={tick % 50 === 0 ? 2 : 1}
        strokeLinecap="round"
      />
    );
  });

  return (
    <div
      className="relative inline-flex flex-col items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="drop-shadow-lg"
      >
        {/* Glow filter for the filled arc */}
        <defs>
          <filter id="gauge-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track ring (background arc) */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          className="stroke-navy-200 dark:stroke-navy-700"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${gapLength}`}
          // Rotate so the gap is at the bottom center
          transform={`rotate(${ARC_START_ANGLE} ${center} ${center})`}
        />

        {/* Filled arc */}
        <circle
          ref={filledRef}
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={gradeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${gapLength}`}
          strokeDashoffset={arcLength}
          transform={`rotate(${ARC_START_ANGLE} ${center} ${center})`}
          filter="url(#gauge-glow)"
        />

        {/* Tick marks */}
        {tickElements}
      </svg>

      {/* Center content */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ paddingTop: size * 0.05 }}
      >
        <span
          className="font-mono font-bold leading-none text-navy-900 dark:text-white"
          style={{ fontSize: size * 0.28 }}
        >
          {Math.round(clampedScore)}
        </span>
        <span
          className="mt-1 font-mono font-bold leading-none"
          style={{ fontSize: size * 0.16, color: gradeColor }}
        >
          {grade}
        </span>
        <span
          className="mt-0.5 text-navy-500 dark:text-navy-400"
          style={{ fontSize: size * 0.07 }}
        >
          {gradeLabel}
        </span>
      </div>
    </div>
  );
}
