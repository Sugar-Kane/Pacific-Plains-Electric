/**
 * The theme switch, shown as photos of a real wall toggle: lever up ("ON") for
 * the light theme, lever down ("OFF", in a dim room) for the dark theme. Both
 * images are in the page and CSS on <html data-theme> shows one, so the right
 * position is visible before hydration. Photos: public/images/switch/ (see
 * docs/ASSETS.md).
 */
export default function LightSwitchArt() {
  return (
    <span className="ls" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element -- tiny fixed-size images that must swap instantly by CSS */}
      <img className="ls-on" src="/images/switch/switch-on.webp" alt="" width={240} height={400} decoding="async" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="ls-off" src="/images/switch/switch-off.webp" alt="" width={240} height={400} decoding="async" />
    </span>
  );
}
