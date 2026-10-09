/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './data/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Dark canvas (black theme) ───────────────────────────────
        canvas: '#0A0A0A',   // near-black page background
        surface: '#141414',   // cards, sidebar, elevated surfaces
        surfaceAlt: '#1C1C1C',   // slightly lighter surface
        border: '#2A2A2A',   // default border colour
        chalk: '#F0EDE8',   // off-white "chalk" text
        muted: '#888888',   // secondary / placeholder text

        // ── Ink stays as alias for chalk in dark theme ──────────────
        ink: '#F0EDE8',

        // ── Sticky note palette — slightly muted / dark-adapted ─────
        // Kept vivid so notes pop against black background
        note: {
          pink: '#FF85B3',
          mint: '#5EFFA0',
          sky: '#5ECFFF',
          butter: '#FFE566',
          lilac: '#C084FF',
          peach: '#FF8C7A',
          beige: '#E8DFD0',
          white: '#F5F2EE',
        },

        // ── Accent colours ─────────────────────────────────────────
        accent: {
          purple: '#A855F7',
          red: '#F87171',
          green: '#4ADE80',
          blue: '#60A5FA',
          orange: '#FB923C',
          yellow: '#FACC15',
        },
      },

      fontFamily: {
        display: ['var(--font-caveat)', 'cursive'],
        mono: ['var(--font-space-mono)', 'monospace'],
        hand: ['var(--font-reenie)', 'cursive'],
        // Fallback — any component still using font-hand gets Reenie Beanie
      },

      boxShadow: {
        // Dark-adapted note shadows — glow instead of drop
        note: '0 2px 12px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.4)',
        'note-lift': '0 8px 32px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.5)',
        dock: '0 8px 32px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
        sidebar: '4px 0 24px rgba(0,0,0,0.5)',
        card: '0 2px 16px rgba(0,0,0,0.5)',
        'card-lift': '0 8px 40px rgba(0,0,0,0.7)',
      },

      borderRadius: {
        note: '3px',
        dock: '20px',
      },

      animation: {
        float: 'float 4s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },

      backgroundImage: {
        // Dot-grid — lighter dots on black
        dots: 'radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)',
      },
      backgroundSize: {
        dots: '24px 24px',
      },
    },
  },
  plugins: [],
};
