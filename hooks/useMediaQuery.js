'use client';
import { useState, useEffect } from 'react';

/**
 * useMediaQuery(query) — Returns true when the media query matches.
 * SSR-safe: defaults to false on the server.
 *
 * Example:
 *   const isMobile = useMediaQuery('(max-width: 767px)');
 */
export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const handler = (e) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
