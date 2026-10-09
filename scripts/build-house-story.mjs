/**
 * Builds the "house lights up" scroll images from one real night photo.
 *
 *   node scripts/build-house-story.mjs
 *
 * Input:  assets/story/house-night.webp   (the photo with every light on)
 * Output: public/images/story/
 *   house-on.webp    the original photo, re-encoded
 *   house-off.webp   the same photo with its lights turned off
 *   mask-<id>.png    one soft alpha mask per light group, revealed in order
 *
 * The final frame on the site is the untouched original. The "off" frame only
 * darkens areas covered by a mask, so the sky and trees never change.
 *
 * To use a different photo (ideally a real Pacific Plains Electric job), drop
 * it in as assets/story/house-night.webp and redraw the boxes and polygons
 * below in that photo's pixel coordinates.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "assets/story/house-night.webp";
const OUT = "public/images/story";
const MASK_WIDTH = 512;

// Light groups in reveal order. `boxes` keep only detected lamp/window pixels
// inside each box; `polygons` are hand-drawn areas lit by the fixtures.
const groups = [
  {
    id: "sconces",
    boxes: [[358, 192, 402, 228], [500, 192, 545, 228], [650, 58, 700, 102]],
    darken: 0.88,
  },
  {
    id: "upstairs",
    boxes: [[392, 182, 508, 275], [602, 158, 742, 245]],
    darken: 0.88,
  },
  {
    id: "downstairs",
    boxes: [[392, 296, 548, 408], [618, 296, 728, 408]],
    darken: 0.88,
  },
  {
    id: "facade",
    polygons: [
      // Brick facade below the eaves, plus the lit gable.
      { points: "335,150 555,150 555,118 680,22 806,118 790,140 790,428 335,428", opacity: 1 },
      // Lawn lit by the house.
      { points: "30,468 330,426 800,426 1024,420 1024,500 0,500", opacity: 0.9 },
      // Pool deck.
      { points: "0,492 1024,492 1024,640 0,640", opacity: 0.55 },
    ],
    blur: 22,
    darken: 0.55,
    // The pool is its own, last step.
    excludes: ["pool"],
  },
  {
    id: "pool",
    polygons: [
      { points: "447,503 612,503 690,642 1024,642 1024,685 0,685 0,642 388,642", opacity: 1 },
    ],
    blur: 3,
    darken: 0.62,
    desaturate: 0.55,
  },
];

const isLamp = (r, g, b) => {
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return r > b + 40 && r > 150 && lum > 150;
};

async function grayToFloat(buffer, width, height, blur) {
  let img = sharp(buffer, { raw: { width, height, channels: 1 } });
  if (blur) img = img.blur(blur);
  // sharp may hand back more than one channel here; read the first.
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const out = new Float32Array(width * height);
  for (let i = 0; i < out.length; i++) out[i] = data[i * info.channels] / 255;
  return out;
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const { data, info } = await sharp(SRC)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const px = width * height;

  const masks = [];
  for (const g of groups) {
    let mask;
    if (g.boxes) {
      // Detected lamp pixels inside the boxes, grown and feathered into a glow.
      const core = Buffer.alloc(px);
      for (const [x0, y0, x1, y1] of g.boxes)
        for (let y = y0; y < y1; y++)
          for (let x = x0; x < x1; x++) {
            const i = y * width + x;
            if (isLamp(data[i * 3], data[i * 3 + 1], data[i * 3 + 2])) core[i] = 255;
          }
      const tight = await grayToFloat(core, width, height, 2.5);
      const glow = await grayToFloat(core, width, height, 14);
      mask = tight.map((t, i) => Math.min(1, Math.max(Math.min(1, t * 2.2), glow[i] * 1.6)));
    } else {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <rect width="100%" height="100%" fill="black"/>
        ${g.polygons.map((p) => `<polygon points="${p.points}" fill="white" fill-opacity="${p.opacity}"/>`).join("")}
      </svg>`;
      const gray = await sharp(Buffer.from(svg)).greyscale().raw().toBuffer();
      const single = Buffer.alloc(px);
      for (let i = 0; i < px; i++) single[i] = gray[i * (gray.length / px)];
      mask = await grayToFloat(single, width, height, g.blur);
    }
    masks.push({ ...g, mask });
  }

  for (const m of masks)
    for (const id of m.excludes ?? []) {
      const other = masks.find((x) => x.id === id).mask;
      m.mask = m.mask.map((v, i) => v * (1 - other[i]));
    }

  // Lights-off frame: darken each masked area by its group's strength.
  const off = Buffer.alloc(px * 3);
  for (let i = 0; i < px; i++) {
    let r = data[i * 3];
    let gch = data[i * 3 + 1];
    let b = data[i * 3 + 2];
    for (const m of masks) {
      const a = m.mask[i];
      if (!a) continue;
      if (m.desaturate) {
        const l = 0.2126 * r + 0.7152 * gch + 0.0722 * b;
        const d = m.desaturate * a;
        r += (l - r) * d;
        gch += (l - gch) * d;
        b += (l - b) * d;
      }
      const k = 1 - m.darken * a;
      r *= k;
      gch *= k;
      b *= k;
      // Unlit glass reads cool, not brown.
      if (m.boxes) {
        const t = 0.6 * a;
        r += (22 - r) * t;
        gch += (27 - gch) * t;
        b += (36 - b) * t;
      }
    }
    off[i * 3] = r;
    off[i * 3 + 1] = gch;
    off[i * 3 + 2] = b;
  }

  await sharp(SRC).webp({ quality: 82 }).toFile(`${OUT}/house-on.webp`);
  await sharp(off, { raw: { width, height, channels: 3 } })
    .webp({ quality: 82 })
    .toFile(`${OUT}/house-off.webp`);

  for (const m of masks) {
    // CSS masks read the alpha channel: black pixels with mask-shaped alpha.
    const alpha = Uint8Array.from(m.mask, (v) => Math.round(v * 255));
    const rgba = Buffer.alloc(px * 4);
    for (let i = 0; i < px; i++) rgba[i * 4 + 3] = alpha[i];
    await sharp(rgba, { raw: { width, height, channels: 4 } })
      .resize(MASK_WIDTH)
      .png({ compressionLevel: 9, palette: false })
      .toFile(`${OUT}/mask-${m.id}.png`);
  }
  console.log(`Built ${masks.length} masks at ${width}×${height} → ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
