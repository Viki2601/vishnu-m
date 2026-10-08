'use client';
import { useState, useEffect } from 'react';

/**
 * useReducedMotion() — Returns true when the user prefers reduced motion.
 * Use this to conditionally skip heavy animations.
 */
export default function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mql.matches);

    const handler = (e) => setReduced(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return reduced;
}
