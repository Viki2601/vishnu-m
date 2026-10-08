/**
 * lib/utils.js — Shared utility functions
 */

/**
 * Returns a random float between min and max (inclusive).
 */
export function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min and max (inclusive).
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Clamp a value between lo and hi.
 */
export function clamp(value, lo, hi) {
  return Math.min(Math.max(value, lo), hi);
}

/**
 * Linear interpolation between a and b by t.
 */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Map a value from one range to another.
 */
export function mapRange(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

/**
 * Generate a random rotation within the sticky-note range (-4° to 4°).
 */
export function randomNoteRotation() {
  return randomBetween(-4, 4);
}

/**
 * Assign a staggered float animation delay string.
 */
export function floatDelay(index) {
  const delays = ['0s', '0.7s', '1.4s', '0.35s', '1.05s', '1.75s'];
  return delays[index % delays.length];
}

/**
 * Note colour palette array (for cycling or random picks).
 */
export const NOTE_COLORS = [
  '#FFC2DD', // pink
  '#BFFFC9', // mint
  '#9BE3FF', // sky
  '#FFF3B0', // butter
  '#CDB4FF', // lilac
  '#FFB5B5', // peach
  '#F4EFE6', // beige
];

/**
 * Pick a colour from the palette by index (wraps around).
 */
export function noteColor(index) {
  return NOTE_COLORS[index % NOTE_COLORS.length];
}

/**
 * Copy text to clipboard; returns a Promise.
 */
export async function copyToClipboard(text) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  // Fallback
  const el = document.createElement('textarea');
  el.value = text;
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}

/**
 * Generate a CSS drop-shadow string for a note given its background colour.
 */
export function noteShadow(lifted = false) {
  return lifted
    ? '6px 12px 28px rgba(99,60,120,0.22), 0 2px 6px rgba(99,60,120,0.12)'
    : '2px 4px 12px rgba(99,60,120,0.14), 0 1px 3px rgba(99,60,120,0.08)';
}

/**
 * Check if device prefers reduced motion.
 */
export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
