/**
 * Raster brand assets search engines and devices expect:
 *   node scripts/build-brand-assets.mjs
 *
 *   public/brand/logo-512.png        square logo for structured data
 *   public/brand/icon-192.png        web app manifest
 *   public/brand/icon-512.png        web app manifest
 *   public/brand/apple-touch-icon.png
 *   public/images/og-default.jpg     1200×630 social share image
 */
import sharp from "sharp";

const FOREST = "#1f4d3c";
const CREAM = "#f6f1e7";
const OCHRE = "#d6ab5f";
const mark = (color, width) => `
  <path d="M32 7v49M15 17h34M10 27h44M20 17v10M44 17v10M12 56h40M23 56l9-29 9 29"
    fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>
  <circle cx="15" cy="17" r="3" fill="${color}"/>
  <circle cx="49" cy="17" r="3" fill="${color}"/>
  <path d="M3 36c10-9 18-9 29-9s19 0 29 9" fill="none" stroke="${color}" stroke-width="${width * 0.75}"/>`;

const squareIcon = (size, padding) => {
  const inner = size - padding * 2;
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <rect width="${size}" height="${size}" fill="${FOREST}"/>
    <svg x="${padding}" y="${padding}" width="${inner}" height="${inner}" viewBox="0 0 64 64">${mark(OCHRE, 3)}</svg>
  </svg>`);
};

await sharp(squareIcon(512, 72)).png().toFile("public/brand/logo-512.png");
await sharp(squareIcon(512, 96)).png().toFile("public/brand/icon-512.png");
await sharp(squareIcon(192, 36)).png().toFile("public/brand/icon-192.png");
await sharp(squareIcon(180, 30)).png().toFile("public/brand/apple-touch-icon.png");

// Social image: the Central Coast landscape with the business name and area.
const landscape = await sharp("public/images/central-coast.webp")
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .toBuffer();
const overlay = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><linearGradient id="g" x1="0" x2="1">
    <stop offset="0" stop-color="${CREAM}" stop-opacity="0.96"/>
    <stop offset="0.62" stop-color="${CREAM}" stop-opacity="0.82"/>
    <stop offset="1" stop-color="${CREAM}" stop-opacity="0"/>
  </linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <svg x="72" y="150" width="88" height="88" viewBox="0 0 64 64">${mark(FOREST, 3)}</svg>
  <text x="72" y="320" font-family="DejaVu Sans, Arial, sans-serif" font-size="64" font-weight="700" fill="#1f2421">Pacific Plains Electric</text>
  <text x="72" y="390" font-family="DejaVu Sans, Arial, sans-serif" font-size="34" fill="#1f2421">Electrician serving San Luis Obispo County</text>
  <text x="72" y="450" font-family="DejaVu Sans, Arial, sans-serif" font-size="26" fill="#585d55">Licensed contractor · CSLB #1162180 · (805) 626-7761</text>
</svg>`);
await sharp(landscape)
  .composite([{ input: overlay }])
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile("public/images/og-default.jpg");
console.log("Brand assets written.");
