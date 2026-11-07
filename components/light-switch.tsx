/**
 * The theme switch, shown as photos of a real wall rocker switch: the lit room
 * for the light theme, the same switch flipped in a dim room for the dark theme. Both
 * images are in the page and CSS on <html data-theme> shows one, so the right
 * position is visible before hydration. The paddle is a separate layer cut from
 * each photo (scripts/build-switch-paddles.mjs) so it can pivot on its centre line
 * when the visitor flips it; it never moves on its own. Photos:
 * public/images/switch/ (see docs/ASSETS.md).
 */
export default function LightSwitchArt() {
  return (
    <span className="ls" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element -- tiny fixed-size images that must swap instantly by CSS */}
      <img className="ls-on" src="/images/switch/switch-on.webp" alt="" width={250} height={400} decoding="async" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="ls-off" src="/images/switch/switch-off.webp" alt="" width={250} height={400} decoding="async" />
      <span className="ls-paddle">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="ls-on" src="/images/switch/paddle-on.webp" alt="" width={108} height={242} decoding="async" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="ls-off" src="/images/switch/paddle-off.webp" alt="" width={108} height={242} decoding="async" />
      </span>
    </span>
  );
}
