'use client';

/**
 * MascotEyes.jsx
 * A cute emoji-style face where the pupils follow the mouse cursor.
 * Used inside the Dock's highlight button.
 * Props: size (px, default 32)
 */

import { useRef, useEffect } from 'react';
import useReducedMotion from '@/hooks/useReducedMotion';

export default function MascotEyes({ size = 32 }) {
  const leftPupilRef = useRef(null);
  const rightPupilRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let gsapInstance = null;
    let quickToLX, quickToLY, quickToRX, quickToRY;

    import('gsap').then(({ gsap }) => {
      gsapInstance = gsap;
      if (!leftPupilRef.current || !rightPupilRef.current) return;
      quickToLX = gsap.quickTo(leftPupilRef.current, 'x', { duration: 0.15, ease: 'power2.out' });
      quickToLY = gsap.quickTo(leftPupilRef.current, 'y', { duration: 0.15, ease: 'power2.out' });
      quickToRX = gsap.quickTo(rightPupilRef.current, 'x', { duration: 0.15, ease: 'power2.out' });
      quickToRY = gsap.quickTo(rightPupilRef.current, 'y', { duration: 0.15, ease: 'power2.out' });
    });

    function onMouseMove(e) {
      if (!quickToLX) return;
      const MAX_MOVE = size * 0.14;

      function movePupil(eyeEl, setX, setY) {
        const rect = eyeEl.parentElement?.getBoundingClientRect();
        if (!rect) return;
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const travel = Math.min(dist, MAX_MOVE);
        setX((dx / dist) * travel);
        setY((dy / dist) * travel);
      }

      movePupil(leftPupilRef.current, quickToLX, quickToLY);
      movePupil(rightPupilRef.current, quickToRX, quickToRY);
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [reduced, size]);

  const eyeSize = size * 0.34;
  const pupilS = eyeSize * 0.52;
  const faceRadius = size / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" focusable="false">
      {/* Face */}
      <circle cx={size / 2} cy={size / 2} r={faceRadius - 1} fill="#FFD166" />

      {/* Cheeks */}
      <circle cx={size * 0.25} cy={size * 0.65} r={size * 0.1} fill="#FFB5B5" opacity="0.7" />
      <circle cx={size * 0.75} cy={size * 0.65} r={size * 0.1} fill="#FFB5B5" opacity="0.7" />

      {/* Left eye white */}
      <circle cx={size * 0.35} cy={size * 0.42} r={eyeSize / 2} fill="white" />
      {/* Left pupil (moved via gsap) */}
      <circle ref={leftPupilRef} cx={size * 0.35} cy={size * 0.42} r={pupilS / 2} fill="#1A1A2E" />

      {/* Right eye white */}
      <circle cx={size * 0.65} cy={size * 0.42} r={eyeSize / 2} fill="white" />
      {/* Right pupil */}
      <circle ref={rightPupilRef} cx={size * 0.65} cy={size * 0.42} r={pupilS / 2} fill="#1A1A2E" />

      {/* Smile */}
      <path d={`M ${size * 0.35} ${size * 0.64} Q ${size * 0.5} ${size * 0.76} ${size * 0.65} ${size * 0.64}`} stroke="#1A1A2E" strokeWidth={size * 0.04} strokeLinecap="round" fill="none" />
    </svg>
  );
}