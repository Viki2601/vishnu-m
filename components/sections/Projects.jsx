'use client';
import { useRef, useEffect } from 'react';
import Link from 'next/link';
import SectionTitle from '@/components/ui/SectionTitle';
import ProjectCard from '@/components/ui/ProjectCard';
import { projects } from '@/data/projects';
import useReducedMotion from '@/hooks/useReducedMotion';

export default function Projects() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let ctx;
    import('gsap').then(async ({ gsap }) => {
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        const cards = gridRef.current?.querySelectorAll('.project-card');
        if (!cards?.length) return;
        const rots = [-2, 1.5, -1, 2.5, -1.5, 1, -2.5, 2];
        gsap.fromTo(cards,
          { y: 50, opacity: 0, rotation: (i) => rots[i % rots.length] },
          {
            y: 0, opacity: 1, rotation: (i) => rots[i % rots.length],
            duration: 0.65, ease: 'back.out(1.2)', stagger: 0.1,
            scrollTrigger: { trigger: gridRef.current, start: 'top 82%', once: true },
          });
      }, sectionRef);
    });
    return () => ctx?.revert();
  }, [reduced]);

  const featured = projects?.slice(0, 4);

  return (
    <section id="projects" ref={sectionRef} className="py-20 px-6" aria-labelledby="projects-title">
      <SectionTitle title="Selected Work" id="projects-title" />

      <p className="text-center text-xl -mt-6 mb-10 max-w-lg mx-auto leading-relaxed" style={{ color: 'var(--muted)' }}>
        A handful of things I&apos;ve built — from WebGL playgrounds to scroll-driven stories.
      </p>

      <div ref={gridRef} className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10" role="list" aria-label="Featured projects">
        {featured?.map((project, i) => (
          <div key={project?.slug} role="listitem">
            <ProjectCard project={project} index={i} />
          </div>
        ))}
      </div>

      <div className="text-center mt-14 flex flex-wrap items-center justify-center gap-4">
        <Link href="/projects" className="inline-flex items-center gap-2 font-mono text-sm font-bold tracking-widest uppercase px-7 py-3 rounded-xl transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-accent-purple" style={{ background: 'var(--chalk)', color: 'var(--canvas)' }} aria-label={`View all ${projects?.length} projects`}>
          View All Projects ({projects?.length}) →
        </Link>

        <a href="https://github.com/Viki2601" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-widest uppercase transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-accent-purple rounded" style={{ color: 'var(--muted)', borderBottom: '1px dashed rgba(255,255,255,0.15)', paddingBottom: '2px' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--chalk)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>
          More on GitHub ↗
        </a>
      </div>
    </section>
  );
}