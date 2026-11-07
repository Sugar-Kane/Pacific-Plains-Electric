import type { CSSProperties } from "react";
import media from "./service-media.json";

/**
 * Home-page service visuals: photographic layers with restrained, physically
 * plausible motion. Assets and the layer positions in service-media.json are
 * produced by scripts/build-service-media.mjs from the photos in
 * assets/service-photos/. All motion is CSS (app/service-animations.css), so
 * the Pause control, off-screen and hidden-page pausing, and reduced motion
 * all work through animation-play-state and media queries.
 */
const BASE = "/images/services";
type Box = { left: number; top: number; width: number; height?: number };
const place = (b: Box): CSSProperties => ({
  left: `${b.left}%`,
  top: `${b.top}%`,
  width: `${b.width}%`,
  ...(b.height ? { height: `${b.height}%` } : {}),
});
// Source photos are 1448x1086; percentages below are of that frame.
const FRAME = { width: 1448, height: 1086 };

function Layer({ src, className, style }: { src: string; className: string; style?: CSSProperties }) {
  // Decorative layers: the card's heading and text carry the meaning.
  // eslint-disable-next-line @next/next/no-img-element -- stacked, registered layers must not be re-cropped or re-sized by the image optimiser
  return <img className={className} src={src} alt="" style={style} loading="lazy" decoding="async" draggable={false} />;
}

function Plate({ card }: { card: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- see Layer
  return <img className="sa-plate" src={`${BASE}/${card}/plate.webp`} alt="" width={960} height={720} loading="lazy" decoding="async" draggable={false} />;
}

export default function ServiceAnimation({ service }: { service: string; spanish?: boolean }) {
  const scene = scenes[service];
  if (!scene) return null;
  return (
    <span className={`service-animation sa-${service}`} aria-hidden="true">
      {scene()}
    </span>
  );
}

const scenes: Record<string, () => React.ReactNode> = {
  "electrical-repair": () => {
    const m = media["electrical-repair"];
    return (
      <>
        <Plate card="electrical-repair" />
        {/* The tip's red LED reflecting on the receptacle face. */}
        <span className="sa-repair-glow" style={{ left: `${(847 / FRAME.width) * 100}%`, top: `${(357 / FRAME.height) * 100}%` }} />
        <span className="sa-frame sa-repair-tool">
          <Layer className="sa-layer" src={`${BASE}/electrical-repair/tester.webp`} style={place(m.tester)} />
          <Layer className="sa-layer sa-repair-led" src={`${BASE}/electrical-repair/tester-lit.webp`} style={place(m.testerLit)} />
        </span>
      </>
    );
  },
  "panel-upgrades": () => {
    const m = media["panel-upgrades"];
    const style = { "--sa-perspective": m.perspective, "--sa-origin": m.origin, "--sa-open": `${m.openAngle}deg` } as CSSProperties;
    return (
      <>
        <Plate card="panel-upgrades" />
        <span className="sa-stage" style={style}>
          <span className="sa-door" style={place(m.door)}>
            <span className="sa-face sa-face-outer">
              <Layer className="sa-face-img" src={`${BASE}/panel-upgrades/door-outer.webp`} />
              <span className="sa-face-shade sa-shade-outer" />
            </span>
            <span className="sa-face sa-face-inner">
              <Layer className="sa-face-img" src={`${BASE}/panel-upgrades/door-inner.webp`} />
              <span className="sa-face-shade sa-shade-inner" />
            </span>
          </span>
        </span>
      </>
    );
  },
  "ev-charger-installation": () => {
    const m = media["ev-charger-installation"];
    const d = smoothPath(m.cable as [number, number][]);
    return (
      <>
        <Plate card="ev-charger-installation" />
        <Layer className="sa-layer sa-ev-status" src={`${BASE}/ev-charger-installation/status.webp`} style={place(m.status)} />
        {/* Charging: soft pulses of light run down the cable from the charger into the car's inlet. */}
        <svg className="sa-ev-flow" viewBox={`0 0 ${FRAME.width} ${FRAME.height}`} preserveAspectRatio="xMidYMid meet" focusable="false">
          <defs>
            <filter id="sa-ev-glow" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="7" />
            </filter>
          </defs>
          {[0, 1].map((n) => (
            <g key={n} className={`sa-ev-pulse sa-ev-pulse-${n}`}>
              <path className="sa-ev-halo" d={d} pathLength={100} filter="url(#sa-ev-glow)" />
              <path className="sa-ev-core" d={d} pathLength={100} />
            </g>
          ))}
        </svg>
      </>
    );
  },
  lighting: () => {
    const m = media.lighting;
    const style = {
      "--sa-slide-top": `${(m.travel.from / FRAME.height) * 100}%`,
      "--sa-slide-bottom": `${(m.travel.to / FRAME.height) * 100}%`,
    } as CSSProperties;
    return (
      <>
        <Plate card="lighting" />
        <Layer className="sa-layer sa-light-dim" src={`${BASE}/lighting/dimmed.webp`} style={place(m.dimmed)} />
        <span className="sa-frame sa-light-slider" style={style}>
          <Layer className="sa-layer" src={`${BASE}/lighting/slider.webp`} style={place(m.slider)} />
        </span>
      </>
    );
  },
  "new-construction": () => (
    <>
      <Plate card="new-construction" />
      <Layer className="sa-layer sa-remodel-finished" src={`${BASE}/new-construction/finished.webp`} style={place(media["new-construction"].finished)} />
    </>
  ),
  other: () => (
    <>
      <Plate card="other" />
      <MeterReading />
    </>
  ),
};

/** A smooth curve through traced points (Catmull-Rom as cubic Béziers), in frame px. */
function smoothPath(points: [number, number][]) {
  const p = (i: number) => points[Math.max(0, Math.min(points.length - 1, i))];
  let d = `M${p(0)[0]} ${p(0)[1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = p(i - 1), [x1, y1] = p(i), [x2, y2] = p(i + 1), [x3, y3] = p(i + 2);
    const c1 = [x1 + (x2 - x0) / 6, y1 + (y2 - y0) / 6];
    const c2 = [x2 - (x3 - x1) / 6, y2 - (y3 - y1) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${x2} ${y2}`;
  }
  return d;
}

/* ---- Multimeter display: seven-segment digits drawn to the photo's own geometry. ---- */
const SEGMENTS: Record<string, string> = {
  "0": "abcdef", "1": "bc", "2": "abged", "3": "abgcd", "4": "fgbc",
  "5": "afgcd", "6": "afgedc", "7": "abc", "8": "abcdefg", "9": "abcdfg", " ": "",
};
// Settling sequence (each held long enough to read; no flicker), then hold.
export const METER_READINGS = ["  0.0", " 84.6", "115.3", "119.7", "120.2", "120.1"];

function segment(name: string, x: number, y: number, w: number, h: number, t: number) {
  const g = 1.4; // gap between segments
  const half = h / 2;
  const horizontal = (yy: number) =>
    [[x + g + t / 2, yy], [x + g + t, yy - t / 2], [x + w - g - t, yy - t / 2], [x + w - g - t / 2, yy], [x + w - g - t, yy + t / 2], [x + g + t, yy + t / 2]];
  const vertical = (xx: number, ya: number, yb: number) =>
    [[xx, ya + g + t / 2], [xx + t / 2, ya + g + t], [xx + t / 2, yb - g - t], [xx, yb - g - t / 2], [xx - t / 2, yb - g - t], [xx - t / 2, ya + g + t]];
  const pts = {
    a: horizontal(y + t / 2),
    g: horizontal(y + half),
    d: horizontal(y + h - t / 2),
    f: vertical(x + t / 2, y, y + half),
    e: vertical(x + t / 2, y + half, y + h),
    b: vertical(x + w - t / 2, y, y + half),
    c: vertical(x + w - t / 2, y + half, y + h),
  }[name]!;
  return pts.map(([px, py]) => `${px.toFixed(1)},${py.toFixed(1)}`).join(" ");
}

function MeterReading() {
  const d = media.other.digits;
  return (
    <svg className="sa-meter" viewBox={`0 0 ${FRAME.width} ${FRAME.height}`} preserveAspectRatio="xMidYMid meet" focusable="false">
      {METER_READINGS.map((reading, f) => {
        const cells = reading.replace(".", "").padStart(4, " ").split("");
        return (
          <g key={reading} className={`sa-meter-frame sa-mf${f}`}>
            {cells.map((ch, i) =>
              SEGMENTS[ch].split("").map((s) => (
                <polygon key={`${i}${s}`} points={segment(s, d.x + i * d.pitch, d.y, d.width, d.height, d.thickness)} />
              )),
            )}
          </g>
        );
      })}
      <rect className="sa-meter-point" x={d.point[0]} y={d.point[1]} width={d.point[2]} height={d.point[3]} rx="0.8" />
    </svg>
  );
}
