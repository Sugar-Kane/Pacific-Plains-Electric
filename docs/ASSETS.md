# Image provenance

The two raster assets were generated with the built-in image-generation tool for this site, inspired by the user-provided references. They are not photos of completed customer work.

- `public/images/central-coast.webp`: editorial landscape of California Central Coast near San Luis Obispo, golden coastal hills, native oak trees, Pacific Ocean and distant headlands; late-afternoon ivory sky, sage brush, green and ochre; wide composition with pale left space for text; no text, logos, people, buildings or electrical equipment.
- `public/images/coastal-home.webp`: architectural illustration of a modest modern California stucco home with cedar door, warm black wall sconces, native grasses and oak hills at golden hour; no people, signage, logos or claimed customer project.

Both were saved into the project and optimized to WebP. The home illustration is visibly labeled as illustrative. Native SVG utility-conductor branding was authored in code; it is intentionally simpler than the landscape logos in the references, following the supplied brief.

Typography refresh: Barlow Condensed 600 (Latin), self-hosted from @fontsource/barlow-condensed 5.3.0. SIL Open Font License included at public/fonts/BARLOW-LICENSE.txt.

## Scroll story photo

- `assets/story/house-night.webp` (source) and the derived files in `public/images/story/`: "Free modern house design photo", rawpixel.com image 5919803 (https://www.rawpixel.com/image/5919803/photo-image-public-domain-house-interior), marked CC0 1.0 (https://creativecommons.org/publicdomain/zero/1.0/), found via Openverse. Downloaded at its largest available size (1024×685).
- It is not a Pacific Plains Electric project and the site captions it as a stock photo.
- `house-off.webp` and `mask-*.png` are generated from the source by `node scripts/build-house-story.mjs`. To use a real job photo: shoot the finished house at dusk with every light on, save it as `assets/story/house-night.webp`, redraw the boxes and polygons in the script for that photo, rerun the script, and remove the stock-photo caption.
