"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * A real night photo of a house that lights up as you scroll.
 * Images are built by scripts/build-house-story.mjs: one lights-off frame plus
 * one mask per light group. Each step fades the original photo back in
 * through its group's mask, in order.
 */
const steps = [
  {
    light: "sconces",
    title: "Power comes on",
    body: "Every light in a home starts at the electrical panel. If the panel is out of capacity or showing its age, everything downstream feels it.",
    link: { label: "Panel upgrades", href: "/services/panel-upgrades" },
  },
  {
    light: "upstairs",
    title: "Room by room",
    body: "Each room runs on its own circuits. When an outlet, switch, or breaker stops working, we trace it back and fix the cause.",
    link: { label: "Electrical repair", href: "/services/electrical-repair" },
  },
  {
    light: "downstairs",
    title: "Kitchens, offices, and garages",
    body: "Heavy loads like ovens, workshops, and EV chargers need their own properly sized circuits.",
    link: { label: "EV charger installation", href: "/services/ev-charger-installation" },
  },
  {
    light: "facade",
    title: "Outside, too",
    body: "Exterior fixtures, path lights, and landscape lighting make a home safer and easier to use after dark.",
    link: { label: "Lighting", href: "/services/lighting" },
  },
  {
    light: "pool",
    title: "Lit up, inside and out",
    body: "Tell us what you have in mind and we’ll take it from there.",
    link: { label: "Request service", href: "/request-service" },
  },
] as const;

const PHOTO = "/images/story/house-on.webp";
const PHOTO_OFF = "/images/story/house-off.webp";

export default function PoweredHouse() {
  const stepsRef = useRef<HTMLOListElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const list = stepsRef.current;
    const el = stage.current;
    if (!list || !el) return;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let target = 0;
    let shown = -1;

    const paint = (p: number) => {
      // Each light group fades in over the first 60% of its step.
      steps.forEach((_, i) => {
        const t = (p * steps.length - i) / 0.6;
        el.style.setProperty(`--light-${i}`, String(Math.min(1, Math.max(0, t))));
      });
    };
    const tick = () => {
      frame = 0;
      const next = reducedMotion || shown < 0 ? target : shown + (target - shown) * 0.18;
      shown = Math.abs(target - next) < 0.001 ? target : next;
      paint(shown);
      if (shown !== target) frame = requestAnimationFrame(tick);
    };
    const update = () => {
      const r = list.getBoundingClientRect();
      // 0 when the first step reaches 60% of the viewport, 1 as the last one leaves.
      const p = (innerHeight * 0.6 - r.top) / Math.max(1, r.height - innerHeight * 0.2);
      target = Math.min(1, Math.max(0, p));
      setActive(Math.min(steps.length - 1, Math.floor(target * steps.length)));
      if (!frame) frame = requestAnimationFrame(tick);
    };

    update();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", update);
      removeEventListener("resize", update);
    };
  }, []);

  return (
    <section className="power-story" aria-labelledby="power-story-title">
      <div className="container">
        <div className="power-story-intro">
          <span className="eyebrow">How power reaches your home</span>
          <h2 id="power-story-title">From the panel to the porch light</h2>
          <p className="lede">
            Scroll to watch a home come on, one circuit at a time, and see
            where an electrician comes in.
          </p>
        </div>
      </div>
      <div className="container power-story-body">
        <figure className="power-story-stage" ref={stage}>
          <div className="house-photo" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element -- masked layers need plain, identically sized images */}
            <img src={PHOTO_OFF} alt="" width={1024} height={685} loading="lazy" decoding="async" />
            {steps.map((s, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={s.light}
                src={PHOTO}
                alt=""
                width={1024}
                height={685}
                loading="lazy"
                decoding="async"
                className="house-light"
                style={{
                  maskImage: `url(/images/story/mask-${s.light}.png)`,
                  WebkitMaskImage: `url(/images/story/mask-${s.light}.png)`,
                  opacity: `var(--light-${i}, 1)`,
                }}
              />
            ))}
          </div>
          <div className="power-meter" aria-hidden="true">
            {steps.map((s, i) => (
              <span key={s.light} className={i <= active ? "on" : ""} />
            ))}
          </div>
          <figcaption className="photo-credit">
            Stock photo (CC0), not a Pacific Plains Electric project
          </figcaption>
        </figure>
        <ol className="power-story-steps" ref={stepsRef}>
          {steps.map((s, i) => (
            <li key={s.light} className={i === active ? "active" : ""}>
              <div className="power-step-card">
                <span className="power-step-number">0{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <Link className="text-link" href={s.link.href}>
                  {s.link.label} <ArrowRight size={17} aria-hidden="true" />
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
