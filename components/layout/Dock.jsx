'use client';
import { useRef, useState, useEffect, useCallback } from 'react';
import { Home, PenLine, User, Mail, Download, } from 'lucide-react';
import MascotEyes from '@/components/ui/MascotEyes';
import { useLenis } from '@/components/layout/SmoothScrollProvider';
import useReducedMotion from '@/hooks/useReducedMotion';
import useMediaQuery from '@/hooks/useMediaQuery';

const DOCK_ITEMS = [
  { id: 'home', label: 'Home', icon: Home, href: '#hero', section: 'hero' },
  { id: 'projects', label: 'Projects', icon: PenLine, href: '/projects', section: 'projects' },
  { id: 'about', label: 'About', icon: User, href: '#about', section: 'about' },
  { id: 'contact', label: 'Contact', icon: Mail, href: '#contact', section: 'contact' },
  { id: 'resume', label: 'Résumé', icon: Download, href: 'https://w0anlcknbb.ufs.sh/f/frbi5WQIEfLAWfRkmGomHuXDzklWnVEKwJFpO8Bg36v1cjRa', section: null, download: true },
  { id: 'mascot', label: 'Viki 👋', icon: null, href: '#hero', section: 'hero', isMascot: true },
];

const MOBILE_IDS = ['home', 'projects', 'about', 'contact', 'mascot'];
const BASE_SIZE = 44;
const MAX_SIZE = 68;
const EFFECT_RAD = 120;

export default function Dock() {
  const dockRef = useRef(null);
  const itemRefs = useRef({});
  const [activeSection, setActiveSection] = useState('hero');
  const [tooltip, setTooltip] = useState(null);
  const [mounted, setMounted] = useState(false);
  const lenisRef = useLenis();
  const reduced = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const items = isMobile ? DOCK_ITEMS.filter((i) => MOBILE_IDS.includes(i.id)) : DOCK_ITEMS;

  useEffect(() => {
    setMounted(true);
    if (reduced) return;
    import('gsap').then(({ gsap }) => {
      if (!dockRef.current) return;
      gsap.fromTo(dockRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'back.out(1.4)', delay: 1.5 }
      );
    });
  }, [reduced]);

  useEffect(() => {
    const sectionIds = DOCK_ITEMS.map((i) => i.section).filter(Boolean);
    function onScroll() {
      const scrollY = window.scrollY + 140;
      let current = 'hero';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) current = id;
      }
      setActiveSection(current);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const dock = dockRef.current;
    if (!dock) return;
    let gsapInstance = null;
    import('gsap').then(({ gsap }) => { gsapInstance = gsap; });

    function onMouseMove(e) {
      if (!gsapInstance) return;
      items.forEach(({ id }) => {
        const btn = itemRefs.current[id];
        if (!btn) return;
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.sqrt((e.clientX - cx) ** 2 + (e.clientY - cy) ** 2);
        const ratio = Math.max(0, 1 - dist / EFFECT_RAD);
        const size = BASE_SIZE + (MAX_SIZE - BASE_SIZE) * ratio;
        gsapInstance.to(btn, { width: size, height: size, duration: 0.2, ease: 'power2.out', overwrite: 'auto' });
      });
    }

    function onMouseLeave() {
      if (!gsapInstance) return;
      items.forEach(({ id }) => {
        const btn = itemRefs.current[id];
        if (!btn) return;
        gsapInstance.to(btn, { width: BASE_SIZE, height: BASE_SIZE, duration: 0.35, ease: 'elastic.out(1, 0.6)', overwrite: 'auto' });
      });
    }

    dock.addEventListener('mousemove', onMouseMove);
    dock.addEventListener('mouseleave', onMouseLeave);
    return () => {
      dock.removeEventListener('mousemove', onMouseMove);
      dock.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [reduced, items]);

  const handleClick = useCallback((item) => {
    if (item.isSearch || item.download) { if (item.download) window.open(item.href, '_blank'); return; }
    if (item.href.startsWith('/') && !item.href.startsWith('/#')) {
      window.location.href = item.href;
      return;
    }
    const id = item.href.slice(1);
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = lenisRef?.current;
    if (lenis) lenis.scrollTo(el, { offset: -24, duration: 1.4 });
    else el.scrollIntoView({ behavior: 'smooth' });
  }, [lenisRef]);

  if (!mounted) return null;

  return (
    <>
      <div role="navigation" aria-label="Quick navigation dock" style={{ position: 'fixed', bottom: '1.25rem', left: '59.75%', transform: 'translateX(-50%)', zIndex: 200 }}>
        <div ref={dockRef} className="dock-bar flex items-end gap-1.5 px-3 py-2" style={{ opacity: reduced ? 1 : 0 }}>
          {items?.map((item) => {
            const Icon = item.icon;
            const isActive = item.section && activeSection === item.section;
            const isMascot = item.isMascot;

            return (
              <div key={item.id} className="relative flex flex-col items-center">
                {tooltip === item.id && (
                  <div className="absolute -top-9 left-1/2 -translate-x-1/2 font-mono text-[0.65rem] font-bold tracking-wider uppercase rounded-full px-2.5 py-1 whitespace-nowrap pointer-events-none shadow-lg" style={{ background: 'var(--chalk)', color: 'var(--canvas)' }} role="tooltip" id={`dock-tooltip-${item.id}`}>
                    {item.label}
                    <span aria-hidden="true" className="absolute top-full left-1/2 -translate-x-1/2" style={{ width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: `4px solid var(--chalk)` }} />
                  </div>
                )}

                <button ref={(el) => { itemRefs.current[item.id] = el; }} onClick={() => handleClick(item)} onMouseEnter={() => setTooltip(item.id)} onMouseLeave={() => setTooltip(null)} aria-label={item.label} aria-describedby={`dock-tooltip-${item.id}`} aria-current={isActive ? 'page' : undefined} className="flex items-center justify-center rounded-2xl transition-none focus-visible:ring-2 focus-visible:ring-accent-purple" style={{ width: BASE_SIZE, height: BASE_SIZE, flexShrink: 0, background: isMascot ? '#FF8C7A' : isActive ? 'var(--chalk)' : 'rgba(255,255,255,0.07)', color: isActive && !isMascot ? 'var(--canvas)' : 'var(--chalk)', border: !isMascot && !isActive ? '1px solid rgba(255,255,255,0.1)' : 'none', }}>
                  {isMascot ? <MascotEyes size={30} /> : <Icon size={isActive ? 20 : 18} strokeWidth={isActive ? 2.2 : 1.8} aria-hidden="true" />}
                </button>

                {isActive && (
                  <span aria-hidden="true" className="absolute -bottom-1.5 w-1 h-1 rounded-full" style={{ background: 'var(--accent-purple)' }} />
                )}
              </div>
            );
          })}
        </div>
      </div >

      <div className="built-badge" aria-label="Built with Next.js and GSAP">Built with Next.js + GSAP ✦</div>
    </>
  );
}