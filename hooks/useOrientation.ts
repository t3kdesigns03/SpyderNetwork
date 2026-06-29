"use client";
import { useState, useEffect } from "react";

/**
 * Returns true when the user is on a touch-primary mobile device AND in landscape.
 *
 * Triple-guards against false positives on desktop:
 *   1. matchMedia("orientation: landscape")  — primary signal
 *   2. matchMedia("pointer: coarse")         — touch-primary device
 *   3. window.innerHeight < 600              — phone-height (not tablet/desktop)
 *
 * Listens to all three change surfaces so it fires reliably on every device:
 *   - matchMedia "change" (Chrome, Firefox, Safari)
 *   - window "orientationchange" (legacy iOS / Android)
 *   - window "resize" (split-screen, folded phones, browser chrome toggle)
 */
export function useIsLandscapeMobile(): boolean {
  const [value, setValue] = useState(false);

  useEffect(() => {
    const landscapeMQ = window.matchMedia("(orientation: landscape)");
    const touchMQ     = window.matchMedia("(pointer: coarse)");

    function check() {
      // innerHeight < 600 catches phones in landscape (280–430 px) but not
      // tablets in landscape (768 px+) or any desktop window height.
      const mobileHeight = window.innerHeight < 600;
      setValue(landscapeMQ.matches && touchMQ.matches && mobileHeight);
    }

    check(); // synchronous initial read — no flash on first render

    landscapeMQ.addEventListener("change", check);
    touchMQ.addEventListener("change", check);
    window.addEventListener("orientationchange", check);
    window.addEventListener("resize", check, { passive: true });

    return () => {
      landscapeMQ.removeEventListener("change", check);
      touchMQ.removeEventListener("change", check);
      window.removeEventListener("orientationchange", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return value;
}
