/**
 * Builds the layered photo assets for the six home-page service cards.
 *
 *   node scripts/build-service-media.mjs [card ...] [--debug]
 *
 * Input:  assets/service-photos/*.webp  (the owner-supplied concept photos)
 * Output: public/images/services/<card>/  (base plates and moving layers)
 *
 * Every animated part is cut from, or rebuilt out of, the same photograph,
 * so layers stay registered with their base plate. Coordinates below are in
 * the 1448x1086 source pixels; the site positions layers in percentages of
 * that frame (see components/service-animation.tsx), so the output scale can
 * change without touching the component.
 */
import sharp from "sharp";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import {
  load, clone, lum, polygonMask, blurMask, morph, patch, cutout, bbox, toSharp, maskImage, combine, adjust, mask,
  homography, sample,
} from "./lib/pixels.mjs";

const SRC = "assets/service-photos";
const OUT = "public/images/services";
const DEBUG = process.argv.includes("--debug");
const DEBUG_DIR = process.env.SERVICE_MEDIA_DEBUG || "/tmp/service-media-debug";
export const FRAME = { width: 1448, height: 1086 };
// Base plates are encoded at this width (2.6x a ~370px card, enough for 2x screens).
const PLATE_WIDTH = 960;
const SCALE = PLATE_WIDTH / FRAME.width;

async function writePlate(img, file) {
  await toSharp(img).resize(PLATE_WIDTH).webp({ quality: 80, effort: 6 }).toFile(file);
}
async function writeLayer(img, file) {
  await toSharp(img)
    .resize(Math.max(1, Math.round(img.width * SCALE)))
    .webp({ quality: 85, alphaQuality: 90, effort: 6 })
    .toFile(file);
}
async function debug(name, img) {
  if (!DEBUG) return;
  await mkdir(DEBUG_DIR, { recursive: true });
  await toSharp(img).png().toFile(`${DEBUG_DIR}/${name}.png`);
}
/** Percent box of a layer in the frame, printed for the component. */
const pct = (box) => ({
  left: +((box.x / FRAME.width) * 100).toFixed(3),
  top: +((box.y / FRAME.height) * 100).toFixed(3),
  width: +((box.w / FRAME.width) * 100).toFixed(3),
});

const cards = {
  /**
   * 1. Electrical repair: a non-contact tester approaches the hot slot of a
   * duplex receptacle (without entering it), its tip lights, then it withdraws.
   */
  async "electrical-repair"(out) {
    const img = await load(`${SRC}/outlet-tester.webp`);
    const { width: w, height: h } = img;
    // Outline of the tester (snug along the underside, where the wall plate's
    // edge shadow sits); colour tests below pick the real pixels.
    const outline = polygonMask(w, h, [
      [836, 336], [868, 330], [1000, 284], [1447, 236], [1447, 448], [1030, 430], [1000, 425], [868, 404], [836, 380],
    ]);
    // The translucent tip and cone read like the wall by colour, so they are drawn.
    // Traced on a 10px grid: the cone (339-378 at its narrow end, 309-405 at the
    // body) and the nose. Kept tight so no wall rides along with the tool.
    const tip = combine(
      polygonMask(w, h, [[872, 339], [970, 309], [992, 304], [992, 410], [970, 405], [872, 378]]),
      polygonMask(w, h, [[846, 353], [851, 347], [874, 346], [874, 374], [851, 372], [846, 366]]),
    );
    // Body: dark plastic and the green band. An opening then drops thin dark lines
    // the outline also catches (the receptacle's edge, the wall plate's shadow
    // line), so nothing but the tool rides along with it. The red LED glow on the
    // wall is never part of the tool.
    let body = mask(w, h);
    for (let i = 0; i < w * h; i++) {
      // Left of x 965 the tool is only the traced cone and nose.
      if (!outline.data[i] || tip.data[i] || i % w < 965) continue;
      const r = img.data[i * 4], g = img.data[i * 4 + 1], b = img.data[i * 4 + 2];
      const l = lum(r, g, b);
      if ((l < 140 && Math.abs(r - g) < 25) || (g - r > 10 && l < 205)) body.data[i] = 1;
    }
    body = morph(morph(body, -3), 3);
    let tester = combine(body, tip);
    tester = morph(morph(tester, 3), -3); // close small holes
    tester = blurMask(tester, 1, 2);

    // Contact shadow that travels with the tester.
    const shadow = mask(w, h);
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) shadow.data[y * w + x] = tester.data[Math.max(0, y - 16) * w + Math.max(0, x - 6)];
    const softShadow = blurMask(shadow, 9, 3);

    // Rebuild what the tester and its shadow cover.
    const cover = blurMask(morph(combine(tester, softShadow, (a, b) => Math.max(a > 0.02 ? 1 : 0, b > 0.04 ? 1 : 0)), 6), 3, 2);
    const region = (x0, x1) => {
      const m = mask(w, h);
      for (let y = 0; y < h; y++) for (let x = x0; x < x1; x++) m.data[y * w + x] = cover.data[y * w + x];
      return m;
    };
    // Wall: clean wall from above (below the tool lies its own cast shadow). A wide
    // feather spreads the join so the shifted stucco shows no line; rows low enough
    // that 232px up would reach the tool's top edge borrow from 300px up instead.
    const wallSource = clone(img);
    for (let y = 0; y < h; y++) {
      const t = Math.min(1, Math.max(0, (y - 430) / 40));
      for (let x = 1000; x < w; x++)
        for (let c = 0; c < 3; c++) {
          const a = img.data[(Math.max(0, y - 232) * w + x) * 4 + c], b = img.data[(Math.max(0, y - 300) * w + x) * 4 + c];
          wallSource.data[(y * w + x) * 4 + c] = a * (1 - t) + b * t;
        }
    }
    let plate = patch(img, blurMask(morph(region(1013, w), 12), 9, 3), 0, 0, wallSource);
    // Receptacle: the right half of the top receptacle (tip, LED reflection,
    // outline) from the identical lower receptacle, 333px down.
    const receptacle = blurMask(polygonMask(w, h, [[796, 286], [905, 286], [905, 430], [796, 430]]), 2, 2);
    plate = patch(plate, receptacle, 0, 333);
    // Plate margin is smooth: interpolate each column between clean rows
    // above (160-220) and below (660-720) the tool and its shadow.
    const margin = mask(w, h);
    for (let y = 230; y < 660; y++) for (let x = 903; x < 1013; x++) margin.data[y * w + x] = 1;
    const marginSoft = blurMask(margin, 2, 2);
    const colMean = (src, x, y0, y1, c) => {
      let s = 0;
      for (let y = y0; y < y1; y++) s += src.data[(y * w + x) * 4 + c];
      return s / (y1 - y0);
    };
    plate = adjust(plate, marginSoft, (r, g, b, a, x, y) => {
      const t = Math.min(1, Math.max(0, (y - 190) / (690 - 190)));
      return [0, 1, 2].map((c) => colMean(img, x, 160, 220, c) * (1 - t) + colMean(img, x, 660, 720, c) * t);
    });
    // The tool's long soft shadow on the wall: per colour channel, lift it to
    // what the clean wall above and below implies, keeping the stucco texture.
    const wall = mask(w, h);
    for (let y = 0; y < h; y++) for (let x = 1016; x < w; x++) wall.data[y * w + x] = 1;
    const wallWeight = blurMask(wall, 13, 3);
    const local = [0, 1, 2].map((c) => {
      const m = mask(w, h);
      for (let i = 0; i < w * h; i++) m.data[i] = plate.data[i * 4 + c] * wall.data[i];
      return blurMask(m, 13, 3);
    });
    const rowMean = (y0, y1, c) => {
      let s = 0, n = 0;
      for (let y = y0; y < y1; y++) for (let x = 1030; x < w; x += 3) { s += plate.data[(y * w + x) * 4 + c]; n++; }
      return s / n;
    };
    const top = [0, 1, 2].map((c) => rowMean(20, 220, c));
    const bottom = [0, 1, 2].map((c) => rowMean(880, 1060, c));
    plate = adjust(plate, wall, (r, g, b, a, x, y) => {
      if (y < 236 || y > 900) return [r, g, b];
      const fade = Math.min(1, (y - 236) / 40, (900 - y) / 60);
      const i = y * w + x;
      return [r, g, b].map((v, c) => {
        const expected = top[c] + (bottom[c] - top[c]) * (y / h);
        const mean = local[c].data[i] / Math.max(1e-3, wallWeight.data[i]);
        const gain = Math.min(1.7, Math.max(0.94, expected / Math.max(1, mean)));
        return v * (1 + (gain - 1) * fade);
      });
    });
    await debug("tester-mask", maskImage(tester));
    await debug("tester-plate", plate);

    // Tester layer: shadow under the tool, tool on top. LED off by default;
    // the lit tip is a separate layer the animation fades in.
    const box = bbox(combine(tester, softShadow), 2);
    box.w = Math.min(box.w, w - box.x);
    const layer = mask(w, h);
    const unlit = adjust(img, tip, (r, g, b) => {
      const l = lum(r, g, b);
      return r - g > 12 ? [l * 0.95, l * 0.97, l] : [r, g, b];
    });
    const toolWithShadow = clone(unlit);
    for (let i = 0; i < w * h; i++) {
      const t = tester.data[i], s = softShadow.data[i] * 0.32 * (1 - t);
      layer.data[i] = t + s;
      if (t < 1) {
        const k = t / Math.max(1e-6, t + s);
        for (let c = 0; c < 3; c++) toolWithShadow.data[i * 4 + c] = unlit.data[i * 4 + c] * k + 24 * (1 - k);
      }
    }
    const litMask = blurMask(polygonMask(w, h, [[843, 340], [1000, 286], [1000, 430], [843, 384]]), 2, 2);
    const litOnly = mask(w, h);
    for (let i = 0; i < w * h; i++) litOnly.data[i] = litMask.data[i] * tester.data[i];
    const litBox = bbox(litOnly, 3);
    await writePlate(plate, `${out}/plate.webp`);
    await writeLayer(cutout(toolWithShadow, layer, box), `${out}/tester.webp`);
    await writeLayer(cutout(img, litOnly, litBox), `${out}/tester-lit.webp`);
    return { tester: pct(box), testerLit: pct(litBox) };
  },

  /**
   * 3. EV charger: everything stays put; only the charger's single green
   * status bar breathes. The plate carries the bar dimmed, the layer lit.
   */
  async "ev-charger-installation"(out) {
    const img = await load(`${SRC}/ev-charger.webp`);
    const { width: w, height: h } = img;
    const area = polygonMask(w, h, [[95, 295], [150, 295], [150, 340], [95, 340]]);
    const green = mask(w, h);
    for (let i = 0; i < w * h; i++) {
      if (!area.data[i]) continue;
      const r = img.data[i * 4], g = img.data[i * 4 + 1], b = img.data[i * 4 + 2];
      green.data[i] = Math.min(1, Math.max(0, (g - (r + b) / 2 - 6) / 40));
    }
    const glow = blurMask(green, 2, 2);
    // Dimmed bar: the housing grey with a faint trace of the green lens.
    const housing = [0, 1, 2].map((c) => {
      let s = 0, n = 0;
      for (let y = 300; y < 306; y++) for (let x = 106; x < 134; x++) { s += img.data[(y * w + x) * 4 + c]; n++; }
      return s / n;
    });
    const plate = adjust(img, glow, () => [housing[0] * 0.9 + 4, housing[1] * 0.9 + 14, housing[2] * 0.9 + 2]);
    const box = bbox(glow, 3);
    await writePlate(plate, `${out}/plate.webp`);
    await writeLayer(cutout(img, glow, box), `${out}/status.webp`);
    await debug("ev-plate", plate);

    // Cable centre line, for the charging pulse that runs from the charger to the
    // car. A rough hand trace is refined against the photo: at each step, the
    // darkest run across the trace (the black cable on the lighter wall, floor
    // and car body) gives the centre; the result is smoothed. The last points
    // follow the connector handle into the inlet (the port door stands open to
    // its left).
    const L = (x, y) => { const i = (Math.round(y) * w + Math.round(x)) * 4; return lum(img.data[i], img.data[i + 1], img.data[i + 2]); };
    const trace = [[88, 500], [91, 560], [96, 627], [107, 693], [123, 760], [147, 820], [180, 867], [220, 896], [267, 909], [313, 900], [353, 867], [391, 825], [402, 810], [430, 757], [458, 700], [478, 667], [495, 640]];
    const steps = [];
    for (let k = 0; k < trace.length - 1; k++) {
      const [ax, ay] = trace[k], [bx, by] = trace[k + 1];
      const d = Math.hypot(bx - ax, by - ay), n = Math.max(1, Math.round(d / 12));
      for (let i = 0; i < n; i++) steps.push([ax + ((bx - ax) * i) / n, ay + ((by - ay) * i) / n, (bx - ax) / d, (by - ay) / d]);
    }
    const centres = steps.map(([x, y, tx, ty]) => {
      const runs = [];
      let run = null;
      for (let s = -12; s <= 12; s++) {
        if (L(x - ty * s, y + tx * s) < 75) (run ??= []).push(s);
        else if (run) { runs.push(run); run = null; }
      }
      if (run) runs.push(run);
      const best = runs.filter((r) => r.length >= 4 && r.length <= 18 && r[0] > -12 && r.at(-1) < 12).map((r) => (r[0] + r.at(-1)) / 2).sort((p, q) => Math.abs(p) - Math.abs(q))[0];
      // Where the cable runs in front of something dark (the tyre and its shadow)
      // there is no clean run; the trace itself is drawn on the cable there.
      return best === undefined ? [x, y] : [x - ty * best, y + tx * best];
    });
    // Drop a centre that jumps off the line through its neighbours (where the
    // cable crosses something dark, such as a tyre, the run can catch its edge).
    for (let i = 2; i < centres.length - 2; i++) {
      const [a, c, b] = [centres[i - 2], centres[i], centres[i + 2]];
      if (!a || !b || !c) continue;
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const off = Math.abs((b[0] - a[0]) * (a[1] - c[1]) - (a[0] - c[0]) * (b[1] - a[1])) / len;
      if (off > 5) centres[i] = null;
    }
    const smooth = centres.map((_, i) => {
      const near = centres.slice(Math.max(0, i - 2), i + 3).filter(Boolean);
      return near.length ? [near.reduce((s, p) => s + p[0], 0) / near.length, near.reduce((s, p) => s + p[1], 0) / near.length] : null;
    }).filter(Boolean);
    const cable = [...smooth.filter((_, i) => i % 3 === 0), [510, 610], [530, 588], [555, 571], [585, 561], [615, 558]]
      .map(([x, y]) => [+x.toFixed(1), +y.toFixed(1)]);
    return { status: pct(box), cable };
  },

  /**
   * 2. Panel: only the hinged outer door moves; the dead-front stays on.
   * The door is a CSS 3D plane hinged at x=603. Its camera was solved from the
   * photo: the hinge edge (y 119-941) and free edge (y 13-1035, x~352) give
   * an opening of ~116deg, a perspective of ~1858px and an eye height of
   * y~555, so the 3D door lands where the photographed door was.
   */
  async "panel-upgrades"(out) {
    const img = await load(`${SRC}/panel-open.webp`);
    const { width: w, height: h } = img;
    const hingeX = 603, top = 119, bottom = 941, doorW = 405;
    // The photographed door is a little short for its opening (an image-generation
    // slip): sized as photographed it would leave the trim's bevel showing above and
    // below when closed. The 3D door is sized to the opening (y 105-955) instead.
    const doorTop = 105, doorBottom = 955, doorH = doorBottom - doorTop;
    const free = { top: [353, 13], bottom: [350, 1035] };
    const inner = [free.top, [601, top], [601, bottom], free.bottom];

    // Inner face, rectified (free edge on the left, as photographed).
    const texW = doorW, texH = doorH;
    const map = homography(texW, texH, inner);
    const innerFace = { data: new Uint8ClampedArray(texW * texH * 4), width: texW, height: texH };
    for (let v = 0; v < texH; v++)
      for (let u = 0; u < texW; u++) {
        const [x, y] = map(u + 0.5, v + 0.5);
        const [r, g, b] = sample(img, x, y);
        const o = (v * texW + u) * 4;
        innerFace.data[o] = r; innerFace.data[o + 1] = g; innerFace.data[o + 2] = b; innerFace.data[o + 3] = 255;
      }

    // Outer face: the trim's own paint and light. Its colour per row comes from the
    // trim's right margin beside the door (clear of the latch-catch screw), smoothed,
    // and is a touch darker towards the hinge side, as the trim is.
    const marginRow = (y, c) => {
      let s = 0;
      for (let x = 988; x < 1018; x++) s += img.data[(y * w + x) * 4 + c];
      return s / 30;
    };
    const screw = [470, 560];
    const marginRaw = Array.from({ length: h }, (_, y) => [0, 1, 2].map((c) => {
      if (y <= screw[0] || y >= screw[1]) return marginRow(y, c);
      const t = (y - screw[0]) / (screw[1] - screw[0]);
      return marginRow(screw[0], c) * (1 - t) + marginRow(screw[1], c) * t;
    }));
    const margin = (y, c) => {
      let s = 0, n = 0;
      for (let k = -40; k <= 40; k++) { const yy = Math.min(h - 1, Math.max(0, y + k)); s += marginRaw[yy][c]; n++; }
      return s / n;
    };
    // Painted-steel surface: a faint, soft orange-peel plus fine grain (no pattern).
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) - 0.5;
    const peel = mask(texW, texH);
    for (let i = 0; i < peel.data.length; i++) peel.data[i] = rand();
    const soft = blurMask(peel, 2, 2);
    const outerFace = { data: new Uint8ClampedArray(texW * texH * 4), width: texW, height: texH };
    for (let v = 0; v < texH; v++) {
      const sy = Math.round(doorTop + (v / texH) * doorH);
      const row = [0, 1, 2].map((c) => margin(sy, c));
      for (let u = 0; u < texW; u++) {
        const o = (v * texW + u) * 4;
        const edge = Math.min(u, v, texW - 1 - u, texH - 1 - v);
        let k = 0.95 + 0.05 * (u / texW);
        if (edge < 6) k *= u < 6 || v < 6 ? 1.07 : 0.86; // formed lip: lit top/hinge side, shaded opposite
        if (edge === 6) k *= 0.94; // crease where the lip turns
        if (edge === 0) k *= 0.72; // shadow gap against the trim
        const n = soft.data[v * texW + u] * 9 + rand() * 1.6;
        for (let c = 0; c < 3; c++) outerFace.data[o + c] = row[c] * k + n;
        outerFace.data[o + 3] = 255;
      }
    }
    // Flush latch: a dark slot with a lit lower lip, near the free (right) edge.
    for (let v = Math.round(texH / 2 - 34); v < texH / 2 + 34; v++)
      for (let u = texW - 34; u < texW - 22; u++) {
        const o = (v * texW + u) * 4;
        const lip = v > texH / 2 + 30 || u > texW - 24;
        for (let c = 0; c < 3; c++) outerFace.data[o + c] = lip ? outerFace.data[o + c] * 1.12 : 52 + c * 2;
      }

    // Background: the wall, niche border and trim margin the open door hides.
    const quad = morph(polygonMask(w, h, [[free.top[0] - 4, free.top[1] - 4], [hingeX, top - 6], [hingeX, bottom + 6], [free.bottom[0] - 4, free.bottom[1] + 4]]), 4);
    const hide = mask(w, h);
    for (let y = 0; y < h; y++) for (let x = 0; x < 592; x++) hide.data[y * w + x] = quad.data[y * w + x];
    const avgRow = (y, xa, xb, c) => {
      let s = 0;
      for (let x = xa; x < xb; x++) s += img.data[(y * w + x) * 4 + c];
      return s / (xb - xa);
    };
    const smoothRows = (fn) => {
      // Per-row samples, smoothed over 9 rows to drop texture noise.
      const raw = Array.from({ length: h }, (_, y) => [0, 1, 2].map((c) => fn(y, c)));
      return raw.map((_, y) => [0, 1, 2].map((c) => {
        let s = 0, n = 0;
        for (let k = -4; k <= 4; k++) { const yy = Math.min(h - 1, Math.max(0, y + k)); s += raw[yy][c]; n++; }
        return s / n;
      }));
    };
    const leftWall = smoothRows((y, c) => avgRow(y, 326, 345, c));
    const rightWall = smoothRows((y, c) => avgRow(y, 1090, 1112, c));
    const stucco = (x, y) => {
      const sx = 1088 + (x % 50), sy = y;
      const at = (xx, yy) => lum(img.data[(yy * w + xx) * 4], img.data[(yy * w + xx) * 4 + 1], img.data[(yy * w + xx) * 4 + 2]);
      let m = 0;
      for (let k = -3; k <= 3; k++) m += at(sx + k, sy) + at(sx, Math.min(h - 1, Math.max(0, sy + k)));
      return at(sx, sy) - m / 14;
    };
    // Mirror of the right-hand niche border and trim margin, matched in
    // brightness to the slivers of the left side visible above and below the door.
    const mirrored = (x, y, c) => {
      const xr = 1593 - x;
      if (xr >= 1001 && xr <= 1030 && y > 492 && y < 538) {
        const t = (y - 492) / 46; // skip the latch-catch screw on the right margin
        return img.data[(492 * w + xr) * 4 + c] * (1 - t) + img.data[(538 * w + xr) * 4 + c] * t;
      }
      return img.data[(y * w + xr) * 4 + c];
    };
    const gainFor = (xa, xb, rows) => [0, 1, 2].map((c) => {
      let a = 0, m = 0;
      for (const y of rows) for (let x = xa; x < xb; x++) { a += img.data[(y * w + x) * 4 + c]; m += mirrored(x, y, c); }
      return a / Math.max(1, m);
    });
    const range = (a, b) => Array.from({ length: b - a }, (_, i) => a + i);
    const nicheGain = { top: gainFor(516, 554, range(30, 70)), bottom: gainFor(516, 554, range(1000, 1050)) };
    const trimGain = { top: gainFor(560, 590, range(55, 95)), bottom: gainFor(560, 590, range(965, 1020)) };
    const plate = adjust(img, blurMask(hide, 2, 2), (r, g, b, a, x, y) => {
      const t = y / h;
      if (x < 513) {
        const u = Math.min(1, Math.max(0, (x - 345) / (513 - 345)));
        const s = stucco(x, y);
        return [0, 1, 2].map((c) => leftWall[y][c] * (1 - u) + rightWall[y][c] * u + s);
      }
      const gain = x < 557 ? nicheGain : trimGain;
      return [0, 1, 2].map((c) => mirrored(x, y, c) * (gain.top[c] * (1 - t) + gain.bottom[c] * t));
    });

    await writePlate(plate, `${out}/plate.webp`);
    await writeLayer(innerFace, `${out}/door-inner.webp`);
    await writeLayer(outerFace, `${out}/door-outer.webp`);
    await debug("panel-plate", plate);
    await debug("panel-inner", innerFace);
    await debug("panel-outer", outerFace);
    const P = 1858, eye = 555;
    return {
      door: { left: +((hingeX / w) * 100).toFixed(3), top: +((doorTop / h) * 100).toFixed(3), width: +((doorW / w) * 100).toFixed(3), height: +((doorH / h) * 100).toFixed(3) },
      perspective: `${((P / w) * 100).toFixed(2)}cqw`,
      origin: `50% ${((eye / h) * 100).toFixed(2)}%`,
      openAngle: -116.1,
    };
  },

  /**
   * 4. Lighting: the dimmer's slider travels its real slot while the pendant,
   * the wall behind it and the countertop dim together. Window daylight and
   * the foreground wall are untouched, so it is not a whole-image fade.
   */
  async lighting(out) {
    const img = await load(`${SRC}/dimmer-pendant.webp`);
    const { width: w, height: h } = img;
    // Slider knob (with its own shadow) and the slot behind it.
    const knob = blurMask(polygonMask(w, h, [[1105, 512], [1128, 512], [1128, 547], [1105, 547]]), 1, 2);
    const knobBox = bbox(knob, 2);
    const knobHole = blurMask(polygonMask(w, h, [[1101, 508], [1132, 508], [1132, 551], [1101, 551]]), 1, 2);
    const plate = patch(img, knobHole, 0, -46);

    // What the pendant lights, by distance from the lamp (source px).
    const spill = mask(w, h);
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        const dx = (x - 283) / 560, dy = (y - 560) / 640;
        let m = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy));
        if (y < 300) m *= Math.max(0, 1 - (300 - y) / 120); // the dome and cabinets above see little
        m *= Math.min(1, Math.max(0, (x - 78) / 40)); // keep the window's daylight
        m *= Math.min(1, Math.max(0, (742 - x) / 12)); // stop at the foreground wall
        spill.data[y * w + x] = m;
      }
    const bulb = blurMask(polygonMask(w, h, Array.from({ length: 48 }, (_, i) => {
      const a = (i / 48) * Math.PI * 2;
      return [283 + 186 * Math.cos(a), 323 + 22 * Math.sin(a)];
    })), 4, 2);
    const dim = adjust(plate, null, (r, g, b, a, x, y) => {
      const i = y * w + x;
      const s = spill.data[i], q = bulb.data[i];
      const l = lum(r, g, b);
      // Highlights (counter sheen, lit faces) fall further than shadows.
      const fall = s * (0.3 + 0.22 * Math.min(1, Math.max(0, (l - 150) / 90)));
      const k = (1 - fall) * (1 - q * 0.58);
      // Dimmed LEDs read a touch warmer.
      return [r * k, g * k * (1 - q * 0.09), b * k * (1 - q * 0.3 - s * 0.05)];
    });
    const changed = mask(w, h);
    for (let i = 0; i < w * h; i++) changed.data[i] = Math.max(spill.data[i], bulb.data[i]) > 0.003 ? 1 : 0;
    const dimBox = bbox(changed, 0);
    const opaque = mask(w, h);
    opaque.data.fill(1);
    await writePlate(plate, `${out}/plate.webp`);
    await writeLayer(cutout(dim, opaque, dimBox), `${out}/dimmed.webp`);
    await writeLayer(cutout(img, knob, knobBox), `${out}/slider.webp`);
    await debug("lighting-dim", dim);
    // Slot travel for the knob centre, source px (top = full on, bottom = low).
    return { dimmed: pct(dimBox), slider: pct(knobBox), travel: { from: 441 - 529.5, to: 598 - 529.5 } };
  },

  /**
   * 5. Remodeling: two registered views of one room. The rough-in is the photo
   * with one correction (the source had receptacles already installed in the
   * open boxes; at rough-in the boxes are empty, conductors folded inside).
   * The finished view rebuilds the open bay as painted drywall and baseboard
   * from the room's own finished wall, with outlets at the same box positions.
   */
  async "new-construction"(out) {
    const img = await load(`${SRC}/remodel-rough-in.webp`);
    const { width: w, height: h } = img;

    // --- Rough-in: empty the two boxes.
    const boxes = [
      { inner: [266, 728, 297, 767], cables: [268, 276], center: [281, 747] },
      { inner: [696, 729, 718, 766], cables: [704, 716], center: [707, 747] },
    ];
    const blue = [0, 1, 2].map((c) => img.data[(745 * w + 263) * 4 + c]);
    const interiors = mask(w, h);
    for (const { inner: [x0, y0, x1, y1] } of boxes)
      for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) interiors.data[y * w + x] = 1;
    let rough = adjust(img, blurMask(interiors, 1, 1), (r, g, b, a, x, y) => {
      const box = boxes.find(({ inner: [x0, y0, x1, y1] }) => x >= x0 - 2 && x <= x1 + 2 && y >= y0 - 2 && y <= y1 + 2);
      const [, y0, , y1] = box.inner;
      const depth = 0.3 + 0.16 * ((y - y0) / (y1 - y0)); // rim shades the top of the cavity
      const n = ((x * 73856093) ^ (y * 19349663)) % 7;
      return blue.map((v) => v * depth + n * 0.6);
    });
    // Sheath stubs entering through the top knockouts, then folded conductors.
    const strokes = boxes.map(({ inner: [x0, y0, x1, y1], cables: [ca, cb] }) => {
      const mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
      return `
        <rect x="${ca - 2.3}" y="${y0 - 1}" width="4.6" height="6" rx="1.5" fill="#d9b51f"/>
        <rect x="${cb - 2.3}" y="${y0 - 1}" width="4.6" height="6" rx="1.5" fill="#d9b51f"/>
        <path d="M${ca - 0.8} ${y0 + 5} C ${ca - 3} ${my - 2}, ${x0 + 2} ${y1 - 5}, ${mx - 2} ${y1 - 3} S ${x1 - 3} ${my + 3}, ${x1 - 4} ${my - 4}" stroke="#151515" stroke-width="2.4" fill="none" stroke-linecap="round"/>
        <path d="M${ca + 1} ${y0 + 5} C ${ca + 3} ${my}, ${mx + 4} ${y1 - 9}, ${x1 - 3} ${y1 - 6}" stroke="#e7e4dc" stroke-width="2.3" fill="none" stroke-linecap="round"/>
        <path d="M${cb} ${y0 + 5} C ${cb + 1} ${my - 6}, ${mx - 3} ${my - 2}, ${x0 + 3} ${my + 5}" stroke="#b5733d" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        <path d="M${cb - 1} ${y0 + 5} C ${cb - 4} ${my - 3}, ${x0 + 4} ${my - 1}, ${mx} ${my + 9}" stroke="#151515" stroke-width="2.4" fill="none" stroke-linecap="round"/>
        <path d="M${cb + 1} ${y0 + 5} C ${cb + 2} ${my + 2}, ${x1 - 2} ${my + 4}, ${mx + 1} ${y1 - 2}" stroke="#e7e4dc" stroke-width="2.3" fill="none" stroke-linecap="round"/>`;
    }).join("");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${strokes}</svg>`;
    const wires = await sharp(Buffer.from(svg)).blur(0.45).raw().toBuffer();
    for (let i = 0; i < w * h; i++) {
      const a = (wires[i * 4 + 3] / 255) * 0.92;
      if (!a) continue;
      for (let c = 0; c < 3; c++) rough.data[i * 4 + c] = rough.data[i * 4 + c] * (1 - a) + wires[i * 4 + c] * a;
    }

    // --- Finished: drywall and baseboard across the open bay.
    // The bay's right edge includes the cut drywall edge (x 780-797) so no seam remains.
    const bay = [211, 100, 798, 946];
    const wallTop = 100, wallBottom = 893;
    const rowColour = (y, xa, xb) => [0, 1, 2].map((c) => {
      let s = 0;
      for (let x = xa; x < xb; x++) s += img.data[(y * w + x) * 4 + c];
      return s / (xb - xa);
    });
    // Fine paint texture: high-pass of a clean patch of the finished wall.
    const texture = (x, y) => {
      const sx = 950 + (x % 260), sy = 150 + (y % 500);
      const at = (xx, yy) => lum(img.data[(yy * w + xx) * 4], img.data[(yy * w + xx) * 4 + 1], img.data[(yy * w + xx) * 4 + 2]);
      let m = 0;
      for (let k = -3; k <= 3; k++) m += at(sx + k, sy) + at(sx, sy + k);
      return at(sx, sy) - m / 14;
    };
    const rows = [];
    for (let y = wallTop; y < bay[3]; y++) rows[y] = rowColour(y, 802, 822);
    let finished = clone(rough);
    for (let y = bay[1]; y < bay[3]; y++)
      for (let x = bay[0]; x < bay[2]; x++) {
        const i = (y * w + x) * 4;
        const falloff = y < wallBottom ? 1 - 0.06 * ((bay[2] - x) / (bay[2] - bay[0])) : 1;
        const t = y < wallBottom && y > wallTop + 12 ? texture(x, y) * 0.9 : 0;
        // Meet the green wall corner cleanly; blend into the original wall on the right.
        const edge = Math.min(1, (x - bay[0]) / 2, (bay[2] - x) / 6);
        for (let c = 0; c < 3; c++) finished.data[i + c] = rough.data[i + c] * (1 - edge) + (rows[y][c] * falloff + t) * edge;
      }
    // Finished outlets at the box centres, taken from the room's own outlet.
    const outletMask = blurMask(polygonMask(w, h, [[863.5, 723.5], [892.5, 723.5], [892.5, 770], [863.5, 770]]), 1, 2);
    for (const { center: [cx, cy] } of boxes) finished = patch(finished, (() => {
      const m = mask(w, h);
      const dx = Math.round(878 - cx), dy = Math.round(746.5 - cy);
      for (let y = 715; y < 780; y++) for (let x = cx - 25; x < cx + 25; x++) m.data[y * w + x] = outletMask.data[(y + dy) * w + (x + dx)];
      return m;
    })(), Math.round(878 - cx), Math.round(746.5 - cy), img);

    const region = mask(w, h);
    for (let y = bay[1]; y < bay[3]; y++) for (let x = bay[0]; x < bay[2]; x++) region.data[y * w + x] = 1;
    const box = bbox(region, 0);
    await writePlate(rough, `${out}/plate.webp`);
    await writeLayer(cutout(finished, region, box), `${out}/finished.webp`);
    await debug("remodel-rough", rough);
    await debug("remodel-finished", finished);
    return { finished: pct(box) };
  },

  /**
   * 6. Multimeter: the hardware stays still; the reading settles. The photo's
   * digits are removed (the "~" and "V AC" legends stay) and the component
   * draws exact seven-segment digits over the blank LCD.
   */
  async other(out) {
    const img = await load(`${SRC}/multimeter.webp`);
    const { width: w, height: h } = img;
    const x0 = 408, x1 = 604, y0 = 226, y1 = 327;
    const area = blurMask(polygonMask(w, h, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]), 1, 1);
    // A Coons-style fill: interpolate the clean LCD rows above and below,
    // then correct towards the clean columns either side, so all four edges
    // meet the surrounding glass without a visible rectangle.
    const avg = (xa, xb, ya, yb, c) => {
      let s = 0, n = 0;
      for (let y = ya; y < yb; y++) for (let x = xa; x < xb; x++) { s += img.data[(y * w + x) * 4 + c]; n++; }
      return s / n;
    };
    const vertical = (x, y, c) => {
      const t = (y - (y0 - 5)) / (y1 + 5 - (y0 - 5));
      return avg(x - 3, x + 4, y0 - 8, y0 - 2, c) * (1 - t) + avg(x - 3, x + 4, y1 + 2, y1 + 8, c) * t;
    };
    // Edge errors per row; rows beside the "~" legend borrow their neighbours'.
    const edgeError = (x, c) => {
      const raw = [];
      for (let y = y0; y <= y1; y++) raw.push(avg(x - 1, x + 2, y - 4, y + 5, c) - vertical(x, y, c));
      if (x < w / 2) for (let y = 284; y <= 306; y++) raw[y - y0] = raw[283 - y0] + ((raw[307 - y0] - raw[283 - y0]) * (y - 283)) / 24;
      return raw;
    };
    const left = [0, 1, 2].map((c) => edgeError(x0 - 2, c));
    const right = [0, 1, 2].map((c) => edgeError(x1 + 2, c));
    const plate = adjust(img, area, (r, g, b, a, x, y) => {
      const u = Math.min(1, Math.max(0, (x - x0) / (x1 - x0)));
      const k = Math.min(y1, Math.max(y0, y)) - y0;
      return [0, 1, 2].map((c) => vertical(x, y, c) + left[c][k] * (1 - u) + right[c][k] * u);
    });
    await writePlate(plate, `${out}/plate.webp`);
    await debug("meter-plate", plate);
    // Seven-segment geometry measured from the photo's own digits (source px).
    return { digits: { x: 411.7, y: 231.7, pitch: 50, width: 38.3, height: 88.3, thickness: 7.3, point: [551.7, 310, 5.2, 8.2] } };
  },
};

// Layer positions for components/service-animation.tsx, merged so a partial
// rebuild keeps the other cards' entries.
const LAYOUT = "components/service-media.json";
const only = process.argv.slice(2).filter((a) => !a.startsWith("--"));
let layout = {};
try {
  layout = JSON.parse(await readFile(LAYOUT, "utf8"));
} catch {}
for (const [name, build] of Object.entries(cards)) {
  if (only.length && !only.includes(name)) continue;
  const out = `${OUT}/${name}`;
  await mkdir(out, { recursive: true });
  layout[name] = await build(out);
  console.log(name, JSON.stringify(layout[name]));
}
await writeFile(LAYOUT, JSON.stringify(layout, null, 2) + "\n");
