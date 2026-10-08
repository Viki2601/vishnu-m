'use client';
import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { Trophy, MapPin } from 'lucide-react';
import SectionTitle from '@/components/ui/SectionTitle';
import { experience } from '@/data/experience';
import useReducedMotion from '@/hooks/useReducedMotion';

export default function Experience() {
  const sectionRef = useRef(null);
  const itemsRef = useRef([]);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let ctx;
    import('gsap').then(async ({ gsap }) => {
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        itemsRef.current.filter(Boolean).forEach((el, i) => {
          gsap.fromTo(el,
            { x: i % 2 === 0 ? -40 : 40, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.65, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 84%', once: true } });
        });
      }, sectionRef);
    });
    return () => ctx?.revert();
  }, [reduced]);

  return (
    <section id="experience" ref={sectionRef} className="py-20 px-6" aria-labelledby="experience-title">
      <SectionTitle title="My Impact in Corporate" id="experience-title" />

      <div className="max-w-3xl mx-auto relative">
        <div className="absolute left-6 top-0 bottom-0 w-px hidden md:block" style={{ background: 'var(--border)' }} aria-hidden="true" />

        <div className="flex flex-col gap-10">
          {experience?.map((job, i) => (
            <article key={job?.id} ref={(el) => { itemsRef.current[i] = el; }} className="relative md:pl-16" style={{ opacity: reduced ? 1 : 0 }} aria-label={`${job?.company} — ${job?.roles[0].title}`}>
              <div className="hidden md:flex absolute left-3.5 top-5 w-5 h-5 rounded-full items-center justify-center" style={{ background: job?.accentColor, border: '2px solid var(--surface)', boxShadow: `0 0 0 3px ${job?.accentColor}33` }} aria-hidden="true" />
              <div className="rounded-2xl p-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 2px 20px rgba(0,0,0,0.4)' }}>
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative flex-shrink-0 rounded-xl overflow-hidden" style={{ width: 52, height: 52, backgroundColor: job?.logoColor, border: '1px solid var(--border)' }}>
                    <Image src={job?.logo} alt={`${job?.company} logo`} fill sizes="52px" className="object-contain p-0.5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display font-bold text-xl leading-tight" style={{ color: job?.accentColor }}>
                        {job?.company}
                      </h3>
                      <span className="font-mono text-[0.6rem] tracking-widest uppercase rounded-full px-2 py-0.5" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--muted)' }}>
                        {job?.type}
                      </span>
                    </div>
                    <p className="flex items-center gap-1 font-mono text-[0.65rem] mt-0.5" style={{ color: 'var(--muted)' }}>
                      <MapPin size={10} aria-hidden="true" />
                      {job?.location}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mb-4">
                  {job?.roles?.map((role) => (
                    <div key={role?.title} className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <span className="font-mono text-sm font-bold text-chalk">{role?.title}</span>
                        {role?.current && (
                          <span className="ml-2 inline-flex items-center font-mono text-[0.58rem] tracking-widest uppercase rounded-full px-2 py-0.5 font-bold" style={{ background: 'rgba(74,222,128,0.15)', color: 'var(--accent-green)' }}>
                            Current
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-xs font-bold tracking-wide flex-shrink-0" style={{ color: '#C084FF' }}>
                        {role?.period}
                      </span>
                    </div>
                  ))}
                </div>

                <ul className="flex flex-col gap-2 mb-4" role="list">
                  {job?.highlights?.map((h, hi) => (
                    <li key={hi} className="flex items-start gap-2">
                      <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }} aria-hidden="true" />
                      <span className="font-mono text-xs leading-snug" style={{ color: 'rgba(240,237,232,0.75)', }}>
                        {h}
                      </span>
                    </li>
                  ))}
                </ul>

                {job?.metrics?.length > 0 && (
                  <div className="flex gap-4 flex-wrap mb-4">
                    {job?.metrics?.map((m) => (
                      <div key={m?.label} className="text-center">
                        <p className="font-display font-bold text-2xl text-chalk">{m?.value}</p>
                        <p className="font-mono text-[0.6rem] tracking-wide uppercase" style={{ color: 'var(--muted)' }}>{m?.label}</p>
                      </div>
                    ))}
                  </div>
                )}

                {job?.award && (
                  <div className="flex items-start gap-2 rounded-xl p-3 mt-2" style={{ background: `${job?.accentColor}14`, border: `1.5px solid ${job?.accentColor}30` }} role="note" aria-label="Award">
                    <Trophy size={15} style={{ color: job?.accentColor, flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
                    <p className="font-mono text-xs leading-snug" style={{ color: 'var(--chalk)' }}>
                      <strong className="font-bold">{job?.award}</strong>
                    </p>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}