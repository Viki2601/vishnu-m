'use client';

/**
 * StickyNote.jsx
 * Reusable sticky note. Props:
 *   color      – hex bg color (default butter)
 *   rotation   – CSS degrees string e.g. "2deg" (default random)
 *   width      – Tailwind width class or CSS value (default auto)
 *   className  – extra classes
 *   draggable  – wire up GSAP Draggable (default false)
 *   floating   – gentle bob animation (default false)
 *   floatDelay – animation-delay CSS value
 *   style      – inline styles (for absolute positioning)
 *   tapeLine   – show tape strip at top (default true)
 *   children   – note content
 */

import { useEffect, useRef } from 'react';
import useReducedMotion from '@/hooks/useReducedMotion';

export default function StickyNote({ color = '#FFF3B0', rotation = '0deg', width, className = '', draggable: enableDrag = false, floating = false, floatDelay = '0s', style = {}, tapeLine = true, children, }) {
  const noteRef = useRef(null);
  const dragRef = useRef(null);
  const floatRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!floating || reduced) return;
    let ctx;
    // Lazy-import gsap to avoid SSR issues
    import('gsap').then(({ gsap }) => {
      ctx = gsap.context(() => {
        floatRef.current = gsap.to(noteRef.current, {
          y: '-=6',
          duration: 3 + Math.random() * 2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: parseFloat(floatDelay),
        });
      }, noteRef);
    });
    return () => ctx?.revert();
  }, [floating, floatDelay, reduced]);

  //  GSAP Draggable 
  useEffect(() => {
    if (!enableDrag || reduced) return;
    let ctx;
    import('gsap').then(async ({ gsap }) => {
      const { Draggable } = await import('gsap/Draggable');
      gsap.registerPlugin(Draggable);
      ctx = gsap.context(() => {
        const el = noteRef.current;
        if (!el) return;
        const origRotation = parseFloat(rotation) || 0;
        dragRef.current = Draggable.create(el, {
          type: 'x,y',
          edgeResistance: 0.85,
          bounds: el.closest('.drag-bounds') || document.body,
          onDragStart() {
            floatRef.current?.pause();
            gsap.to(el, {
              scale: 1.06,
              rotation: origRotation * 0.3,
              boxShadow: '6px 12px 28px rgba(99,60,120,0.28), 0 2px 6px rgba(99,60,120,0.14)',
              duration: 0.2,
              ease: 'power2.out',
            });
            el.style.zIndex = 999;
            el.classList.add('dragging');
          },
          onDragEnd() {
            gsap.to(el, {
              scale: 1,
              rotation: origRotation,
              boxShadow: '2px 4px 12px rgba(99,60,120,0.14), 0 1px 3px rgba(99,60,120,0.08)',
              duration: 0.5,
              ease: 'elastic.out(1, 0.5)',
              onComplete: () => { el.style.zIndex = ''; el.classList.remove('dragging'); floatRef.current?.resume(); },
            });
          },
        })[0];
      }, noteRef);
    });

    return () => ctx?.revert();
  }, [enableDrag, rotation, reduced]);

  const inlineStyle = {
    backgroundColor: color,
    transform: `rotate(${rotation})`,
    ...(width ? { width } : {}),
    ...style,
  };

  return (
    <div ref={noteRef} className={`sticky-note ${floating && !reduced ? 'will-change-transform' : ''} ${className}`} style={inlineStyle} role="note">
      {tapeLine && (
        <span aria-hidden="true" style={{ position: 'absolute', top: '-9px', left: '50%', transform: 'translateX(-50%)', width: '48px', height: '16px', background: 'rgba(255,255,255,0.58)', borderRadius: '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', display: 'block', }} />
      )}
      {children}
    </div>
  );
}