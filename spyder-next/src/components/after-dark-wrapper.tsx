"use client";

import { useTheme } from "@/providers/theme-provider";
import { FireflyParticles } from "@/components/firefly-particles";

export function AfterDarkWrapper() {
  const { mode } = useTheme();
  return mode === "after-dark" ? <FireflyParticles /> : null;
}
