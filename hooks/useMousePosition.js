'use client';
import { useState, useEffect } from 'react';

/**
 * useMousePosition() — Returns the current mouse { x, y } position.
 * Used by MascotEyes to track cursor.
 */
export default function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return position;
}
