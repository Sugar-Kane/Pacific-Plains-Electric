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
  "ev-charger-installation": () => (
    <>
      <Plate card="ev-charger-installation" />
      <Layer className="sa-layer sa-ev-status" src={`${BASE}/ev-charger-installation/status.webp`} style={place(media["ev-charger-installation"].status)} />
    </>
  ),
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
