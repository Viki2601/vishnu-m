'use client';
import { useRef, useEffect } from 'react';
import Image from 'next/image';
import SectionTitle from '@/components/ui/SectionTitle';
import StickyNote from '@/components/ui/StickyNote';
import ToolCard from '@/components/ui/ToolCard';
import SocialIcon from '@/components/ui/SocialIcon';
import { profile } from '@/data/profile';
import { tools } from '@/data/tools';
import useReducedMotion from '@/hooks/useReducedMotion';

const ABOUT_NOTES = [
  { id: 'a1', color: '#5EFFA0', style: { top: '45%', right: '70%' }, text: `Overall ~${profile.overAll} years corporate experience` },
  { id: 'a2', color: '#FFE566', style: { top: '48%', right: '56%' }, text: 'Less "ugh", more "ooh!" ✨' },
  { id: 'a3', color: '#5ECFFF', style: { bottom: '30%', right: '68%' }, text: `~${profile.experience} years Software experience` },
  { id: 'a4', color: '#C084FF', style: { bottom: '34%', right: '55%' }, text: 'These notes can move too ;)' },
  { id: 'a5', color: '#CDB4FF', style: { bottom: '20%', right: '54%' }, text: 'Obsessed with WebGL & scroll-driven stories 🌀' },
  { id: 'a6', color: '#5EFFA0', style: { bottom: '20%', right: '70%' }, text: 'Chennai / IN 📍' },
];

export default function About() {
  const sectionRef = useRef(null);
  const avatarRef = useRef(null);
  const socialsRef = useRef(null);
  const toolsRef = useRef(null);
  const noteRefs = useRef([]);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let ctx;
    import('gsap').then(async ({ gsap }) => {
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.fromTo(avatarRef.current,
          { scale: 0.85, opacity: 0, y: 24 },
          { scale: 1, opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.5)', scrollTrigger: { trigger: avatarRef.current, start: 'top 82%', once: true } });

        if (socialsRef.current) {
          gsap.fromTo(socialsRef.current.querySelectorAll('a'),
            { y: 16, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.45, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: socialsRef.current, start: 'top 85%', once: true } });
        }

        if (toolsRef.current) {
          gsap.fromTo(toolsRef.current.querySelectorAll('.tool-card'),
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: 'power2.out', scrollTrigger: { trigger: toolsRef.current, start: 'top 82%', once: true } });
        }

        noteRefs.current.filter(Boolean).forEach((el, i) => {
          gsap.fromTo(el, { x: 60, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.55, ease: 'power2.out', delay: i * 0.1, scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true } });
        });
      }, sectionRef);
    });
    return () => ctx?.revert();
  }, [reduced]);

  return (
    <section id="about" ref={sectionRef} className="relative py-20 px-6 overflow-hidden " aria-labelledby="about-title">
      <SectionTitle title="About" id="about-title" />

      <div className='flex flex-col items-center pb-12'>
        <h3 className="text-lg font-bold tracking-widest uppercase mb-4" style={{ color: 'var(--accent-purple)' }}>
          Stalk Me Here
        </h3>
        <div ref={socialsRef} className="flex gap-3 flex-wrap">
          {Object.entries(profile.social).map(([platform, href]) => (
            <SocialIcon key={platform} platform={platform} href={href} label={`${profile.casual} on ${platform}`} />
          ))}
        </div>
      </div>

      <div className="hidden lg:block" aria-hidden="true">
        {ABOUT_NOTES.map((note, i) => (
          <div key={note.id} ref={(el) => { noteRefs.current[i] = el; }} className="absolute" style={{ ...note.style, opacity: reduced ? 1 : 0, zIndex: 5 }}>
            <StickyNote color={note.color} rotation={note.rotation} draggable floating floatDelay={`${i * 0.5}s`} style={{ maxWidth: '150px', minWidth: '80px' }}>
              <p className="font-display text-lg font-bold leading-snug tracking-wider" style={{ color: '#111' }}>{note.text}</p>
            </StickyNote>
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 items-start">
        <div className="flex flex-col items-center gap-8">
          <div ref={avatarRef} className="relative" style={{ opacity: reduced ? 1 : 0 }}>
            <div className="relative rounded-full overflow-hidden" style={{ width: 150, height: 110, border: '2px solid rgba(255,255,255,0.1)', boxShadow: '4px 8px 40px rgba(0,0,0,0.7)' }}>
              <Image src={"https://w0anlcknbb.ufs.sh/f/frbi5WQIEfLA7qADR9SX0rw9Wi2UCvQgkoMfFExylcGmbOKT"} alt={`${profile.name} — yours truly`} fill sizes="200px" className="object-cover" />
            </div>

            <div className="absolute -bottom-16 left-5 flex items-end" aria-hidden="true">
              <svg width="92" height="76" viewBox="0 0 92 76" fill="none" className="shrink-0">
                <path className="arrow-shaft" pathLength="1" d="M86 66 C 52 68, 8 68, 8 40 C 8 24, 18 14, 35 7" stroke="rgba(240,237,232,0.8)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                <path className="arrow-head" d="M26 4.5 L39 7 L30 15" stroke="rgba(240,237,232,0.8)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              <span className="font-hand font-bold block -ml-1" style={{ color: 'var(--muted)', transform: 'rotate(2deg)', fontSize: '2.4rem', }}>
                Yours Truly
              </span>
            </div>
          </div>


          <div className="lg:hidden grid grid-cols-2 gap-3 w-full" aria-hidden="true">
            {ABOUT_NOTES.slice(0, 2).map((note) => (
              <StickyNote key={note.id} color={note.color} rotation={note.rotation} tapeLine={false}>
                <p className="font-display text-sm font-bold" style={{ color: '#111' }}>{note.text}</p>
              </StickyNote>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold tracking-widest uppercase mb-5" style={{ color: 'var(--accent-red)' }}>
            Tool Kit
          </h3>
          <div ref={toolsRef} className="grid grid-cols-3 sm:grid-cols-4 gap-3"
            role="list" aria-label="Technology skills">
            {tools.map((tool) => (
              <div key={tool.name} role="listitem">
                <ToolCard name={tool.name} icon={tool.icon} color={tool.color} fallbackIcon={tool.fallbackIcon} />
              </div>
            ))}
          </div>
          <p className="font- text-2xl mt-6 leading-relaxed" style={{ color: 'var(--muted)', }}>
            Always hunting for the next interesting tool - currently obsessed with WebGL and scroll-driven storytelling. 🌊
          </p>
        </div>
      </div>
    </section>
  );
}