'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, GraduationCap, Award, ExternalLink, Sun } from 'lucide-react';
import { profile } from '@/data/profile';

const DURATION = 900;
const GLOW_LEAD = 160;
const EASE = 'cubic-bezier(0.65, 0, 0.35, 1)';

const circle = (r, p) => `circle(${r}px at ${p.x}px ${p.y}px)`;
const reach = (p) => Math.hypot(Math.max(p.x, window.innerWidth - p.x), Math.max(p.y, window.innerHeight - p.y)) + 40;

// same pastel palette as the home page sticky notes
const NOTE_COLORS = ['#FFE566', '#FF8FB8', '#FF9B85', '#6AD0FF', '#6CFFA8', '#B88CFF'];
const TILTS = [-2, 1.5, -1, 2, -1.5, 1];
const SUN_GRADIENT = 'linear-gradient(90deg, #ffb347 0%, #ff5e7e 55%, #9b5cff 100%)';

// deterministic stars (no hydration surprises)
const STARS = Array.from({ length: 70 }, (_, i) => {
    const r = (n) => { const x = Math.sin(i * 999 + n) * 10000; return x - Math.floor(x); };
    return { x: r(1) * 100, y: r(2) * 65, s: 1 + r(3) * 2, d: r(4) * 4, t: 2 + r(5) * 3 };
});

const reveal = (open, delay) => ({
    opacity: open ? 1 : 0,
    transform: open ? 'none' : 'translateY(32px)',
    transition: open
        ? `opacity 700ms ease ${delay}ms, transform 700ms cubic-bezier(.2,.8,.2,1) ${delay}ms`
        : 'opacity 180ms ease, transform 180ms ease',
});

export default function EducationOverlay({ open, origin, onClose }) {
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);
    const glowRef = useRef(null);
    const panelRef = useRef(null);
    const closeBtnRef = useRef(null);
    const sunRef = useRef(null);
    const starsRef = useRef(null);
    const closePoint = useRef(null);
    const hasOpened = useRef(false);

    useEffect(() => setMounted(true), []);

    function handleClose() {
        const r = closeBtnRef.current?.getBoundingClientRect();
        closePoint.current = r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null;
        onClose();
    }

    // Esc to close
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === 'Escape' && handleClose();
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open]);

    // Sunrise / sunset
    useEffect(() => {
        const glow = glowRef.current;
        const panel = panelRef.current;
        if (!mounted || !glow || !panel) return;
        if (!open && !hasOpened.current) return;

        glow.getAnimations().forEach((a) => a.cancel());
        panel.getAnimations().forEach((a) => a.cancel());
        const base = { duration: DURATION, easing: EASE, fill: 'both' };

        if (open) {
            hasOpened.current = true;
            setVisible(true);
            const R = reach(origin);
            const frames = [{ clipPath: circle(0, origin) }, { clipPath: circle(R, origin) }];
            glow.animate(frames, base);
            panel.animate(frames, { ...base, delay: GLOW_LEAD });
            setTimeout(() => closeBtnRef.current?.focus(), DURATION * 0.6);
        } else {
            const to = closePoint.current ?? origin;
            const R = reach(origin);
            const frames = [{ clipPath: circle(R, origin) }, { clipPath: circle(0, to) }];
            panel.animate(frames, base);
            glow.animate(frames, { ...base, delay: GLOW_LEAD }).finished.then(() => setVisible(false)).catch(() => { });
        }
    }, [open]);

    // mouse parallax (direct style writes, no re-renders)
    function onMove(e) {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        if (sunRef.current) sunRef.current.style.transform = `translate(${x * -36}px, ${y * -20}px)`;
        if (starsRef.current) starsRef.current.style.transform = `translate(${x * 16}px, ${y * 10}px)`;
    }

    if (!mounted) return null;
    const hidden = { clipPath: 'circle(0px at 50% 50%)' };
    const eduCount = profile.education?.length ?? 0;
    const certCount = profile.certifications?.length ?? 0;

    return createPortal(
        <div className="fixed inset-0 z-[9999]" style={{ visibility: visible ? 'visible' : 'hidden' }} role="dialog" aria-modal="true" aria-label="Education and certifications" aria-hidden={!open}>
            <style>{`
                @keyframes edu-twinkle { 0%,100% { opacity:.15; transform:scale(.8) } 50% { opacity:1; transform:scale(1.25) } }
                @keyframes edu-spin { to { transform: rotate(360deg) } }
                @keyframes edu-breathe { 0%,100% { transform:scale(1); opacity:.85 } 50% { transform:scale(1.08); opacity:1 } }
                @keyframes edu-shoot {
                    0%, 86% { opacity:0; transform: rotate(-25deg) translateX(0) }
                    88% { opacity:1 }
                    100% { opacity:0; transform: rotate(-25deg) translateX(-520px) }
                }
                @media (prefers-reduced-motion: reduce) { .edu-anim { animation: none !important } }
            `}</style>

            <div ref={glowRef} className="absolute inset-0" style={{ ...hidden, background: 'linear-gradient(135deg, #ffb347 0%, #ff5e7e 55%, #9b5cff 100%)' }} />

            {/* main panel */}
            <div ref={panelRef} onMouseMove={onMove} className="absolute inset-0 overflow-hidden" style={{ ...hidden, background: 'linear-gradient(180deg, #07060d 0%, #130b25 55%, #2a1238 100%)' }}>

                {/* ───────── sunrise scene ───────── */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                    {/* dotted grid, like the home page */}
                    <div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                    {/* stars */}
                    <div ref={starsRef} className="absolute inset-0 transition-transform duration-300 ease-out">
                        {STARS.map((s, i) => (
                            <span key={i} className="edu-anim absolute rounded-full bg-white" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, animation: `edu-twinkle ${s.t}s ease-in-out ${s.d}s infinite` }} />
                        ))}
                        <span className="edu-anim absolute" style={{ top: '14%', left: '72%', width: 120, height: 2, background: 'linear-gradient(to right, #fff, transparent)', animation: 'edu-shoot 9s linear 2s infinite' }} />
                    </div>

                    {/* sun */}
                    <div ref={sunRef} className="absolute inset-x-0 bottom-0 transition-transform duration-300 ease-out">
                        <div className="edu-anim absolute rounded-full" style={{ width: '140vmin', height: '140vmin', left: '50%', marginLeft: '-70vmin', bottom: '-70vmin', background: 'repeating-conic-gradient(from 0deg, rgba(255,170,90,0.16) 0deg 5deg, transparent 5deg 15deg)', WebkitMaskImage: 'radial-gradient(circle, #000 15%, transparent 68%)', maskImage: 'radial-gradient(circle, #000 15%, transparent 68%)', animation: 'edu-spin 120s linear infinite' }} />
                        <div className="edu-anim absolute rounded-full" style={{ width: '90vmin', height: '90vmin', left: '50%', marginLeft: '-45vmin', bottom: '-45vmin', background: 'radial-gradient(circle, rgba(255,170,80,0.5) 0%, rgba(255,94,126,0.22) 38%, transparent 68%)', filter: 'blur(10px)', animation: 'edu-breathe 6s ease-in-out infinite' }} />
                        <div className="absolute rounded-full" style={{ width: '30vmin', height: '30vmin', left: '50%', marginLeft: '-15vmin', bottom: '-2vmin', background: 'radial-gradient(circle at 50% 40%, #fff1b8 0%, #ffc15e 40%, #ff7a59 100%)', boxShadow: '0 0 90px rgba(255,150,80,0.75)' }} />
                    </div>

                    {/* hills */}
                    <svg className="absolute inset-x-0 bottom-0 h-[18vh] w-full" viewBox="0 0 1440 200" preserveAspectRatio="none">
                        <path d="M0,120 C240,60 420,150 720,100 C1000,50 1200,140 1440,90 L1440,200 L0,200Z" fill="rgba(60,25,95,0.85)" />
                        <path d="M0,160 C260,110 520,190 800,150 C1060,115 1260,185 1440,140 L1440,200 L0,200Z" fill="rgba(18,10,32,0.96)" />
                    </svg>
                </div>

                {/* ───────── close ───────── */}
                <button ref={closeBtnRef} onClick={handleClose} aria-label="Close education and certifications" className="absolute top-6 right-6 z-10 flex h-11 w-11 items-center justify-center rounded-full transition-transform hover:rotate-90 hover:scale-110 focus-visible:ring-2 focus-visible:ring-accent-purple" style={{ background: 'var(--chalk)', color: 'var(--canvas)', boxShadow: '0 0 0 6px rgba(255,255,255,0.08), 0 8px 24px rgba(0,0,0,0.5)' }}>
                    <X size={20} aria-hidden="true" />
                </button>

                {/* ───────── content ───────── */}
                {/* data-lenis-prevent lets this area scroll natively under Lenis */}
                <div data-lenis-prevent className="relative h-full overflow-y-auto no-scrollbar overscroll-contain px-6 py-16 md:px-16">
                    <div className="mx-auto max-w-5xl pb-24">
                        <p className="flex items-center gap-2 font-mono text-xs tracking-[0.3em] uppercase" style={{ color: '#ffb347', ...reveal(open, 450) }}>
                            <Sun size={14} aria-hidden="true" /> Learning log
                        </p>

                        <h2 className="font-display mt-3 text-5xl font-bold leading-[1.05] text-chalk md:text-7xl" style={reveal(open, 520)}>
                            Education <span style={{ background: SUN_GRADIENT, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>&amp; Certifications</span>
                        </h2>

                        <p className="mt-4 max-w-xl font-mono text-sm text-chalk/70" style={reveal(open, 580)}>
                            Where I learned to build things: gears first, pixels later.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3 font-mono text-xs text-chalk" style={reveal(open, 640)}>
                            <span className="rounded-full px-4 py-1.5" style={{ border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(6px)' }}>{eduCount} education</span>
                            <span className="rounded-full px-4 py-1.5" style={{ border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(6px)' }}>{certCount} awards &amp; certs</span>
                        </div>

                        <div className="mt-14 grid gap-14 md:grid-cols-2">
                            <Column open={open} offset={0} baseDelay={700} icon={<GraduationCap size={18} />} title="Education" items={profile.education} />
                            <Column open={open} offset={3} baseDelay={780} icon={<Award size={18} />} title="Awards & Certifications" items={profile.certifications} />
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

function Column({ open, offset, baseDelay, icon, title, items = [] }) {
    return (
        <section>
            <h3 className="flex items-center gap-2 font-mono text-sm font-bold tracking-widest uppercase text-chalk" style={reveal(open, baseDelay - 60)}>
                <span style={{ color: '#ffb347' }}>{icon}</span>
                {title}
                <span className="ml-1 rounded-full px-2 py-0.5 text-[10px]" style={{ background: 'rgba(255,255,255,0.1)' }}>{items.length}</span>
            </h3>

            <ul className="relative mt-8 flex flex-col gap-9 pl-9">
                {/* timeline spine draws itself */}
                <span aria-hidden="true" className="absolute left-[7px] top-2 bottom-2 w-px origin-top" style={{ background: 'linear-gradient(to bottom, #ffb347, #ff5e7e, #9b5cff)', transform: open ? 'scaleY(1)' : 'scaleY(0)', transition: open ? `transform 1400ms ease ${baseDelay}ms` : 'transform 200ms ease' }} />

                {items.map((it, i) => {
                    const idx = i + offset;
                    const color = NOTE_COLORS[idx % NOTE_COLORS.length];
                    const tilt = TILTS[idx % TILTS.length];
                    const inProgress = /in progress/i.test(it.meta ?? '');
                    const shortMeta = it.meta && it.meta.length <= 24;

                    return (
                        <li key={it.title} className="relative" style={reveal(open, baseDelay + i * 120)}>
                            {/* timeline node */}
                            <span aria-hidden="true" className="absolute -left-9 top-7 h-[15px] w-[15px] rounded-full" style={{ background: SUN_GRADIENT, boxShadow: '0 0 0 4px #130b25, 0 0 14px rgba(255,150,80,0.7)' }}>
                                {inProgress && <span className="absolute inset-0 animate-ping rounded-full" style={{ background: '#ffb347' }} />}
                            </span>

                            {/* sticky note */}
                            <div
                                className="relative rounded-md p-5 pt-7 text-[#1a1a1a] transition-transform duration-300 ease-out [transform:rotate(var(--tilt))] hover:[transform:rotate(0deg)_translateY(-6px)_scale(1.02)]"
                                style={{ '--tilt': `${tilt}deg`, background: color, boxShadow: '0 16px 32px rgba(0,0,0,0.45)' }}
                            >
                                {/* tape */}
                                <span aria-hidden="true" className="absolute -top-3 left-1/2 h-5 w-20 -translate-x-1/2 -rotate-2" style={{ background: 'rgba(255,255,255,0.6)', boxShadow: '0 1px 3px rgba(0,0,0,0.25)' }} />

                                <h4 className="font-display text-2xl font-bold leading-tight">{it.title}</h4>
                                <p className="mt-1.5 font-mono text-sm font-semibold">{it.place ?? it.issuer}</p>

                                {it.meta && shortMeta && (
                                    <span className="mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-xs font-bold" style={{ background: 'rgba(0,0,0,0.1)' }}>
                                        {inProgress && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#1a1a1a]" />}
                                        {it.meta}
                                    </span>
                                )}
                                {it.meta && !shortMeta && <p className="mt-2 font-mono text-xs opacity-70">{it.meta}</p>}

                                {it.href && (
                                    <a href={it.href} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#1a1a1a] px-3.5 py-1.5 font-mono text-xs font-bold text-white transition-all hover:gap-2.5 hover:bg-black">
                                        View credential <ExternalLink size={12} aria-hidden="true" />
                                    </a>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}