"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { Camera } from "@/data/cameras";

interface PipState {
  camera: Camera | null;
  isMinimized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface PipContextValue extends PipState {
  pinCamera: (camera: Camera) => void;
  unpin: () => void;
  toggleMinimize: () => void;
  setPosition: (pos: { x: number; y: number }) => void;
  setSize: (size: { width: number; height: number }) => void;
}

const PipContext = createContext<PipContextValue | null>(null);

export function PipProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PipState>({
    camera: null,
    isMinimized: false,
    position: { x: typeof window !== "undefined" ? window.innerWidth - 380 : 20, y: 80 },
    size: { width: 360, height: 203 },
  });

  const pinCamera = useCallback((camera: Camera) => {
    setState((s) => ({ ...s, camera, isMinimized: false }));
  }, []);

  const unpin = useCallback(() => {
    setState((s) => ({ ...s, camera: null }));
  }, []);

  const toggleMinimize = useCallback(() => {
    setState((s) => ({ ...s, isMinimized: !s.isMinimized }));
  }, []);

  const setPosition = useCallback((position: { x: number; y: number }) => {
    setState((s) => ({ ...s, position }));
  }, []);

  const setSize = useCallback((size: { width: number; height: number }) => {
    setState((s) => ({ ...s, size }));
  }, []);

  return (
    <PipContext.Provider
      value={{
        ...state,
        pinCamera,
        unpin,
        toggleMinimize,
        setPosition,
        setSize,
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
