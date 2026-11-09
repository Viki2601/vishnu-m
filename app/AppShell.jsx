'use client';

/**
 * AppShell.jsx
 * Client wrapper that mounts the Loader before revealing the page.
 * Handles the page-transition overlay (simple fade wipe between routes).
 * Kept separate from layout.js so layout stays a Server Component.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import Loader from '@/components/layout/Loader';
import useReducedMotion from '@/hooks/useReducedMotion';

export default function AppShell({ children }) {
  const [entered, setEntered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(null);
  const [pageVisible, setPageVisible] = useState(false);
  const overlayRef = useRef(null);
  const reduced = useReducedMotion();

  const handleEnter = () => {
    const audio = new Audio('/audio/Loading.mp3');
    audio.play().catch((error) => {
      if (error.name !== 'NotAllowedError') {
        console.error('Unable to play the loading audio:', error);
      }
    });
    setLoadingAudio(audio);
    setEntered(true);
    setLoading(true);
  };

  const handleLoadComplete = useCallback(() => {
    setLoading(false);
    setPageVisible(true);

    setTimeout(async () => {
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      ScrollTrigger.refresh();
    }, 300);
  }, []);

  useEffect(() => {
    const clickAudio = new Audio('/audio/Click.mp3');
    const playButtonSound = (event) => {
      if (!(event.target instanceof Element) || !event.target.closest('a, button, [role="button"]')) return;
      clickAudio.currentTime = 0;
      clickAudio.play().catch((error) => {
        if (error.name !== 'NotAllowedError') {
          console.error('Unable to play the click audio:', error);
        }
      });
    };

    document.addEventListener('click', playButtonSound, true);
    return () => document.removeEventListener('click', playButtonSound, true);
  }, []);

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
      <div ref={overlayRef} aria-hidden="true" style={{ position: 'fixed', inset: 0, background: '#FAFAF8', zIndex: 8999, pointerEvents: pageVisible ? 'none' : 'all', opacity: reduced && pageVisible ? 0 : 1, }} />
      {!entered && (
        <div className="entry-screen">
          <div className="entry-readout entry-readout-top" aria-hidden="true">
            <span>VIKI / PORTFOLIO SYSTEM</span>
            <span>INTERFACE 01</span>
          </div>
          <button type="button" className="entry-button" onClick={handleEnter} aria-label="Enter the portfolio">
            <span>LAB</span>
            <span className="entry-prompt">_&gt;</span>
          </button>
          <p className="entry-readout entry-readout-bottom" aria-hidden="true">
            <span>SYSTEM READY</span>
            <span>CLICK TO INITIALIZE</span>
          </p>
        </div>
      )}
      {loading && <Loader audio={loadingAudio} onComplete={handleLoadComplete} />}
      <div style={{ opacity: pageVisible ? 1 : 0, transition: reduced ? 'none' : 'opacity 0.3s ease', }}>
        {children}
      </div>
    </>
  );
}