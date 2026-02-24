import type { PlatformId } from "../../types/audit";

interface PlatformIconProps {
  platform: PlatformId;
  size?: number;
}

const platformConfig: Record<
  PlatformId,
  { color: string; letter: string; label: string }
> = {
  google: { color: "#4285F4", letter: "G", label: "Google Ads" },
  meta: { color: "#0081FB", letter: "M", label: "Meta Ads" },
  linkedin: { color: "#0A66C2", letter: "L", label: "LinkedIn Ads" },
  tiktok: { color: "#000000", letter: "T", label: "TikTok Ads" },
  microsoft: { color: "#00A4EF", letter: "M", label: "Microsoft Ads" },
};

export default function PlatformIcon({
  platform,
  size = 32,
}: PlatformIconProps) {
  const config = platformConfig[platform];
  const fontSize = Math.round(size * 0.45);

  return (
    <div
      role="img"
      aria-label={config.label}
      className="inline-flex items-center justify-center rounded-full font-semibold text-white select-none"
      style={{
        width: size,
        height: size,
        backgroundColor: config.color,
        fontSize,
        lineHeight: 1,
      }}
    >
      {config.letter}
    </div>
  );
}
