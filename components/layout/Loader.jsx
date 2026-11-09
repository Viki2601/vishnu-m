'use client';

/**
 * Loader.jsx
 * Intro screen shown on every visit before the page is revealed.
 * Calls onComplete() when done so the parent can unmount it.
 */

import { useEffect, useRef, useState } from 'react';
const NOTE_COLORS = ['#FFC2DD', '#BFFFC9', '#9BE3FF', '#FFF3B0', '#CDB4FF'];
const NOTE_TEXTS = ['hey,', "I'm", 'Viki', '👋', '→'];

export default function Loader({ audio: initialAudio, onComplete }) {
  const overlayRef = useRef(null);
  const notesRef = useRef([]);
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const audio = initialAudio ?? new Audio('/audio/Loading.mp3');
    const playAudio = () => {
      audio.play().catch((error) => {
        if (error.name !== 'NotAllowedError') {
          console.error('Unable to play the loading audio:', error);
        }
      });
    };
    const retryAudio = () => {
      if (audio.paused) playAudio();
    };
    const stopAudio = () => {
      window.removeEventListener('pointerdown', retryAudio);
      window.removeEventListener('keydown', retryAudio);
      audio.pause();
      audio.currentTime = 0;
    };

    if (audio.paused) playAudio();
    window.addEventListener('pointerdown', retryAudio, { once: true });
    window.addEventListener('keydown', retryAudio, { once: true });

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      notesRef.current.forEach((note) => {
        if (note) note.style.opacity = '1';
      });
      const progressInterval = window.setInterval(() => {
        setCount((current) => Math.min(current + 1, 100));
      }, 25);
      const timeout = window.setTimeout(() => {
        window.clearInterval(progressInterval);
        setVisible(false);
        onComplete?.();
      }, 2500);

      return () => {
        window.clearInterval(progressInterval);
        window.clearTimeout(timeout);
        stopAudio();
      };
    }

    let ctx;
    import('gsap').then(({ gsap }) => {
      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => {
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
          duration: 2.5,
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

    return () => {
      ctx?.revert();
      stopAudio();
    };
  }, [initialAudio, onComplete]);

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