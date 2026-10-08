'use client';

/**
 * AppShell.jsx
 * Client wrapper that mounts the Loader before revealing the page.
 * Handles the page-transition overlay (simple fade wipe between routes).
 * Kept separate from layout.js so layout stays a Server Component.
 */

import { useState, useEffect, useRef } from 'react';
import Loader from '@/components/layout/Loader';
import useReducedMotion from '@/hooks/useReducedMotion';

export default function AppShell({ children }) {
  const [loading, setLoading] = useState(true);
  const [pageVisible, setPageVisible] = useState(false);
  const overlayRef = useRef(null);
  const reduced = useReducedMotion();

  function handleLoadComplete() {
    setLoading(false);
    setPageVisible(true);

    if (typeof window !== 'undefined') {
      setTimeout(async () => {
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        ScrollTrigger.refresh();
      }, 300);
    }
  }

  useEffect(() => {
    if (reduced || !pageVisible) return;

    import('gsap').then(({ gsap }) => {
      if (overlayRef.current) {
        gsap.fromTo(
          overlayRef.current,
          { opacity: 1 },
          {
            opacity: 0, duration: 0.5, ease: 'power2.out',
            onComplete: () => { if (overlayRef.current) overlayRef.current.style.pointerEvents = 'none'; },
          }
        );
      }
    });
  }, [pageVisible, reduced]);

  return (
    <>
      <div ref={overlayRef} aria-hidden="true" style={{ position: 'fixed', inset: 0, background: '#FAFAF8', zIndex: 8999, pointerEvents: pageVisible ? 'none' : 'all', opacity: 1, }} />
      {loading && (<Loader onComplete={handleLoadComplete} />)}
      <div style={{ opacity: pageVisible ? 1 : 0, transition: reduced ? 'none' : 'opacity 0.3s ease', }}>
        {children}
      </div>
    </>
  );
}