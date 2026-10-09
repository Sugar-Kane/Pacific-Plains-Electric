"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { HouseStory } from "./powered-house-scene";

const steps = [
  {
    title: "Power arrives at the street",
    body: "It starts at the utility pole. The service drop carries power to the weatherhead on your house.",
    link: null,
  },
  {
    title: "Into the panel",
    body: "Everything runs through your electrical panel. When you add an EV, a heat pump, or a remodel, it needs the capacity to keep up.",
    link: { label: "Panel upgrades", href: "/services/panel-upgrades" },
  },
  {
    title: "Room by room",
    body: "Each circuit feeds a part of the house. When an outlet, switch, or breaker stops working, we trace it back and fix the cause.",
    link: { label: "Electrical repair", href: "/services/electrical-repair" },
  },
  {
    title: "Charging in the driveway",
    body: "A home charger gets its own circuit, sized to your panel and your car.",
    link: { label: "EV charger installation", href: "/services/ev-charger-installation" },
  },
  {
    title: "Lit up, inside and out",
    body: "Fixtures, dimmers, and path and landscape lighting finish the job.",
    link: { label: "Lighting", href: "/services/lighting" },
  },
] as const;

export default function PoweredHouse() {
  const section = useRef<HTMLElement>(null);
  const stepsRef = useRef<HTMLOListElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = section.current;
    const list = stepsRef.current;
    const holder = stage.current;
    const cv = canvas.current;
    if (!el || !list || !holder || !cv) return;

    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let story: HouseStory | null = null;
    let disposed = false;
    let visible = false;
    let frame = 0;
    let target = 0;
    let shown = -1;

    const measure = () => {
      const r = list.getBoundingClientRect();
      // Progress runs from the first step reaching 60% of the viewport to the last step leaving it.
      const p = (innerHeight * 0.6 - r.top) / Math.max(1, r.height - innerHeight * 0.2);
      target = Math.min(1, Math.max(0, p));
      setActive(Math.min(steps.length - 1, Math.floor(target * steps.length)));
    };

    const tick = () => {
      frame = 0;
      if (!story || !visible) return;
      const next = reducedMotion ? target : shown + (target - shown) * 0.14;
      if (Math.abs(target - next) < 0.0008 || shown < 0) {
        shown = target;
      } else {
        shown = next;
        frame = requestAnimationFrame(tick);
      }
      story.setProgress(shown);
    };
    const schedule = () => {
      measure();
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const sizeObserver = new ResizeObserver(() => {
      const { width, height } = holder.getBoundingClientRect();
      story?.resize(Math.round(width), Math.round(height));
      schedule();
    });

    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !story) {
          import("./powered-house-scene")
            .then(({ createHouseStory }) => {
              if (disposed) return;
              story = createHouseStory(cv, { reducedMotion });
              sizeObserver.observe(holder);
            })
            .catch(() => setFailed(true));
        }
        if (visible) schedule();
      },
      { rootMargin: "200px 0px" },
    );
    loadObserver.observe(el);
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    measure();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      loadObserver.disconnect();
      sizeObserver.disconnect();
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      story?.dispose();
    };
  }, []);

  return (
    <section
      ref={section}
      className={failed ? "power-story no-webgl" : "power-story"}
      aria-labelledby="power-story-title"
    >
      <div className="container">
        <div className="power-story-intro">
          <span className="eyebrow">How power reaches your home</span>
          <h2 id="power-story-title">From the pole to the porch light</h2>
          <p className="lede">
            Scroll to follow the power from the street into every part of the
            house, and see where we come in.
          </p>
        </div>
      </div>
      <div className="container power-story-body">
        <div className="power-story-stage" ref={stage}>
          <canvas ref={canvas} aria-hidden="true" />
          <div className="power-meter" aria-hidden="true">
            {steps.map((s, i) => (
              <span key={s.title} className={i <= active ? "on" : ""} />
            ))}
          </div>
        </div>
        <ol className="power-story-steps" ref={stepsRef}>
          {steps.map((s, i) => (
            <li key={s.title} className={i === active ? "active" : ""}>
              <div className="power-step-card">
                <span className="power-step-number">0{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                {s.link && (
                  <Link className="text-link" href={s.link.href}>
                    {s.link.label} <ArrowRight size={17} aria-hidden="true" />
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
