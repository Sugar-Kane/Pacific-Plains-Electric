/**
 * A drawn wall toggle switch: ivory plate with a beveled edge, slotted screws,
 * a recessed opening and a rounded lever. Lever up = lights on (light theme),
 * down = lights off (dark theme). Which lever shows is decided in CSS from
 * <html data-theme>, so the drawing is right before hydration. With the lights
 * off the switch dims and the lever glows amber, like an illuminated switch.
 * Colors come from the --switch-* tokens in globals.css.
 */
const leverUp = "M25.4 50 L26.3 27.2 Q30 23.4 33.7 27.2 L34.6 50 Z";
const leverDown = "M25.4 46 L26.3 68.8 Q30 72.6 33.7 68.8 L34.6 46 Z";

export default function LightSwitchArt() {
  return (
    <svg className="ls" viewBox="0 0 60 96" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="ls-bevel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" className="ls-c-edge-hi" />
          <stop offset="1" className="ls-c-edge-lo" />
        </linearGradient>
        <linearGradient id="ls-face" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" className="ls-c-plate-hi" />
          <stop offset="1" className="ls-c-plate-lo" />
        </linearGradient>
        <radialGradient id="ls-screw" cx="0.38" cy="0.32" r="0.75">
          <stop offset="0" className="ls-c-plate-hi" />
          <stop offset="1" className="ls-c-edge-lo" />
        </radialGradient>
        <linearGradient id="ls-hole" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className="ls-c-hole-deep" />
          <stop offset="1" className="ls-c-hole" />
        </linearGradient>
        {/* Rounded lever: lit from the upper left. */}
        <linearGradient id="ls-lever" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" className="ls-c-lever-mid" />
          <stop offset="0.35" className="ls-c-lever-hi" />
          <stop offset="1" className="ls-c-lever-lo" />
        </linearGradient>
        <filter id="ls-soft" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
        <filter id="ls-halo" x="-150%" y="-80%" width="400%" height="260%">
          <feGaussianBlur stdDeviation="3.2" />
        </filter>
      </defs>

      {/* Plate: beveled rim, then the raised face */}
      <rect x="0.75" y="0.75" width="58.5" height="94.5" rx="7" fill="url(#ls-bevel)" className="ls-rim" />
      <rect x="3.6" y="3.6" width="52.8" height="88.8" rx="5" fill="url(#ls-face)" />
      <path d="M8.6 3.6 H51.4" className="ls-sheen" />

      {[12, 84].map((cy) => (
        <g key={cy}>
          <circle cx="30" cy={cy} r="3.7" fill="url(#ls-screw)" className="ls-screw" />
          <path d={`M27.3 ${cy + 0.8} L32.7 ${cy - 0.8}`} className="ls-slot" />
        </g>
      ))}

      <rect x="25" y="36" width="10" height="24" rx="1.6" fill="url(#ls-hole)" className="ls-opening" />

      <g className="ls-lever ls-lever-up">
        <ellipse cx="31" cy="51" rx="4.6" ry="5" className="ls-shadow" filter="url(#ls-soft)" />
        <path d={leverUp} fill="url(#ls-lever)" className="ls-lever-body" />
        <ellipse cx="30" cy="27.5" rx="3.5" ry="2.1" className="ls-tip-lit" />
      </g>
      <g className="ls-lever ls-lever-down">
        <ellipse cx="31" cy="73.5" rx="4.4" ry="2.8" className="ls-shadow" filter="url(#ls-soft)" />
        <path d={leverDown} fill="url(#ls-lever)" className="ls-lever-body" />
        <ellipse cx="30" cy="68.6" rx="3.5" ry="2.1" className="ls-tip-shade" />
      </g>

      {/* Lights off: the room goes dark, the lever glows */}
      <rect width="60" height="96" rx="7" className="ls-night" />
      <g className="ls-glow">
        <path d={leverDown} className="ls-glow-halo" filter="url(#ls-halo)" />
        <path d={leverDown} className="ls-glow-body" />
      </g>
    </svg>
  );
}
