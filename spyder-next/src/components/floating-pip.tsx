"use client";

import { usePip } from "@/providers/pip-provider";
import { motion, useDragControls } from "framer-motion";
import { X, Minimize2, Maximize2 } from "lucide-react";
import Link from "next/link";

export function FloatingPip() {
  const { camera, isMinimized, unpin, toggleMinimize, position, setPosition, size } = usePip();
  const dragControls = useDragControls();

  if (!camera) return null;

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragControls={dragControls}
      dragListener={false}
      onDragEnd={(_, info) => setPosition({ x: info.point.x, y: info.point.y })}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed z-[100] rounded-xl overflow-hidden shadow-2xl border-2 border-primary/50 bg-card"
      style={{
        left: position.x,
        top: position.y,
        width: isMinimized ? 200 : size.width,
        height: isMinimized ? 50 : size.height,
      }}
    >
      {isMinimized ? (
        <div
          className="h-full flex items-center justify-between px-3 cursor-grab active:cursor-grabbing"
          onPointerDown={(e) => dragControls.start(e)}
        >
          <span className="text-sm font-medium truncate text-foreground">{camera.name}</span>
          <div className="flex gap-1">
            <button
              onClick={toggleMinimize}
              className="p-1.5 rounded hover:bg-primary/20 text-primary"
              aria-label="Expand"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
            <button
              onClick={unpin}
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
            className="absolute top-0 left-0 right-0 h-8 flex items-center justify-between px-2 bg-card/90 backdrop-blur cursor-grab active:cursor-grabbing border-b border-border"
            onPointerDown={(e) => dragControls.start(e)}
          >
            <span className="text-xs font-medium truncate text-foreground">{camera.name}</span>
            <div className="flex gap-1">
              <button
                onClick={toggleMinimize}
                className="p-1 rounded hover:bg-primary/20 text-primary"
                aria-label="Minimize"
              >
                <Minimize2 className="h-3.5 w-3.5" />
              </button>
              <Link
                href={`/cam/${camera.id}`}
                className="p-1 rounded hover:bg-primary/20 text-primary"
                aria-label="Full screen"
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </Link>
              <button
                onClick={unpin}
                className="p-1 rounded hover:bg-destructive/20 text-destructive"
                aria-label="Close"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <div className="pt-8 w-full h-[calc(100%-2rem)]">
            <video
              src={camera.videoUrl}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </>
      )}
    </motion.div>
  );
}
