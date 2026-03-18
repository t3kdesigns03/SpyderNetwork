"use client";

import { useEffect, useRef } from "react";

export function WaterRipple() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    const draw = () => {
      if (!ctx || !canvas) return;
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      ctx.clearRect(0, 0, w, h);

      const centerX = w / 2;
      const centerY = h / 2;

      for (let i = 0; i < 6; i++) {
        const radius = 60 + Math.sin(time * 0.0015 + i * 1.5) * 50 + (time * 0.03) % 200;
        const alpha = Math.max(0, 0.06 - radius * 0.00012) * (0.6 + 0.4 * Math.sin(time * 0.0008 + i * 0.7));
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(225, 29, 72, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      time += 16;
      animationId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.35 }}
      aria-hidden
    />
  );
}
