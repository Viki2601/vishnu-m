'use client';
import { useRef, useEffect } from 'react';
import useReducedMotion from '@/hooks/useReducedMotion';

export default function SectionTitle({ title, id, className = '' }) {
  const wrapRef = useRef(null);
  const lineL = useRef(null);
  const lineR = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      if (lineL.current) lineL.current.style.width = '60px';
      if (lineR.current) lineR.current.style.width = '60px';
      return;
    }
    let ctx;
    import('gsap').then(async ({ gsap }) => {
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: wrapRef.current, start: 'top 85%', once: true }, });
        tl.fromTo([lineL.current, lineR.current],
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0 })
          .fromTo(wrapRef.current.querySelector('.section-title-text'),
            { y: 12, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.4');
      });
    });
    return () => ctx?.revert();
  }, [reduced]);

  return (
    <div ref={wrapRef} id={id} className={`section-title-wrap my-12 ${className}`} aria-label={title}>
      <span ref={lineL} aria-hidden="true" className="section-title-line" style={{ transformOrigin: 'right center', width: reduced ? '60px' : '0px' }} />
      <h2 className="section-title-text font-display text-3xl md:text-4xl font-bold tracking-tight text-chalk opacity-0">
        {title}
      </h2>

      <span ref={lineR} aria-hidden="true" className="section-title-line" style={{ transformOrigin: 'left center', width: reduced ? '60px' : '0px' }} />
    </div>
  );
}