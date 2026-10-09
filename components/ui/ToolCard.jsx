'use client';

/**
 * ToolCard.jsx
 *
 * On hover → two-layer 3-D card effect:
 *
 *  ┌─────────────────────────────┐
 *  │  [card wrapper]             │  ← fixed in place, sets perspective
 *  │    ├─ [bg plate]            │  ← translateZ(-24px) on hover (sinks back / flattens)
 *  │    └─ [icon + label]        │  ← translateZ(+20px) on hover (floats on top)
 *  └─────────────────────────────┘
 *
 * Also keeps the existing proximity-magnification (dock-scale) behaviour.
 */

import { useState, useEffect, useRef } from 'react';
import useReducedMotion from '@/hooks/useReducedMotion';

/*  Proximity magnification (original behaviour)  */
const EFFECT_RADIUS = 130;
const MAX_SCALE = 1.45;

/*  Z-layer depths (px)  */
const BG_Z_HOVER = -28;   // bg plate sinks back this far
const ICON_Z_HOVER = 12;   // icon/label rises this far
const TILT_MAX = 62;   // deg — subtle mouse-track tilt on the wrapper

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
  const [hovered, setHovered] = useState(false);

  const cardRef = useRef(null);
  const bgRef = useRef(null);
  const iconRef = useRef(null);
  const gsapRef = useRef(null);
  const quickTo = useRef(null); // quickTo for scale (dock effect)
  const reduced = useReducedMotion();

  /*  Load icon  */
  useEffect(() => {
    if (!iconKey) return;
    loadIcon(iconKey).then((Ic) => setIconComponent(() => Ic));
  }, [iconKey]);

  /*  GSAP setup  */
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

  /*  Global mousemove → proximity scale  */
  useEffect(() => {
    if (reduced) return;

    function onMouseMove(e) {
      const card = cardRef.current;
      const qt = quickTo.current;
      if (!card || !qt) return;

      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.sqrt((e.clientX - cx) ** 2 + (e.clientY - cy) ** 2);
      const ratio = Math.max(0, 1 - dist / EFFECT_RADIUS);
      qt(1 + (MAX_SCALE - 1) * ratio);
    }

    function onMouseLeave() {
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

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [reduced]);

  /*  Per-card hover → Z depth effect + subtle tilt  */
  useEffect(() => {
    if (reduced) return;
    const gsap = gsapRef.current;
    if (!gsap || !bgRef.current || !iconRef.current) return;

    if (hovered) {
      // Bg plate sinks back
      gsap.to(bgRef.current, {
        translateZ: BG_Z_HOVER,
        duration: 0.38,
        ease: 'power3.out',
      });
      // Icon + label float forward
      gsap.to(iconRef.current, {
        translateZ: ICON_Z_HOVER,
        duration: 0.38,
        ease: 'power3.out',
      });
    } else {
      // Both settle back to flat
      gsap.to(bgRef.current, {
        translateZ: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.55)',
      });
      gsap.to(iconRef.current, {
        translateZ: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.55)',
      });
    }
  }, [hovered, reduced]);

  /*  Mouse-track tilt on the card wrapper  */
  function onMouseMoveCard(e) {
    if (reduced) return;
    const gsap = gsapRef.current;
    const card = cardRef.current;
    if (!gsap || !card) return;

    const rect = card.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 … 0.5
    const relY = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(card, {
      rotateY: relX * TILT_MAX,
      rotateX: -relY * TILT_MAX,
      duration: 0.25,
      ease: 'power2.out',
    });
  }

  function onMouseLeaveCard() {
    if (reduced) return;
    const gsap = gsapRef.current;
    const card = cardRef.current;
    if (!gsap || !card) return;

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.4)',
    });
    setHovered(false);
  }

  return (
    /*
     * Wrapper — provides the 3-D perspective context.
     * transform-style: preserve-3d lets children live in the same 3-D space.
     */
    <div
      ref={cardRef} className="tool-card" aria-label={name} title={name}
      style={{ willChange: 'transform', transformOrigin: 'center center', perspective: '400px', transformStyle: 'preserve-3d', position: 'relative', overflow: 'visible', background: 'transparent', border: 'none', boxShadow: 'none', padding: 0, }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={onMouseLeaveCard} onMouseMove={onMouseMoveCard}
    >
      {/*
        Background plate 
        This layer carries the visible card chrome (border, bg fill, shadow).
        On hover it pushes back in Z so it looks like the surface recedes.
      */}
      <div
        ref={bgRef} aria-hidden="true"
        style={{
          position: 'absolute', inset: 0, borderRadius: '12px', background: 'var(--surface)', border: `1.5px solid ${hovered ? color + '55' : 'var(--border)'}`,
          boxShadow: hovered ? `0 12px 40px rgba(0,0,0,0.7), 0 0 0 1px ${color}33` : '0 2px 8px rgba(0,0,0,0.4)', transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
          transformStyle: 'preserve-3d', willChange: 'transform', transform: 'translateZ(0px)',
        }}
      />

      {/*
        Icon + label 
        Float forward in Z while the bg sinks back — creates the "pop out"
        illusion without physically moving the card in the layout.
      */}
      <div
        ref={iconRef}
        style={{
          position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: '0.4rem', padding: '0.75rem 0.5rem', transformStyle: 'preserve-3d', willChange: 'transform', transform: 'translateZ(0px)',
          /* Glow behind icon when hovered */
          filter: hovered ? `drop-shadow(0 0 8px ${color}aa)` : 'none', transition: 'filter 0.3s ease',
        }}
      >
        {/* Icon */}
        <span className="text-3xl leading-none" style={{ color }} aria-hidden="true">
          {IconComponent ? (
            <IconComponent size={28} />
          ) : (
            <span className="font-mono text-base font-bold" style={{ color }}>
              {name.slice(0, 2).toUpperCase()}
            </span>
          )}
        </span>

        {/* Label */}
        <span className="font-mono text-[0.65rem] font-bold tracking-wider uppercase text-center leading-tight" style={{ color: hovered ? 'var(--chalk)' : 'var(--muted)' }}>
          {name}
        </span>
      </div>
    </div>
  );
}