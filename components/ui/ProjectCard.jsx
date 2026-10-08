'use client';
import { useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import useReducedMotion from '@/hooks/useReducedMotion';

export default function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const reduced = useReducedMotion();
  const { slug, title, tagline, cover, color = '#FFE566', tech = [], liveUrl } = project;

  useEffect(() => {
    if (reduced) return;
    const card = cardRef.current;
    if (!card) return;
    const MAX_TILT = 6;

    function onMouseMove(e) {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = ((e.clientX - left) / width - 0.5) * 2;
      const y = ((e.clientY - top) / height - 0.5) * 2;
      import('gsap').then(({ gsap }) => {
        gsap.to(card, {
          rotateY: x * MAX_TILT, rotateX: -y * MAX_TILT,
          transformPerspective: 600, ease: 'power2.out', duration: 0.3
        });
      });
    }
    function onMouseLeave() {
      import('gsap').then(({ gsap }) => {
        gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'elastic.out(1, 0.6)' });
      });
    }

    card.addEventListener('mousemove', onMouseMove);
    card.addEventListener('mouseleave', onMouseLeave);
    return () => {
      card.removeEventListener('mousemove', onMouseMove);
      card.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [reduced]);

  const rots = [-2, 1.5, -1, 2.5, -1.5, 1, -2.5, 2];
  const rot = rots[index % rots.length];

  return (
    <div ref={cardRef} className="project-card relative group" style={{ transform: `rotate(${rot}deg)`, transformStyle: 'preserve-3d', willChange: 'transform' }}>
      <div className="polaroid-tape" aria-hidden="true" />
      <div className="rounded-note overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 2px 16px rgba(0,0,0,0.5)' }}>
        <div className="relative overflow-hidden" style={{ height: '240px', background: color + '22' }}>
          {cover ? (
            <Image src={cover} alt={`${title} project screenshot`} fill sizes="(max-width:768px) 100vw, 320px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: color + '18' }} aria-hidden="true">
              <span className="font-display font-bold opacity-30 text-chalk" style={{ fontSize: '5rem' }}>
                {title?.slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}

          <div className="absolute inset-0 flex items-center justify-center transition-colors duration-200" style={{ background: 'rgba(0,0,0,0)' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.3)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0)'}>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-mono text-xs font-bold tracking-widest uppercase rounded-full px-4 py-1.5" style={{ background: 'var(--chalk)', color: 'var(--canvas)' }}>
              View →
            </span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-bold text-xl text-chalk leading-tight tracking-widest">{title}</h3>
          <p className="font-mono text-sm mt-0.5 leading-snug" style={{ color: 'var(--muted)', }}>{tagline}</p>

          <div className="flex flex-wrap gap-1 mt-3">
            {tech?.slice(0, 4)?.map((t) => (
              <span key={t} className="tech-chip">{t}</span>
            ))}
            {tech?.length > 4 && (
              <span className="tech-chip" style={{ opacity: 0.5 }}>+{tech?.length - 4}</span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Link href={`/projects/${slug}`} className="flex-1 text-center font-mono text-xs font-bold tracking-wider uppercase py-2 px-3 rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-accent-purple" style={{ background: 'var(--chalk)', color: 'var(--canvas)' }}>
              Case Study
            </Link>
            {liveUrl && liveUrl !== '#' && (
              <a href={liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${title} live`} className="p-2 rounded-md transition-colors" style={{ border: '1.5px solid var(--border)', color: 'var(--muted)' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                <ExternalLink size={14} aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}