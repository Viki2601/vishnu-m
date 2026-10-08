'use client';

/**
 * ToolCard.jsx
 * Tool card with macOS-dock-style proximity magnification.
 * Each card independently tracks cursor distance from its own centre
 * and scales up — identical mechanic to the Dock component.
 */

import { useState, useEffect, useRef } from 'react';
import useReducedMotion from '@/hooks/useReducedMotion';

/* How far (px) the cursor influence reaches */
const EFFECT_RADIUS = 130;
/* Max scale at cursor centre */
const MAX_SCALE = 1.45;

async function loadIcon(iconKey) {
  try {
    const si = await import('react-icons/si');
    return si[iconKey] || null;
  } catch {
    return null;
  }
}

export default function ToolCard({ name, icon: iconKey, color = '#F0EDE8' }) {
  const [IconComponent, setIconComponent] = useState(null);
  const cardRef  = useRef(null);
  const gsapRef  = useRef(null);
  const quickTo  = useRef(null); // gsap.quickTo for scale
  const reduced  = useReducedMotion();

  /* Load icon */
  useEffect(() => {
    if (!iconKey) return;
    loadIcon(iconKey).then((Ic) => setIconComponent(() => Ic));
  }, [iconKey]);

  /* Set up gsap.quickTo once mounted */
  useEffect(() => {
    if (reduced) return;
    import('gsap').then(({ gsap }) => {
      gsapRef.current = gsap;
      if (cardRef.current) {
        quickTo.current = gsap.quickTo(cardRef.current, 'scale', {
          duration: 0.2,
          ease: 'power2.out',
        });
      }
    });
  }, [reduced]);

  /* Global mousemove → calculate distance → drive scale */
  useEffect(() => {
    if (reduced) return;

    function onMouseMove(e) {
      const card = cardRef.current;
      const qt   = quickTo.current;
      if (!card || !qt) return;

      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dist = Math.sqrt((e.clientX - cx) ** 2 + (e.clientY - cy) ** 2);

      // 0 at cursor centre → 1 at EFFECT_RADIUS edge
      const ratio = Math.max(0, 1 - dist / EFFECT_RADIUS);
      const scale = 1 + (MAX_SCALE - 1) * ratio;

      qt(scale);
    }

    function onMouseLeave() {
      const qt = quickTo.current;
      if (!qt) return;
      // Elastic settle back to 1
      import('gsap').then(({ gsap }) => {
        if (cardRef.current) {
          gsap.to(cardRef.current, {
            scale: 1,
            duration: 0.45,
            ease: 'elastic.out(1, 0.5)',
          });
        }
      });
    }

    window.addEventListener('mousemove',  onMouseMove,  { passive: true });
    window.addEventListener('mouseleave', onMouseLeave, { passive: true });
    return () => {
      window.removeEventListener('mousemove',  onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [reduced]);

  return (
    <div
      ref={cardRef}
      className="tool-card"
      aria-label={name}
      title={name}
      style={{
        /* Ensure transform doesn't affect layout of siblings */
        willChange: 'transform',
        transformOrigin: 'center center',
      }}
    >
      {/* Icon */}
      <span
        className="text-3xl leading-none"
        style={{ color }}
        aria-hidden="true"
      >
        {IconComponent ? (
          <IconComponent size={28} />
        ) : (
          <span className="font-mono text-base font-bold" style={{ color }}>
            {name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </span>

      {/* Label */}
      <span
        className="font-mono text-[0.65rem] font-bold tracking-wider uppercase text-center leading-tight"
        style={{ color: 'var(--muted)' }}
      >
        {name}
      </span>
    </div>
  );
}
