"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { usePip } from "@/providers/pip-provider";
import { motion, useDragControls, AnimatePresence } from "framer-motion";
import { X, Minimize2, Maximize2, GripVertical } from "lucide-react";
import Link from "next/link";

const MIN_WIDTH = 240;
const MIN_HEIGHT = 135;
const MIN_DOCK_WIDTH = 160;
const MIN_DOCK_HEIGHT = 44;
const MOBILE_BREAKPOINT = 768;

function PipWindow({
  pip,
  zIndex,
}: {
  pip: import("@/providers/pip-provider").PipInstance;
  zIndex: number;
}) {
  const {
    unpin,
    toggleMinimize,
    setPosition,
    setSize,
    bringToFront,
    setActiveVideo,
  } = usePip();
  const dragControls = useDragControls();
  const videoRef = useRef<HTMLVideoElement>(null);
  const isResizing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const startSize = useRef({ w: 0, h: 0 });

  const handleResizeStart = useCallback(
    (e: React.MouseEvent, corner: "se" | "sw" | "ne" | "nw") => {
      e.preventDefault();
      e.stopPropagation();
      isResizing.current = true;
      startPos.current = { x: e.clientX, y: e.clientY };
      startSize.current = { w: pip.size.width, h: pip.size.height };
      bringToFront(pip.id);

      const onMove = (ev: MouseEvent) => {
        if (!isResizing.current) return;
        const dx = ev.clientX - startPos.current.x;
        const dy = ev.clientY - startPos.current.y;
        let w = startSize.current.w;
        let h = startSize.current.h;
        if (corner.includes("e")) w += dx;
        else if (corner.includes("w")) w -= dx;
        if (corner.includes("s")) h += dy;
        else if (corner.includes("n")) h -= dy;
        w = Math.max(MIN_WIDTH, Math.min(600, w));
        h = Math.max(MIN_HEIGHT, Math.min(400, h));
        setSize(pip.id, { width: w, height: h });
      };
      const onUp = () => {
        isResizing.current = false;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [pip.id, pip.size, setSize, bringToFront]
  );


  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleDragEnd = useCallback(
    (_: unknown, info: { point: { x: number; y: number } }) => {
      const { x, y } = info.point;
      const vw = typeof window !== "undefined" ? window.innerWidth : 1920;
      const vh = typeof window !== "undefined" ? window.innerHeight : 1080;
      const maxW = isMobile ? vw * 0.9 : 600;
      const w = pip.isMinimized
        ? Math.min(MIN_DOCK_WIDTH, vw * 0.9)
        : Math.min(pip.size.width, maxW);
      const h = pip.isMinimized ? MIN_DOCK_HEIGHT : pip.size.height;
      const nx = Math.max(8, Math.min(vw - w - 8, x));
      const ny = Math.max(8, Math.min(vh - h - 8, y));
      setPosition(pip.id, { x: nx, y: ny });
    },
    [pip.id, pip.isMinimized, pip.size, setPosition, isMobile]
  );

  const w = pip.isMinimized ? MIN_DOCK_WIDTH : pip.size.width;
  const h = pip.isMinimized ? MIN_DOCK_HEIGHT : pip.size.height;
  const pipStyle = {
    left: pip.position.x,
    top: pip.position.y,
    width: w,
    height: h,
    zIndex,
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragControls={dragControls}
      dragListener={false}
      dragElastic={0}
      onDragEnd={handleDragEnd}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      onClick={() => {
        bringToFront(pip.id);
        if (!pip.isMinimized) setActiveVideo(videoRef.current);
      }}
      className="fixed rounded-xl overflow-hidden cursor-grab active:cursor-grabbing bg-card/90 backdrop-blur-xl border-2 shadow-[0_0_20px_rgba(255,23,68,0.2),0_0_40px_rgba(255,23,68,0.1)] border-[#ff1744]/60 hover:border-[#ff1744] max-w-[90vw] md:max-w-none"
      style={pipStyle}
    >
      {pip.isMinimized ? (
        <div
          className="h-full flex items-center justify-between px-3 cursor-grab active:cursor-grabbing bg-black/60 backdrop-blur-sm"
          style={{ boxShadow: "inset 0 0 20px rgba(255,23,68,0.15), 0 0 15px rgba(255,23,68,0.3)" }}
          onPointerDown={(e) => {
            bringToFront(pip.id);
            dragControls.start(e);
          }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="live-pulse h-2 w-2 rounded-full bg-[#ff1744] shrink-0" />
            <span className="text-sm font-medium truncate text-foreground">{pip.camera.name}</span>
          </div>
          <div className="flex gap-0.5 shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMinimize(pip.id);
              }}
              className="p-1.5 rounded hover:bg-[#ff1744]/20 text-[#ff1744]"
              aria-label="Expand"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                unpin(pip.id);
              }}
              className="p-1.5 rounded hover:bg-destructive/20 text-destructive"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <>
          <div
            className="absolute top-0 left-0 right-0 h-9 flex items-center justify-between px-2 bg-black/40 backdrop-blur cursor-grab active:cursor-grabbing border-b border-[#ff1744]/30 z-10"
            onPointerDown={(e) => {
              bringToFront(pip.id);
              dragControls.start(e);
            }}
          >
            <div className="flex items-center gap-2 min-w-0">
              <GripVertical className="h-4 w-4 text-[#ff1744]/70 shrink-0" />
              <span className="text-xs font-medium truncate text-foreground">{pip.camera.name}</span>
              <span className="live-pulse h-1.5 w-1.5 rounded-full bg-[#ff1744] shrink-0" />
            </div>
            <div className="flex gap-0.5 shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMinimize(pip.id);
                }}
                className="p-1.5 rounded hover:bg-[#ff1744]/20 text-[#ff1744]"
                aria-label="Minimize"
              >
                <Minimize2 className="h-3.5 w-3.5" />
              </button>
              <Link
                href={`/cam/${pip.camera.id}`}
                className="p-1.5 rounded hover:bg-[#ff1744]/20 text-[#ff1744]"
                aria-label="Full screen"
                onClick={(e) => e.stopPropagation()}
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </Link>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  unpin(pip.id);
                }}
                className="p-1.5 rounded hover:bg-destructive/20 text-destructive"
                aria-label="Close"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <div className="pt-9 w-full h-[calc(100%-2.25rem)] relative">
            <video
              ref={videoRef}
              src={pip.camera.videoUrl}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
            {/* Resize handles - corners (hidden on mobile) */}
            {!isMobile && (
              <>
                <div
                  className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
                  onMouseDown={(e) => handleResizeStart(e, "se")}
                  style={{ background: "linear-gradient(135deg, transparent 50%, rgba(255,23,68,0.3) 50%)" }}
                />
                <div
                  className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize"
                  onMouseDown={(e) => handleResizeStart(e, "sw")}
                  style={{ background: "linear-gradient(225deg, transparent 50%, rgba(255,23,68,0.3) 50%)" }}
                />
                <div
                  className="absolute top-9 right-0 w-4 h-4 cursor-ne-resize"
                  onMouseDown={(e) => handleResizeStart(e, "ne")}
                  style={{ background: "linear-gradient(315deg, transparent 50%, rgba(255,23,68,0.3) 50%)" }}
                />
                <div
                  className="absolute top-9 left-0 w-4 h-4 cursor-nw-resize"
                  onMouseDown={(e) => handleResizeStart(e, "nw")}
                  style={{ background: "linear-gradient(45deg, transparent 50%, rgba(255,23,68,0.3) 50%)" }}
                />
              </>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}

export function FloatingPip() {
  const { pips, activeVideoRef } = usePip();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code !== "Space" || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const video = activeVideoRef.current;
      if (!video) return;
      e.preventDefault();
      if (video.paused) video.play();
      else video.pause();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeVideoRef]);

  if (pips.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <div className="pointer-events-auto">
        <AnimatePresence>
          {pips.map((pip, i) => (
            <PipWindow key={pip.id} pip={pip} zIndex={50 + i} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
