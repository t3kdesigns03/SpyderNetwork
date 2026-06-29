import { clsx } from "clsx";
import type { SponsorTier } from "@/types";

interface Props {
  tier: SponsorTier;
  className?: string;
  /** "sm" = default pill for cam rows; "md" = slightly larger for partner cards */
  size?: "sm" | "md";
}

/**
 * Subtle, tasteful tier badge.
 * "basic" shows nothing — broadcasters are listed naturally without a label.
 * "featured" → small cyan pill  (★ Featured)
 * "premium"  → small purple pill (◆ Premium)
 */
export function SponsorBadge({ tier, className, size = "sm" }: Props) {
  if (tier === "basic") return null;

  const base = clsx(
    "inline-flex items-center gap-0.5 font-bold uppercase tracking-wider rounded shrink-0",
    size === "sm" ? "text-[8px] px-1 py-[1px]" : "text-[10px] px-1.5 py-0.5"
  );

  if (tier === "featured") {
    return (
      <span
        className={clsx(base, "text-spyder-cyan border border-spyder-cyan/30", className)}
        style={{ background: "rgba(0,212,255,0.08)" }}
        title="Featured Partner"
      >
        ★ Featured
      </span>
    );
  }

  return (
    <span
      className={clsx(base, "text-spyder-purple border border-spyder-purple/30", className)}
      style={{ background: "rgba(168,85,247,0.08)" }}
      title="Premium Broadcaster"
    >
      ◆ Premium
    </span>
  );
}
