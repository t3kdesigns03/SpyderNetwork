"use client";

import { useTheme } from "@/providers/theme-provider";
import { FloatingSpiderParticles } from "@/components/floating-spider-particles";

export function AfterDarkWrapper() {
  const { mode } = useTheme();
  return mode === "after-dark" ? <FloatingSpiderParticles /> : null;
}
