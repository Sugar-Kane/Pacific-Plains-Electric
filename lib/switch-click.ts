/**
 * A synthesized wall-switch click for the header theme switch, made with the
 * Web Audio API so there is no sound file to download or license.
 *
 * A rocker makes two quick snaps (leaving one side, seating on the other) plus
 * a short knock from the wall box. Turning on is pitched slightly higher than
 * turning off, as real switches are. Plays only from the visitor's own tap, and
 * fails silently where audio isn't available.
 */
let context: AudioContext | undefined;
let noise: AudioBuffer | undefined;

function audio() {
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return undefined;
  context ??= new Ctor();
  if (context.state === "suspended") void context.resume();
  if (!noise) {
    noise = context.createBuffer(1, Math.ceil(context.sampleRate * 0.05), context.sampleRate);
    const samples = noise.getChannelData(0);
    for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
  }
  return context;
}

/** A burst of filtered noise that dies away in a few milliseconds. */
function snap(ctx: AudioContext, out: AudioNode, at: number, pitch: number, level: number) {
  const source = ctx.createBufferSource();
  source.buffer = noise!;
  const band = ctx.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = pitch;
  band.Q.value = 1.4;
  const env = ctx.createGain();
  env.gain.setValueAtTime(level, at);
  env.gain.exponentialRampToValueAtTime(0.001, at + 0.022);
  source.connect(band).connect(env).connect(out);
  source.start(at);
  source.stop(at + 0.03);
}

/** A low, quickly falling knock: the switch body in the wall box. */
function knock(ctx: AudioContext, out: AudioNode, at: number, pitch: number) {
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(pitch, at);
  osc.frequency.exponentialRampToValueAtTime(pitch * 0.55, at + 0.04);
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.45, at);
  env.gain.exponentialRampToValueAtTime(0.001, at + 0.05);
  osc.connect(env).connect(out);
  osc.start(at);
  osc.stop(at + 0.06);
}

export function playSwitchClick(turningOn: boolean) {
  try {
    const ctx = audio();
    if (!ctx) return;
    const at = ctx.currentTime + 0.002;
    const out = ctx.createGain();
    out.gain.value = 0.32;
    out.connect(ctx.destination);
    snap(ctx, out, at, turningOn ? 3400 : 2800, 1);
    snap(ctx, out, at + 0.011, turningOn ? 1900 : 1600, 0.55);
    knock(ctx, out, at + 0.004, turningOn ? 200 : 170);
  } catch {
    // Audio is a nicety; the theme still changes.
  }
}
