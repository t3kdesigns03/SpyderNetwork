"use client";

/**
 * /hls-demo — THROWAWAY dev harness for the standalone HlsPlayer.
 * ─────────────────────────────────────────────────────────────────────────────
 * Not linked from anywhere in the app and safe to delete. Use it to preview the
 * player and to test-drive HLS URLs (paste a Bunny .m3u8 here once you have one)
 * without touching anything live. Nothing here affects the Twitch CamEmbed flow.
 */

import { useState } from "react";
import { HlsPlayer } from "@/components/HlsPlayer";

// A few reliable public HLS test streams for development.
const PRESETS: { label: string; src: string }[] = [
  { label: "Mux · Big Buck Bunny", src: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" },
  { label: "Unified · Tears of Steel", src: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8" },
  { label: "Apple · Basic HLS", src: "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8" },
];

export default function HlsDemoPage() {
  const [src, setSrc] = useState(PRESETS[0].src);
  const [input, setInput] = useState(PRESETS[0].src);

  return (
    <div className="min-h-[calc(100dvh-56px)] bg-spyder-navy px-4 py-8 text-white sm:px-6">
      <div className="mx-auto w-full max-w-4xl">

        {/* Dev banner */}
        <div className="mb-5 flex items-center gap-2 rounded-lg border border-spyder-red/30 bg-spyder-red/10 px-3 py-2 text-xs text-spyder-red">
          <span className="font-bold uppercase tracking-widest">Dev only</span>
          <span className="text-white/60">Throwaway harness for HlsPlayer — not linked anywhere, safe to delete.</span>
        </div>

        <h1 className="font-display text-xl font-bold tracking-wide">HLS Player — test harness</h1>
        <p className="mt-1 text-sm text-spyder-gray">
          Paste an HLS <code className="text-spyder-cyan">.m3u8</code> URL, or pick a preset. Swap in a Bunny URL when ready.
        </p>

        {/* URL input */}
        <form
          onSubmit={(e) => { e.preventDefault(); setSrc(input.trim()); }}
          className="mt-4 flex flex-col gap-2 sm:flex-row"
        >
          <input
            type="url"
            inputMode="url"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="https://…/stream.m3u8"
            aria-label="HLS stream URL"
            className="min-h-[44px] flex-1 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-spyder-gray/50 focus:border-spyder-red/50 focus:outline-none"
          />
          <button
            type="submit"
            className="min-h-[44px] rounded-lg bg-spyder-red px-5 text-sm font-semibold text-white transition-colors hover:bg-spyder-red-bright active:scale-95"
          >
            Load stream
          </button>
        </form>

        {/* Presets */}
        <div className="mt-3 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.src}
              type="button"
              onClick={() => { setInput(p.src); setSrc(p.src); }}
              className={
                "rounded-full border px-3 py-1.5 text-xs transition-all " +
                (src === p.src
                  ? "border-spyder-cyan/50 bg-spyder-cyan/10 text-spyder-cyan"
                  : "border-white/10 bg-white/5 text-spyder-gray hover:text-white")
              }
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Player — the parent sizes it; the player fills the box */}
        <div className="mt-6 overflow-hidden rounded-xl border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.6)]">
          <div className="aspect-video w-full">
            {/* key=src forces a clean remount when the URL changes */}
            <HlsPlayer key={src} src={src} autoPlay muted />
          </div>
        </div>

        <p className="mt-4 text-xs text-spyder-gray">
          Tip: on desktop the branded overlay auto-fades and playback begins muted; click it to play with sound.
          On a phone the video stays clean until you tap it, then a centered Play button appears.
        </p>
      </div>
    </div>
  );
}
