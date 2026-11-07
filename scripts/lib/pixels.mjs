/**
 * Small raw-pixel helpers for the service-photo build (scripts/build-service-media.mjs).
 * Images are held as { data: Uint8ClampedArray RGBA, width, height }.
 */
import sharp from "sharp";

export async function load(path) {
  const { data, info } = await sharp(path).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data: new Uint8ClampedArray(data), width: info.width, height: info.height };
}

export function clone(img) {
  return { data: new Uint8ClampedArray(img.data), width: img.width, height: img.height };
}

export const lum = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

/** Point-in-polygon test (polygon as [[x,y],...]). */
export function inside(poly, x, y) {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

/** A single-channel float mask (0..1) the size of an image. */
export const mask = (w, h) => ({ data: new Float32Array(w * h), width: w, height: h });

export function polygonMask(w, h, poly, value = 1) {
  const m = mask(w, h);
  const xs = poly.map((p) => p[0]);
  const ys = poly.map((p) => p[1]);
  for (let y = Math.max(0, Math.floor(Math.min(...ys))); y <= Math.min(h - 1, Math.ceil(Math.max(...ys))); y++)
    for (let x = Math.max(0, Math.floor(Math.min(...xs))); x <= Math.min(w - 1, Math.ceil(Math.max(...xs))); x++)
      if (inside(poly, x + 0.5, y + 0.5)) m.data[y * w + x] = value;
  return m;
}

/** Separable box blur, repeated for an approximate Gaussian feather. */
export function blurMask(m, radius, passes = 3) {
  if (radius < 1) return m;
  const { width: w, height: h } = m;
  let src = Float32Array.from(m.data);
  let dst = new Float32Array(w * h);
  const r = Math.round(radius);
  for (let p = 0; p < passes; p++) {
    for (let y = 0; y < h; y++) {
      let acc = 0;
      for (let x = -r; x <= r; x++) acc += src[y * w + Math.min(w - 1, Math.max(0, x))];
      for (let x = 0; x < w; x++) {
        dst[y * w + x] = acc / (2 * r + 1);
        acc += src[y * w + Math.min(w - 1, x + r + 1)] - src[y * w + Math.max(0, x - r)];
      }
    }
    [src, dst] = [dst, src];
    for (let x = 0; x < w; x++) {
      let acc = 0;
      for (let y = -r; y <= r; y++) acc += src[Math.min(h - 1, Math.max(0, y)) * w + x];
      for (let y = 0; y < h; y++) {
        dst[y * w + x] = acc / (2 * r + 1);
        acc += src[Math.min(h - 1, y + r + 1) * w + x] - src[Math.max(0, y - r) * w + x];
      }
    }
    [src, dst] = [dst, src];
  }
  return { data: src, width: w, height: h };
}

/** Grow (positive) or shrink (negative) a binary-ish mask by a radius. */
export function morph(m, radius) {
  const b = blurMask(m, Math.abs(radius), 1);
  const out = mask(m.width, m.height);
  for (let i = 0; i < out.data.length; i++) out.data[i] = radius > 0 ? (b.data[i] > 0.02 ? 1 : 0) : b.data[i] > 0.98 ? 1 : 0;
  return out;
}

/** Copy pixels from (x+dx, y+dy) into (x, y), weighted by mask. */
export function patch(img, m, dx, dy, from = img) {
  const out = clone(img);
  const { width: w, height: h } = img;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const a = m.data[y * w + x];
      if (a <= 0) continue;
      const sx = Math.min(w - 1, Math.max(0, x + dx));
      const sy = Math.min(h - 1, Math.max(0, y + dy));
      const i = (y * w + x) * 4;
      const j = (sy * w + sx) * 4;
      for (let c = 0; c < 3; c++) out.data[i + c] = out.data[i + c] * (1 - a) + from.data[j + c] * a;
    }
  return out;
}

/** Cut a layer out of an image: RGB from img, alpha from mask, cropped to box. */
export function cutout(img, m, box) {
  const { x, y, w, h } = box;
  const out = new Uint8ClampedArray(w * h * 4);
  for (let yy = 0; yy < h; yy++)
    for (let xx = 0; xx < w; xx++) {
      const i = ((y + yy) * img.width + (x + xx)) * 4;
      const o = (yy * w + xx) * 4;
      out[o] = img.data[i];
      out[o + 1] = img.data[i + 1];
      out[o + 2] = img.data[i + 2];
      out[o + 3] = Math.round(255 * Math.min(1, Math.max(0, m.data[(y + yy) * img.width + (x + xx)])));
    }
  return { data: out, width: w, height: h };
}

/** Bounding box of mask pixels above a threshold, padded. */
export function bbox(m, pad = 2, threshold = 0.01) {
  let x0 = m.width, y0 = m.height, x1 = -1, y1 = -1;
  for (let y = 0; y < m.height; y++)
    for (let x = 0; x < m.width; x++)
      if (m.data[y * m.width + x] > threshold) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
  x0 = Math.max(0, x0 - pad);
  y0 = Math.max(0, y0 - pad);
  x1 = Math.min(m.width - 1, x1 + pad);
  y1 = Math.min(m.height - 1, y1 + pad);
  return { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
}

export function toSharp(img) {
  return sharp(Buffer.from(img.data.buffer, img.data.byteOffset, img.data.byteLength), {
    raw: { width: img.width, height: img.height, channels: 4 },
  });
}

/** Mask -> visual PNG (for checking), white = 1. */
export function maskImage(m) {
  const out = new Uint8ClampedArray(m.width * m.height * 4);
  for (let i = 0; i < m.data.length; i++) {
    const v = Math.round(255 * Math.min(1, Math.max(0, m.data[i])));
    out[i * 4] = out[i * 4 + 1] = out[i * 4 + 2] = v;
    out[i * 4 + 3] = 255;
  }
  return { data: out, width: m.width, height: m.height };
}

export function combine(a, b, op = Math.max) {
  const out = mask(a.width, a.height);
  for (let i = 0; i < out.data.length; i++) out.data[i] = op(a.data[i], b.data[i]);
  return out;
}

/**
 * Homography mapping the four corners of a w x h rectangle (TL, TR, BR, BL)
 * onto four image points. Returns (u, v) => [x, y].
 */
export function homography(w, h, quad) {
  const src = [[0, 0], [w, 0], [w, h], [0, h]];
  const A = [];
  const b = [];
  for (let k = 0; k < 4; k++) {
    const [u, v] = src[k];
    const [x, y] = quad[k];
    A.push([u, v, 1, 0, 0, 0, -u * x, -v * x]);
    b.push(x);
    A.push([0, 0, 0, u, v, 1, -u * y, -v * y]);
    b.push(y);
  }
  // Gaussian elimination with partial pivoting.
  for (let c = 0; c < 8; c++) {
    let p = c;
    for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]];
    [b[c], b[p]] = [b[p], b[c]];
    for (let r = c + 1; r < 8; r++) {
      const f = A[r][c] / A[c][c];
      for (let k = c; k < 8; k++) A[r][k] -= f * A[c][k];
      b[r] -= f * b[c];
    }
  }
  const m = new Array(8);
  for (let r = 7; r >= 0; r--) {
    let s = b[r];
    for (let k = r + 1; k < 8; k++) s -= A[r][k] * m[k];
    m[r] = s / A[r][r];
  }
  return (u, v) => {
    const d = m[6] * u + m[7] * v + 1;
    return [(m[0] * u + m[1] * v + m[2]) / d, (m[3] * u + m[4] * v + m[5]) / d];
  };
}

/** Bilinear sample of an RGBA image. */
export function sample(img, x, y) {
  const x0 = Math.max(0, Math.min(img.width - 2, Math.floor(x)));
  const y0 = Math.max(0, Math.min(img.height - 2, Math.floor(y)));
  const fx = Math.min(1, Math.max(0, x - x0)), fy = Math.min(1, Math.max(0, y - y0));
  const out = [0, 0, 0];
  for (let c = 0; c < 3; c++) {
    const p = (yy, xx) => img.data[(yy * img.width + xx) * 4 + c];
    out[c] = p(y0, x0) * (1 - fx) * (1 - fy) + p(y0, x0 + 1) * fx * (1 - fy) + p(y0 + 1, x0) * (1 - fx) * fy + p(y0 + 1, x0 + 1) * fx * fy;
  }
  return out;
}

/** Adjust pixels under a mask with a function (r,g,b,a,x,y) => [r,g,b]. */
export function adjust(img, m, fn) {
  const out = clone(img);
  const { width: w, height: h } = img;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const a = m ? m.data[y * w + x] : 1;
      if (a <= 0) continue;
      const i = (y * w + x) * 4;
      const [r, g, b] = fn(img.data[i], img.data[i + 1], img.data[i + 2], a, x, y);
      out.data[i] = img.data[i] * (1 - a) + r * a;
      out.data[i + 1] = img.data[i + 1] * (1 - a) + g * a;
      out.data[i + 2] = img.data[i + 2] * (1 - a) + b * a;
    }
  return out;
}
