'use client';
import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import StickyNote from '@/components/ui/StickyNote';
import { profile } from '@/data/profile';
import useReducedMotion from '@/hooks/useReducedMotion';

const HERO_NOTES = [
  { id: 'n1', color: '#FFE566', rotation: '-3deg', style: { top: '8%', left: '15%' }, text: 'Lead Frontend @ MAI Corporation', subtext: 'UK SaaS & e-commerce', accentColor: '#7C3AED', },
  { id: 'n2', color: '#FF85B3', rotation: '2.5deg', style: { top: '5%', right: '8%' }, text: 'Move these sticky notes around — just like I do with pixels 😆', },
  { id: 'n3', color: '#5EFFA0', rotation: '-2deg', style: { bottom: '2%', left: '8%' }, text: 'Mechanical engineer turned dev.', subtext: 'Googled my way here. 🔍', },
  { id: 'n4', color: '#C084FF', rotation: '3.5deg', style: { bottom: '5%', right: '16%' }, text: 'Trailblazer Award winner 🏆', subtext: 'Code review standards, sprint workflows, reusable components', accentColor: '#7C3AED', },
  { id: 'n5', color: '#5ECFFF', rotation: '-1.5deg', style: { top: '46%', right: '5%' }, text: 'Previously @ Caterpillar & Wabco', subtext: 'quality / aftermarket', },
  { id: 'n6', color: '#FF8C7A', rotation: '2deg', style: { top: '42%', left: '3%' }, text: 'BCA @ University of Madras 🎓', },
];

export default function Hero() {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const subtitleRef = useRef(null);
  const pillRef = useRef(null);
  const noteRefs = useRef([]);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      [headlineRef, subtitleRef, pillRef].forEach((r) => {
        if (r.current) r.current.style.opacity = '1';
      });
      noteRefs.current.forEach((n) => { if (n) n.style.opacity = '1'; });
      return;
    }

    let ctx;
    import('gsap').then(({ gsap }) => {
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.fromTo(pillRef.current,
          { y: -16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 0.3);

        const words = headlineRef.current?.querySelectorAll('.word');
        if (words?.length) {
          tl.fromTo(words,
            { y: 40, opacity: 0, rotation: 4 },
            { y: 0, opacity: 1, rotation: 0, duration: 0.65, stagger: 0.08 },
            0.55);
        }

        tl.fromTo(subtitleRef.current,
          { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.2');

        tl.fromTo(noteRefs.current.filter(Boolean),
          { y: -100, opacity: 0, rotation: 0 },
          {
            y: 0, opacity: 1,
            rotation: (i) => ([-3, 2.5, -2, 3.5, -1.5, 2])[i % 6],
            duration: 0.8, ease: 'elastic.out(1, 0.55)', stagger: 0.1,
          }, 0.7);
      }, sectionRef);
    });

    return () => ctx?.revert();
  }, [reduced]);

  return (
    <section id="hero" ref={sectionRef} className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 overflow-hidden drag-bounds" aria-labelledby="hero-headline">
      <div className="hidden md:block" aria-hidden="true">
        {HERO_NOTES?.map((note, i) => (
          <div key={note?.id} ref={(el) => { noteRefs.current[i] = el; }} className="absolute" style={{ ...note?.style, opacity: reduced ? 1 : 0, zIndex: 5 }}>
            <StickyNote color={note?.color} rotation={note?.rotation} draggable floating floatDelay={`${i * 0.4}s`} style={{ maxWidth: '220px', minWidth: '160px' }}>
              {note?.accentColor && (
                <span className="block font-mono text-[0.6rem] font-bold tracking-widest uppercase mb-1" style={{ color: note?.accentColor }}>●</span>
              )}
              <p className="font-display text-xl leading-snug font-bold" style={{ color: '#111' }}>{note?.text}</p>
              {note?.subtext && (
                <p className="font-mono text-[0.65rem] mt-1 tracking-wide" style={{ color: '#333' }}>{note?.subtext}</p>
              )}
            </StickyNote>
          </div>
        ))}
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <div ref={pillRef} className="inline-flex items-center gap-2" style={{ opacity: reduced ? 1 : 0 }}>
          <Link href={profile.featuredProject.href} className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-mono font-bold tracking-wide transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-accent-purple" style={{ background: 'var(--surface-alt)', color: 'var(--chalk)', border: '1px solid var(--border)' }}>
            <Sparkles size={13} style={{ color: 'var(--accent-purple)' }} aria-hidden="true" />
            {profile.featuredProject.label}
            <ArrowRight size={13} aria-hidden="true" />
          </Link>
        </div>

        <h1 id="hero-headline" ref={headlineRef} className="font-display font-bold text-chalk leading-tight mb-4" style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)', }} aria-label={`hey, I'm ${profile.casual}`}>
          {["hey,", "I'm", profile.casual].map((w) => (
            <span key={w} className="word inline-block mr-[0.18em] last:mr-0" style={{ display: 'inline-block' }} aria-hidden="true">
              {w}
            </span>
          ))}
        </h1>

        <p ref={subtitleRef} className="font-mono text-sm md:text-base tracking-[0.2em] uppercase font-bold" style={{ opacity: reduced ? 1 : 0, color: 'var(--muted)', letterSpacing: '0.18em' }}>
          {profile.tagline}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <a href="#projects" onClick={(e) => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }} className="font-mono text-sm font-bold tracking-wider uppercase px-6 py-3 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-accent-purple" style={{ background: 'var(--chalk)', color: 'var(--canvas)' }}>
            See My Work
          </a>
          <a href={`mailto:${profile.email}`} className="font-mono text-sm font-bold tracking-wider uppercase px-6 py-3 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-accent-purple" style={{ border: '2px solid rgba(255,255,255,0.15)', color: 'var(--chalk)' }}>
            Get in Touch
          </a>
        </div>
      </div>

      <div className="md:hidden mt-12 grid grid-cols-2 gap-3 w-full max-w-sm mx-auto" aria-hidden="true">
        {HERO_NOTES.slice(0, 4).map((note) => (
          <StickyNote key={note?.id} color={note?.color} rotation={note?.rotation} tapeLine={false}>
            <p className="font-display text-sm leading-snug font-bold" style={{ color: '#111' }}>
              {note?.text}
            </p>
          </StickyNote>
        ))}
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        style={{ opacity: 0.25 }} aria-hidden="true">
        <span className="font-mono text-[0.6rem] tracking-widest uppercase" style={{ color: 'var(--chalk)' }}>
          scroll
        </span>
        <span className="w-px h-8 rounded-full animate-bounce" style={{ background: 'rgba(240,237,232,0.4)' }} />
      </div>
    </section>
  );
}