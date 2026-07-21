import { useEffect, useRef } from "react";

/**
 * useViewerHeartbeat — silent viewer signal.
 * ─────────────────────────────────────────────────────────────────────────────
 * Reports "this tab is currently watching {camId}" to POST /api/viewer-heartbeat
 * so the backend can tally active viewers per camera. There is NO UI — this only
 * fires network requests.
 *
 * Behaviour:
 *   • A stable sessionId is generated once per browser tab (persisted in
 *     sessionStorage so it survives in-tab soft navigations).
 *   • Sends a heartbeat immediately whenever camId changes, then every 20s.
 *   • Only sends while the tab is visible; pauses when hidden and resumes (with
 *     an immediate beat) when the tab is shown again.
 *   • Stops entirely when there's no active cam (camId null/undefined).
 */

const HEARTBEAT_MS = 20_000;
const SID_KEY = "spyder:sid";

function randomId(): string {
  const raw =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `s${Date.now()}${Math.random().toString(36).slice(2)}`;
  // Backend only accepts [A-Za-z0-9_-]; strip anything else (keeps uuid dashes).
  return raw.replace(/[^A-Za-z0-9_-]/g, "");
}

function getSessionId(): string {
  try {
    let id = sessionStorage.getItem(SID_KEY);
    if (!id) {
      id = randomId();
      sessionStorage.setItem(SID_KEY, id);
    }
    return id;
  } catch {
    // Private mode / storage blocked — fall back to an in-memory id.
    return randomId();
  }
}

export function useViewerHeartbeat(camId: string | null | undefined) {
  const sidRef = useRef<string | null>(null);

  useEffect(() => {
    if (!camId) return;
    if (!sidRef.current) sidRef.current = getSessionId();

    const send = () => {
      if (document.visibilityState !== "visible") return;
      fetch("/api/viewer-heartbeat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ camId, sessionId: sidRef.current }),
        keepalive: true,
      }).catch(() => {
        /* fire-and-forget — a dropped beat just means one skipped tally */
      });
    };

    send(); // immediate beat on cam change / mount
    const timer = setInterval(send, HEARTBEAT_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") send();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [camId]);
}
