'use client';

/**
 * Cursor.jsx
 * Custom cursor: small dot + lagging ring.
 * Uses gsap.quickTo for maximum smoothness.
 * Hidden on touch devices via CSS (pointer: coarse).
 */

import { useEffect, useRef } from 'react';
import useReducedMotion from '@/hooks/useReducedMotion';

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch || reduced) return;

    let dotX, dotY, ringX, ringY;

    import('gsap').then(({ gsap }) => {
      const dot = dotRef.current;
      const ring = ringRef.current;
      if (!dot || !ring) return;

      dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'none' });
      dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'none' });
      ringX = gsap.quickTo(ring, 'x', { duration: 0.22, ease: 'power2.out' });
      ringY = gsap.quickTo(ring, 'y', { duration: 0.22, ease: 'power2.out' });

      function onMove(e) {
        dotX(e.clientX);
        dotY(e.clientY);
        ringX(e.clientX);
        ringY(e.clientY);
      }

      function onEnter(e) {
        const el = e.target;
        const isInteractive =
          el.closest('a, button, [role="button"], input, textarea, select, label, [tabindex]');
        if (isInteractive) {
          ring.classList.add('hover');
          gsap.to(dot, { scale: 0.4, duration: 0.2 });
        }
      }
      function onLeave() {
        ring.classList.remove('hover');
        gsap.to(dot, { scale: 1, duration: 0.2 });
      }

      function onMouseDown() {
        gsap.to([dot, ring], { opacity: 0.5, scale: 0.8, duration: 0.1 });
      }
      function onMouseUp() {
        gsap.to([dot, ring], { opacity: 1, scale: 1, duration: 0.15 });
      }

      window.addEventListener('mousemove', onMove, { passive: true });
      document.addEventListener('mouseover', onEnter);
      document.addEventListener('mouseout', onLeave);
      window.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mouseup', onMouseUp);

      dot.style.opacity = '1';
      ring.style.opacity = '0.5';

      return () => {
        window.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseover', onEnter);
        document.removeEventListener('mouseout', onLeave);
        window.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mouseup', onMouseUp);
      };
    });
  }, [reduced]);

  if (reduced) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" style={{ opacity: 0 }} />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" style={{ opacity: 0 }} />
    </>
  );
}