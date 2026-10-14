"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export default function ServiceMotionGroup({ children, spanish = false }: { children: ReactNode; spanish?: boolean }) {
  const [paused, setPaused] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const visibility = () => { element.dataset.motionHidden = String(document.hidden); };
    visibility();
    document.addEventListener("visibilitychange", visibility);
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) (entry.target as HTMLElement).dataset.offscreen = String(!entry.isIntersecting);
    }, { rootMargin: "100px" });
    element.querySelectorAll(".service-animation").forEach((scene) => observer.observe(scene));
    return () => { document.removeEventListener("visibilitychange", visibility); observer.disconnect(); };
  }, []);
  return <div ref={root} className="service-motion-group" data-motion-paused={paused}>
    <div className="service-motion-controls">
      <button type="button" className="service-motion-toggle" aria-pressed={paused} onClick={() => setPaused((value) => !value)}>
        {spanish ? (paused ? "Reanudar animaciones" : "Pausar animaciones") : (paused ? "Resume animations" : "Pause animations")}
      </button>
      <span className="service-motion-reduced">{spanish ? "Movimiento reducido activado" : "Reduced motion enabled"}</span>
    </div>
    {children}
  </div>;
}
