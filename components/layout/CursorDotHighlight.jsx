'use client';

/**
 * CursorDotHighlight.jsx — Virus Spread Edition
 *
 * Simulates a virus infecting the dot-grid:
 *
 * • SEED     — cursor continuously infects a small cluster of dots beneath it
 * • SPREAD   — each infected dot has a random chance each frame to infect
 *              one of its 8 neighbours (like viral propagation)
 * • TENDRILS — spread is uneven by design, forming organic spiky arms
 * • TRAIL    — moving the cursor leaves behind an infected smear that fades
 * • PULSE    — each dot pulses at a unique phase for an alive / breathing look
 * • DEATH    — dots die after a randomised lifetime, creating the fading grip
 *
 * Implemented on a full-viewport <canvas> so we can draw exactly on the
 * same 24 px grid as the CSS dot background.
 */

import { useEffect, useRef } from 'react';

//  Grid config (must match CSS bg-dots spacing) 
const GRID = 24;   // px between dots
const DOT_R = 1;  // drawn dot radius in px

//  Virus tunables 
const SEED_RADIUS = 3;      // grid cells seeded directly under cursor
const SPREAD_RATE = 0.022;  // probability per frame an infected cell spreads per neighbour
const MAX_SPREAD = 10;     // max grid cells from seed (caps blast radius ≈ 432 px)
const CELL_LIFE = 260;    // max frames a cell lives (≈ 4.3 s at 60 fps)
const LIFE_JITTER = 0.65;   // randomises each cell's lifetime (0–1 multiplier range)
const MAX_CELLS = 2800;   // hard cap to keep GPU/CPU happy
const PULSE_SPEED = 0.0045; // rad/ms — speed of inner brightness pulse

export default function CursorDotHighlight() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Skip on touch screens (no cursor)
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    /**
     * Cell store: Map<"c,r", { c, r, dist, life, maxLife, bornAt }>
     *   c, r    — grid column / row
     *   dist    — how many hops from the original seed point (controls colour)
     *   life    — remaining frames
     *   maxLife — original lifetime (for ratio)
     */
    const cells = new Map();

    let mx = -9999;
    let my = -9999;
    let rafId;

    //  Helpers 

    function key(c, r) { return `${c},${r}`; }

    function addCell(c, r, dist) {
      if (cells.size >= MAX_CELLS) return;
      const k = key(c, r);
      if (cells.has(k)) return; // never overwrite — first infection wins
      const maxLife = CELL_LIFE * (LIFE_JITTER + Math.random() * (1 - LIFE_JITTER));
      cells.set(k, { c, r, dist, life: maxLife, maxLife, bornAt: performance.now() });
    }

    /** Infect a cluster of grid cells immediately around (px, py). */
    function seed(px, py) {
      const gc = Math.round(px / GRID);
      const gr = Math.round(py / GRID);
      for (let dc = -SEED_RADIUS; dc <= SEED_RADIUS; dc++) {
        for (let dr = -SEED_RADIUS; dr <= SEED_RADIUS; dr++) {
          const d = Math.sqrt(dc * dc + dr * dr);
          if (d <= SEED_RADIUS) addCell(gc + dc, gr + dr, d);
        }
      }
    }

    /** One round of viral spread — each cell may infect a neighbour. */
    function spreadVirus() {
      const toAdd = [];

      for (const [, cell] of cells) {
        if (cell.dist >= MAX_SPREAD) continue;

        // 8-directional neighbours — randomise order for organic look
        const dirs = [
          [1, 0], [-1, 0], [0, 1], [0, -1],
          [1, 1], [1, -1], [-1, 1], [-1, -1],
        ];
        for (const [dc, dr] of dirs) {
          // Spread chance is slightly higher along cardinal axes for tendril look
          const diagFactor = (dc !== 0 && dr !== 0) ? 0.72 : 1;
          const distDecay = 1 - (cell.dist / MAX_SPREAD) * 0.4; // slower near edge
          if (Math.random() > SPREAD_RATE * diagFactor * distDecay) continue;

          const nc = cell.c + dc;
          const nr = cell.r + dr;
          if (nc < 0 || nr < 0) continue;

          const nk = key(nc, nr);
          if (!cells.has(nk)) {
            toAdd.push({ c: nc, r: nr, dist: cell.dist + 1 });
          }
        }
      }

      for (const { c, r, dist } of toAdd) addCell(c, r, dist);
    }

    //  Main rAF loop 

    function draw(now) {
      ctx.clearRect(0, 0, W, H);

      // Re-seed cursor every frame (stops growing when cursor leaves)
      if (mx > 0 && my > 0) seed(mx, my);

      // Spread virus one step
      spreadVirus();

      // Draw and age all cells
      const dead = [];

      for (const [k, cell] of cells) {
        cell.life--;
        if (cell.life <= 0) { dead.push(k); continue; }

        const lifeRatio = cell.life / cell.maxLife;

        // Unique pulse phase per cell position → wave-like shimmer across the grid
        const pulse = 0.5 + 0.5 * Math.sin(now * PULSE_SPEED + cell.c * 0.9 + cell.r * 0.7);

        // Alpha: life fade × pulse
        const alpha = Math.min(1, lifeRatio * 1.4) * (0.55 + 0.45 * pulse);

        // Colour: core = vivid crimson-red; edge cells cool slightly to deep red
        const spread = cell.dist / MAX_SPREAD;          // 0 = core, 1 = edge
        const gChannel = Math.floor(15 + 45 * spread);    // small green → slightly maroon at edge
        const bChannel = Math.floor(10 + 25 * spread);

        ctx.beginPath();
        ctx.arc(cell.c * GRID, cell.r * GRID, DOT_R, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240,${gChannel},${bChannel},${alpha})`;
        ctx.fill();
      }

      // Remove dead cells
      for (const k of dead) cells.delete(k);

      rafId = requestAnimationFrame(draw);
    }

    //  Event listeners 

    function onMove(e) {
      mx = e.clientX;
      my = e.clientY;
    }

    function onLeave() {
      // Stop seeding — existing infection lingers and fades naturally
      mx = -9999;
      my = -9999;
    }

    function onResize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    }

    rafId = requestAnimationFrame(draw);
    window.addEventListener('mousemove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, }} />
  );
}