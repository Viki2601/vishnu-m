'use client';

/**
 * ProjectsListClient.jsx
 * Full projects listing page with:
 *  - Header with back link
 *  - Filter tabs: All / Personal / Professional
 *  - Status badge (Live / In Development)
 *  - Bento-style polaroid cards with stagger animation
 *  - Each card links to /projects/[slug] case study
 *  - Same design tokens as the rest of the portfolio
 */

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Github, ArrowRight } from 'lucide-react';
import useReducedMotion from '@/hooks/useReducedMotion';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'personal', label: 'Personal' },
  { id: 'professional', label: 'Professional' },
];

const STATUS_STYLE = {
  live: { bg: 'rgba(74,222,128,0.12)', text: '#4ADE80', dot: '#4ADE80', label: 'Live' },
  'in-development': { bg: 'rgba(250,204,21,0.12)', text: '#FACC15', dot: '#FACC15', label: 'In Development' },
};

const ROTS = [-2, 1.5, -1, 2.5, -1.5, 1, -2.5, 2, -1, 2, -1.8, 1.2];

export default function ProjectsListClient({ projects }) {
  const [filter, setFilter] = useState('all');
  const gridRef = useRef(null);
  const headerRef = useRef(null);
  const filterRef = useRef(null);
  const reduced = useReducedMotion();
  const filtered = filter === 'all' ? projects : projects.filter((p) => p.category === filter);

  useEffect(() => {
    if (reduced) return;
    let ctx;
    import('gsap').then(({ gsap }) => {
      ctx = gsap.context(() => {
        gsap.fromTo(headerRef?.current,
          { y: -30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' });

        gsap.fromTo(filterRef?.current?.children
          ? Array.from(filterRef?.current.children) : [],
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.07, ease: 'power2.out', delay: 0.3 });
      });
    });
    return () => ctx?.revert();
  }, [reduced]);

  useEffect(() => {
    if (reduced || !gridRef?.current) return;
    import('gsap').then(({ gsap }) => {
      const cards = gridRef?.current?.querySelectorAll('.pl-card');
      if (!cards?.length) return;
      gsap.fromTo(cards,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.2)', stagger: 0.07 });
    });
  }, [filter, reduced]);

  return (
    <div className="min-h-screen" style={{ color: 'var(--chalk)' }}>
      <div ref={headerRef} className="px-6 pt-10 pb-6 max-w-6xl mx-auto" style={{ opacity: reduced ? 1 : 0 }}>
        <Link href="/#projects" className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-widest uppercase mb-8 transition-colors focus-visible:ring-2 focus-visible:ring-accent-purple rounded" style={{ color: 'var(--muted)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--chalk)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>
          <ArrowLeft size={14} aria-hidden="true" />
          Back to Portfolio
        </Link>

        <h1 className="font-display font-bold text-chalk mb-2" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1.1 }}>
          All Projects
        </h1>
        <p className="font-mono text-sm" style={{ color: 'var(--muted)' }}>
          {projects.length} projects · personal experiments, professional builds &amp; client work
        </p>
      </div>

      <div className="px-6 mb-10 max-w-6xl mx-auto">
        <div ref={filterRef} className="inline-flex gap-2 p-1 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }} role="tablist" aria-label="Filter projects by category">
          {FILTERS?.map((f) => {
            const isActive = filter === f?.id;
            const count = f?.id === 'all' ? projects?.length : projects?.filter((p) => p?.category === f?.id).length;
            return (
              <button key={f?.id} role="tab" aria-selected={isActive} onClick={() => setFilter(f?.id)} className="relative flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold tracking-widest uppercase transition-all duration-200 focus-visible:ring-2 focus-visible:ring-accent-purple" style={{ background: isActive ? 'var(--chalk)' : 'transparent', color: isActive ? 'var(--canvas)' : 'var(--muted)', }}>
                {f?.label}
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[0.6rem]" style={{ background: isActive ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.08)', color: isActive ? 'var(--canvas)' : 'var(--muted)', }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-6 pb-24 max-w-6xl mx-auto">
        {filtered?.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-3xl font-bold mb-2" style={{ color: 'var(--muted)' }}>Nothing here yet</p>
            <p className="font-mono text-xs" style={{ color: 'var(--muted)' }}>Check back soon 👀</p>
          </div>
        ) : (
          <div ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10"
            role="list" aria-label="All projects">
            {filtered?.map((project, i) => (
              <ProjectListCard key={project?.slug} project={project} index={i} reduced={reduced} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectListCard({ project, index, reduced }) {
  const cardRef = useRef(null);
  const { slug, title, tagline, cover, color = '#FFE566', tech = [], liveUrl, githubUrl, status, category, year, } = project;
  const rot = ROTS[index % ROTS.length];
  const statusCfg = STATUS_STYLE[status] || STATUS_STYLE['in-development'];

  useEffect(() => {
    if (reduced) return;
    const card = cardRef?.current;
    if (!card) return;
    const MAX = 5;

    function onMove(e) {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = ((e.clientX - left) / width - 0.5) * 2;
      const y = ((e.clientY - top) / height - 0.5) * 2;
      import('gsap').then(({ gsap }) => {
        gsap.to(card, {
          rotateY: x * MAX, rotateX: -y * MAX,
          transformPerspective: 700, duration: 0.25, ease: 'power2.out'
        });
      });
    }
    function onLeave() {
      import('gsap').then(({ gsap }) => {
        gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'elastic.out(1, 0.6)' });
      });
    }

    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
    return () => {
      card.removeEventListener('mousemove', onMove);
      card.removeEventListener('mouseleave', onLeave);
    };
  }, [reduced]);

  return (
    <div role="listitem">
      <div ref={cardRef} className="pl-card relative group" style={{ transform: `rotate(${rot}deg)`, transformStyle: 'preserve-3d', willChange: 'transform' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%) rotate(-1deg)', width: 52, height: 18, background: 'rgba(255,229,102,0.4)', borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.4)', zIndex: 1, }} />
        <div className="overflow-hidden rounded-sm" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 4px 24px rgba(0,0,0,0.55)' }}>
          <div className="relative overflow-hidden" style={{ height: 200, background: color + '18' }}>
            {cover && !cover.startsWith('/projects') ? (
              <Image src={cover} alt={`${title} cover`} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center" style={{ background: color + '20' }} aria-hidden="true">
                <span className="font-display font-bold text-chalk opacity-20" style={{ fontSize: '5rem' }}>
                  {title?.slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}

            <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full px-2.5 py-1" style={{ background: statusCfg?.bg, backdropFilter: 'blur(8px)' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: statusCfg?.dot }} aria-hidden="true" />
              <span className="font-mono text-[0.6rem] font-bold tracking-widest uppercase" style={{ color: statusCfg?.text }}>
                {statusCfg?.label}
              </span>
            </div>

            <div className="absolute top-3 right-3 rounded-full px-2.5 py-1" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)' }}>
              <span className="font-mono text-[0.6rem] font-bold tracking-widest uppercase" style={{ color: 'rgba(240,237,232,0.7)' }}>
                {category}
              </span>
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ background: 'rgba(0,0,0,0.35)' }}>
              <span className="font-mono text-xs font-bold tracking-widest uppercase rounded-full px-4 py-1.5" style={{ background: 'var(--chalk)', color: 'var(--canvas)' }}>
                View →
              </span>
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h2 className="tracking-wider font-bold text-2xl text-chalk leading-tight flex-1">
                {title}
              </h2>
              <span className="font-mono text-[0.6rem] tracking-wide flex-shrink-0 mt-1" style={{ color: 'var(--muted)' }}>
                {year}
              </span>
            </div>

            <p className="text-xl leading-snug mb-3" style={{ color: 'var(--muted)', }}>
              {tagline}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {tech?.slice(0, 3)?.map((t) => (
                <span key={t} className="tech-chip">{t}</span>
              ))}
              {tech?.length > 3 && (
                <span className="tech-chip" style={{ opacity: 0.5 }}>
                  +{tech?.length - 3}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Link href={`/projects/${slug}`} className="flex-1 flex items-center justify-center gap-1.5 font-mono text-xs font-bold tracking-wider uppercase py-2.5 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-accent-purple" style={{ background: 'var(--chalk)', color: 'var(--canvas)' }} aria-label={`View case study for ${title}`}>
                Case Study
                <ArrowRight size={12} aria-hidden="true" />
              </Link>

              {liveUrl && (
                <a href={liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${title} live`} className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-accent-purple" style={{ border: '1.5px solid var(--border)', color: 'var(--muted)' }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; e.currentTarget.style.color = 'var(--chalk)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)'; }}>
                  <ExternalLink size={14} aria-hidden="true" />
                </a>
              )}

              {githubUrl && (
                <a href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`View ${title} source code`} className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-accent-purple" style={{ border: '1.5px solid var(--border)', color: 'var(--muted)' }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; e.currentTarget.style.color = 'var(--chalk)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)'; }}>
                  <Github size={14} aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}