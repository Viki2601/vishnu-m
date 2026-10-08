'use client';

/**
 * SmoothScrollProvider.jsx
 * Initialises Lenis smooth scroll and syncs it with GSAP ScrollTrigger.
 * Wrap this around the entire page content (inside layout.js).
 *
 * Integration pattern:
 *   lenis.on('scroll', ScrollTrigger.update)
 *   gsap.ticker.add(t => lenis.raf(t * 1000))
 *   gsap.ticker.lagSmoothing(0)
 */

import { createContext, useContext, useEffect, useRef } from 'react';
import useReducedMotion from '@/hooks/useReducedMotion';
const LenisContext = createContext(null);

export function useLenis() {
  return useContext(LenisContext);
}

export default function SmoothScrollProvider({ children }) {
  const lenisRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let lenis;
    let rafId;

    async function init() {
      const LenisModule = await import('lenis');
      const Lenis = LenisModule.default ?? LenisModule.Lenis ?? LenisModule;
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2,
      });

      lenisRef.current = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    init();

    return () => {
      if (lenis) {
        lenis.destroy();
        lenisRef.current = null;
      }
    };
  }, [reduced]);

  return (
    <LenisContext.Provider value={lenisRef}>
      {children}
    </LenisContext.Provider>
  );
}