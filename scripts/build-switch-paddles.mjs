/**
 * Paddle layers for the header light switch (components/light-switch.tsx).
 * Crops the rocker paddle out of each switch photo, exactly where it sits, so the
 * paddle can pivot on its centre line while the plate photos stay still.
 *
 *   node scripts/build-switch-paddles.mjs
 */
import sharp from "sharp";

// Inside the plate opening of the 250x400 photos (the gap lines stay on the plate).
const PADDLE = { left: 72, top: 76, width: 108, height: 242 };

for (const state of ["on", "off"]) {
  await sharp(`public/images/switch/switch-${state}.webp`)
    .extract(PADDLE)
    .webp({ quality: 90 })
    .toFile(`public/images/switch/paddle-${state}.webp`);
}
const pct = (v, of) => +((v / of) * 100).toFixed(2);
console.log("paddle box (% of plate):", { left: pct(PADDLE.left, 250), top: pct(PADDLE.top, 400), width: pct(PADDLE.width, 250), height: pct(PADDLE.height, 400) });
