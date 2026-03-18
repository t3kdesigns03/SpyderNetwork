"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import type { Camera } from "@/data/cameras";

const MAX_PIPS = 3;
const DEFAULT_SIZE = { width: 360, height: 203 };
const DEFAULT_POSITION = () =>
  typeof window !== "undefined"
    ? { x: window.innerWidth - 380, y: 80 }
    : { x: 20, y: 80 };

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
      const base = DEFAULT_POSITION();
      const offset = prev.length * 24;
      const newPip: PipInstance = {
        id: `pip-${++pipIdCounter}`,
        camera,
        isMinimized: false,
        position: { x: base.x - offset, y: base.y + offset },
        size: DEFAULT_SIZE,
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
