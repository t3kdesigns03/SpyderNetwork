"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import type { Camera } from "@/data/cameras";

const MAX_PIPS = 3;
const getDefaultSize = () => {
  if (typeof window === "undefined") return { width: 360, height: 203 };
  const isMobile = window.innerWidth < 768;
  const maxW = isMobile ? Math.min(360, window.innerWidth * 0.9) : 360;
  return { width: maxW, height: Math.round(maxW * (9 / 16)) };
};
const DEFAULT_SIZE = { width: 360, height: 203 };
const getDefaultPosition = (index: number) => {
  if (typeof window === "undefined") return { x: 20, y: 80 };
  const isMobile = window.innerWidth < 768;
  const safeTop = 72;
  const gap = isMobile ? 12 : 24;
  const size = getDefaultSize();
  const x = isMobile
    ? (window.innerWidth - size.width) / 2
    : Math.max(16, window.innerWidth - size.width - 24 - index * gap);
  const y = safeTop + index * (size.height + gap);
  return { x, y };
};

export interface PipInstance {
  id: string;
  camera: Camera;
  isMinimized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface PipContextValue {
  pips: PipInstance[];
  pinCamera: (camera: Camera) => void;
  unpin: (id: string) => void;
  unpinAll: () => void;
  toggleMinimize: (id: string) => void;
  setPosition: (id: string, pos: { x: number; y: number }) => void;
  setSize: (id: string, size: { width: number; height: number }) => void;
  bringToFront: (id: string) => void;
  activeVideoRef: React.RefObject<HTMLVideoElement | null>;
  setActiveVideo: (el: HTMLVideoElement | null) => void;
}

const PipContext = createContext<PipContextValue | null>(null);

let pipIdCounter = 0;

export function PipProvider({ children }: { children: React.ReactNode }) {
  const [pips, setPips] = useState<PipInstance[]>([]);
  const activeVideoRef = useRef<HTMLVideoElement | null>(null);
  const setActiveVideo = useCallback((el: HTMLVideoElement | null) => {
    activeVideoRef.current = el;
  }, []);

  const pinCamera = useCallback((camera: Camera) => {
    setPips((prev) => {
      const existing = prev.find((p) => p.camera.id === camera.id);
      if (existing) {
        return prev.map((p) =>
          p.id === existing.id ? { ...p, isMinimized: false } : p
        );
      }
      const size = getDefaultSize();
      const pos = getDefaultPosition(prev.length);
      const newPip: PipInstance = {
        id: `pip-${++pipIdCounter}`,
        camera,
        isMinimized: false,
        position: pos,
        size,
      };
      const next = [...prev, newPip];
      if (next.length > MAX_PIPS) {
        return [...next.slice(-MAX_PIPS)];
      }
      return next;
    });
  }, []);

  const unpin = useCallback((id: string) => {
    setPips((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const unpinAll = useCallback(() => setPips([]), []);

  const toggleMinimize = useCallback((id: string) => {
    setPips((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isMinimized: !p.isMinimized } : p))
    );
  }, []);

  const setPosition = useCallback((id: string, position: { x: number; y: number }) => {
    setPips((prev) =>
      prev.map((p) => (p.id === id ? { ...p, position } : p))
    );
  }, []);

  const setSize = useCallback((id: string, size: { width: number; height: number }) => {
    setPips((prev) =>
      prev.map((p) => (p.id === id ? { ...p, size } : p))
    );
  }, []);

  const bringToFront = useCallback((id: string) => {
    setPips((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (idx === -1 || idx === prev.length - 1) return prev;
      const arr = [...prev];
      const [item] = arr.splice(idx, 1);
      arr.push(item);
      return arr;
    });
  }, []);

  return (
    <PipContext.Provider
      value={{
        pips,
        pinCamera,
        unpin,
        unpinAll,
        toggleMinimize,
        setPosition,
        setSize,
        bringToFront,
        activeVideoRef,
        setActiveVideo,
      }}
    >
      {children}
    </PipContext.Provider>
  );
}

export function usePip() {
  const ctx = useContext(PipContext);
  if (!ctx) throw new Error("usePip must be used within PipProvider");
  return ctx;
}
