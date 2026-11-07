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

## Pismo Beach homepage photograph
`public/images/pismo-beach.webp`: actual Pismo Beach looking north, photographed February 3, 2022 by Soundsfancy. Source: https://commons.wikimedia.org/wiki/File:Pismobeach02032022.jpg. Licensed CC BY-SA 4.0: https://creativecommons.org/licenses/by-sa/4.0/. Resized and converted from JPEG to WebP; displayed cropped with a readability overlay. The adapted image retains CC BY-SA 4.0. Visible attribution appears on English and Spanish homepages. This is a location photograph, not a photograph of the business's completed work.

County map includes geographic polygons for FIPS 06079 and 06083 from https://github.com/plotly/datasets/blob/master/geojson-counties-fips.json. Santa Barbara includes offshore islands. Its projection is fitted to the existing EPSG:3310 map coordinates with maximum alignment error under 0.006 SVG units.

## Header light switch photos
`public/images/switch/switch-on.webp` and `switch-off.webp`: cropped from the light-room/dark-room picture of a white rocker (Decora-style) switch on a screwless plate that the site owner supplied on 2026-11-07 for the theme switch. Each half was cropped to the plate (2px inside its edges), resized to 250×400 and converted to WebP. The owner should confirm they have the rights to use that image; to replace it, crop a new pair to the same 5:8 plate shape and keep the file names.
`paddle-on.webp` and `paddle-off.webp` are the rocker paddle cut from each of those photos at its exact position (`node scripts/build-switch-paddles.mjs`), so the paddle can pivot on its centre line when the visitor flips the switch while the plate stays still. Rerun the script after replacing the photos.

## Home service card photos
`assets/service-photos/*.webp` are the six concept images (plus a rocker-switch reference) the site owner supplied on 2026-11-07 as visual direction for the service cards, converted to WebP. They are image-generated concept pictures, not photos of Pacific Plains Electric work, and the owner should confirm the rights to use them. `node scripts/build-service-media.mjs` turns them into the layered files in `public/images/services/` and the layer positions in `components/service-media.json`; the motion itself is CSS in `app/service-animations.css`.

What the script changes, and why:
- **Repairs** (`outlet-tester.webp`): the tester (body, traced cone and nose) and its contact shadow are lifted into their own layer, with the tip LED turned off; the lit tip is a second layer. The wall and receptacle behind the tool are rebuilt (stucco from higher on the same wall, the receptacle's right half from the identical lower receptacle). The tip sits beside the hot (narrow) slot and never enters it.
- **Panels** (`panel-open.webp`): the open door is removed and rebuilt as a CSS 3D door. Its inside face is the photographed door, rectified; the camera (perspective, eye height, ~116° opening) was solved from the photo so the open door lands where it was photographed. The photographed door was a little short for its opening, so the 3D door is sized to the opening. The outside face is synthesized from the trim's own paint and light (a formed lip, a flush latch) because no closed-door photo exists. The dead-front stays installed throughout.
- **EV charger** (`ev-charger.webp`): the owner's later, wider garage picture (supplied 2026-11-07 to replace the first EV image), cropped from 3:2 to the cards' 4:3 frame (keeping the charger and the whole car) and resized to 1448×1086. The status light is dimmed in the base image and the lit light is a separate layer. The cable's centre line is traced from the photo (a rough hand trace refined to the darkest run across it) so the cable can glow from the charger to the inlet with brighter charging pulses running along it into the car; both are drawn in code over the photo, and with reduced motion only a steady glow remains.
- **Lighting** (`dimmer-pendant.webp`): the slider knob is its own layer; the dimmed layer darkens only the pendant's glow, the wall it lights and the countertop reflections, leaving window daylight as photographed.
- **Remodeling** (`remodel-rough-in.webp`): the source showed receptacles already installed in the open boxes, which doesn't happen at rough-in, so the boxes are emptied and given folded conductors and sheath stubs (drawn). The finished view rebuilds the open bay as painted drywall and baseboard from the same room's finished wall, with receptacles at the box positions, so both views share one camera.
- **Multimeter** (`multimeter.webp`): the photographed LCD digits are removed (the "~" and "V AC" legends stay) and `components/service-animation.tsx` draws exact seven-segment digits measured from the photo. Verified in the source: black lead in COM, red in VΩHz, dial on V~, black probe in the neutral (wide) slot, red in the hot (narrow) slot.
