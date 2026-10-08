'use client';

/**
 * Loader.jsx
 * Intro screen (≤1.5s): stacked sticky notes animate in + counter.
 * Skipped on repeat visits via sessionStorage.
 * Calls onComplete() when done so the parent can unmount it.
 */

import { useEffect, useRef, useState } from 'react';
import useReducedMotion from '@/hooks/useReducedMotion';
const NOTE_COLORS = ['#FFC2DD', '#BFFFC9', '#9BE3FF', '#FFF3B0', '#CDB4FF'];
const NOTE_TEXTS = ['hey,', "I'm", 'Viki', '👋', '→'];

export default function Loader({ onComplete }) {
  const overlayRef = useRef(null);
  const notesRef = useRef([]);
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(true);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (sessionStorage.getItem('viki-loaded')) {
      onComplete?.();
      setVisible(false);
      return;
    }

    if (reduced) {
      sessionStorage.setItem('viki-loaded', '1');
      onComplete?.();
      setVisible(false);
      return;
    }

    let ctx;
    import('gsap').then(({ gsap }) => {
      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            sessionStorage.setItem('viki-loaded', '1');
            gsap.to(overlayRef.current, {
              yPercent: -105,
              duration: 0.55,
              ease: 'power3.inOut',
              onComplete: () => { setVisible(false); onComplete?.(); },
            });
          },
        });

        const obj = { val: 0 };
        tl.to(obj, {
          val: 100,
          duration: 1.0,
          ease: 'power1.inOut',
          onUpdate() { setCount(Math.round(obj.val)); },
        }, 0);

        tl.fromTo(
          notesRef.current,
          { y: -80, opacity: 0, rotation: (i) => (i % 2 === 0 ? -6 : 6) },
          { y: 0, opacity: 1, rotation: (i) => (i % 2 === 0 ? -3 : 3), duration: 0.45, ease: 'back.out(1.5)', stagger: 0.08, },
          0
        );

        tl.to({}, { duration: 0.25 });
      });
    });

    return () => ctx?.revert();
  }, [reduced, onComplete]);

  if (!visible) return null;

  return (
    <div ref={overlayRef} className="loader-overlay" aria-label="Loading portfolio" role="status">
      <div className="flex gap-3 items-end mb-8" aria-hidden="true">
        {NOTE_TEXTS?.map((text, i) => (
          <div key={i} ref={(el) => { notesRef.current[i] = el; }} className="sticky-note flex items-center justify-center" style={{ backgroundColor: NOTE_COLORS[i], width: 56 + i * 4, height: 56 + i * 4, opacity: 0, transform: `rotate(${i % 2 === 0 ? -3 : 3}deg)`, }}>
            <span className="font-display font-bold text-ink text-lg">{text}</span>
          </div>
        ))}
      </div>

      <p className="font-mono text-ink/40 text-sm tracking-widest uppercase" aria-live="polite">
        {count}%
      </p>

      <p className="font-hand text-ink/30 text-xs mt-1 tracking-wide">setting up the desk...</p>
    </div>
  );
}