'use client';

/**
 * ProjectDetail.jsx
 * Client animation wrapper for the project detail page.
 * - Cover parallax
 * - Content blocks stagger reveal on scroll
 * - Case-study approach steps cascade in
 */

import { useEffect, useRef } from 'react';
import useReducedMotion from '@/hooks/useReducedMotion';

export default function ProjectDetail({ children }) {
  const wrapRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let ctx;

    import('gsap').then(async ({ gsap }) => {
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const el = wrapRef.current;
        if (!el) return;
        const cover = el.querySelector('[data-detail-cover]');
        if (cover) {
          gsap.fromTo(cover,
            { y: 0 },
            { y: 80, ease: 'none', scrollTrigger: { trigger: cover, start: 'top top', end: 'bottom top', scrub: 2 } });
        }

        const blocks = el.querySelectorAll('[data-detail-block]');
        blocks.forEach((block) => {
          gsap.fromTo(block,
            { y: 32, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: block, start: 'top 88%', once: true } });
        });

        const steps = el.querySelectorAll('[data-approach-step]');
        if (steps.length) {
          gsap.fromTo(steps,
            { scale: 0.5, opacity: 0 },
            {
              scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.8)',
              stagger: 0.12,
              scrollTrigger: { trigger: steps[0], start: 'top 85%', once: true }
            });
        }

        const chips = el.querySelectorAll('.tech-chip');
        if (chips.length) {
          gsap.fromTo(chips,
            { y: 16, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 0.35, ease: 'power2.out', stagger: 0.04,
              scrollTrigger: { trigger: chips[0], start: 'top 90%', once: true }
            });
        }

      }, wrapRef);
    });

    return () => ctx?.revert();
  }, [reduced]);

  return (
    <div ref={wrapRef} className="min-h-screen" style={{ color: 'var(--chalk)' }}>
      {children}
    </div>
  );
}