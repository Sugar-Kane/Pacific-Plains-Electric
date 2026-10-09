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
    const section = el?.closest("section");
    if (!list || !el || !section) return;
    const root = document.documentElement;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stacked = matchMedia("(max-width: 700px)");
    let frame = 0;
    let target = 0;
    let shown = Number.NaN;
    let lastActive = -1;

    /**
     * Continuous step position: 2 means card 3 sits on the focus line.
     * The focus line is the middle of the space the cards scroll through:
     * the viewport on desktop, the area below the pinned photo on phones.
     */
    const measure = () => {
      const top = stacked.matches ? el.getBoundingClientRect().bottom : 0;
      const focus = (top + innerHeight) / 2;
      const centers = Array.from(list.children, (li) => {
        const r = li.firstElementChild!.getBoundingClientRect();
        return r.top + r.height / 2;
      });
      const n = centers.length;
      const gap = Math.max(1, centers[1] - centers[0]);
      let pos: number;
      if (focus <= centers[0]) pos = (focus - centers[0]) / gap;
      else if (focus >= centers[n - 1]) pos = n - 1 + (focus - centers[n - 1]) / gap;
      else {
        const i = centers.findIndex((c, k) => focus >= c && focus < centers[k + 1]);
        pos = i + (focus - centers[i]) / Math.max(1, centers[i + 1] - centers[i]);
      }
      target = pos;
      const s = section.getBoundingClientRect();
      // Phones: tuck the fixed action bar away while the story fills the screen.
      root.classList.toggle("story-in-view", s.top < innerHeight * 0.4 && s.bottom > innerHeight * 0.8);
    };

    const paint = (pos: number) => {
      // Each light group finishes coming on as its card reaches the focus line.
      steps.forEach((_, i) => {
        el.style.setProperty(`--light-${i}`, String(Math.min(1, Math.max(0, pos - i + 1))));
      });
      const a = Math.min(steps.length - 1, Math.max(0, Math.round(pos)));
      if (a !== lastActive) setActive((lastActive = a));
    };

    const tick = () => {
      frame = 0;
      measure();
      const next =
        reducedMotion || Number.isNaN(shown) ? target : shown + (target - shown) * 0.2;
      shown = Math.abs(target - next) < 0.002 ? target : next;
      paint(shown);
      if (shown !== target) frame = requestAnimationFrame(tick);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    schedule();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    stacked.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      stacked.removeEventListener("change", schedule);
      root.classList.remove("story-in-view");
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
            <span className="credit-long">
              Stock photo (CC0), not a Pacific Plains Electric project
            </span>
            <span className="credit-short">Stock photo, not our project</span>
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
