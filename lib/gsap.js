/**
 * lib/gsap.js
 * Central GSAP registration — import this ONCE (in layout.js or a provider).
 * All components then import gsap directly; plugins are already registered.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { Flip } from 'gsap/Flip';

// Guard: only register in browser context
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, Draggable, Flip);

  // Prevent GSAP lag smoothing so Lenis stays crisp
  ScrollTrigger.config({ limitCallbacks: true });
  gsap.ticker.lagSmoothing(0);
}

export { gsap, ScrollTrigger, Draggable, Flip };