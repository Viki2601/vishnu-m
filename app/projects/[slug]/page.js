/**
 * app/projects/[slug]/page.js  — Server Component
 * Full project detail page using every field from /data/projects?.js
 */

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github, ArrowRight, Calendar, User, Tag, } from "lucide-react";
import { projects } from "@/data/projects";
import ProjectDetail from "./ProjectDetail";

export async function generateStaticParams() {
  return projects?.map((p) => ({ slug: p?.slug }));
}

export async function generateMetadata({ params }) {
  const project = projects?.find((p) => p?.slug === params.slug);
  if (!project) return {};
  return {
    title: `${project?.title} — Viki`,
    description: project?.description,
    openGraph: { title: `${project?.title} — Viki`, description: project?.description, images: project?.cover ? [{ url: project?.cover }] : [], },
  };
}

const STATUS_STYLE = {
  live: { bg: "rgba(74,222,128,0.12)", text: "#4ADE80", dot: "#4ADE80", label: "Live", },
  "in-development": { bg: "rgba(250,204,21,0.12)", text: "#FACC15", dot: "#FACC15", label: "In Development", },
};

export default function ProjectPage({ params }) {
  const project = projects?.find((p) => p?.slug === params.slug);
  if (!project) notFound();
  const { title, tagline, description, cover, color = "#FFE566", tech = [], role, year, liveUrl, githubUrl, challenges, outcome, status, category, caseStudy, } = project;
  const statusCfg = STATUS_STYLE[status] || STATUS_STYLE["in-development"];
  const related = projects?.filter((p) => p.slug !== project?.slug && p.category === category).slice(0, 3);
  const idx = projects?.findIndex((p) => p.slug === project?.slug);
  const prev = projects[idx - 1] || null;
  const next = projects[idx + 1] || null;

  return (
    <ProjectDetail>
      <div className="sticky top-0 z-40 flex items-center justify-between px-6 py-3" style={{ background: "rgba(10,10,10,0.88)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderBottom: "1px solid var(--border)", }}>
        <Link href="/projects" className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-widest uppercase transition-colors focus-visible:ring-2 focus-visible:ring-accent-purple rounded" style={{ color: "var(--muted)" }} aria-label="Back to all projects">
          <ArrowLeft size={14} aria-hidden="true" />
          All Projects
        </Link>

        <div className="flex items-center gap-3">
          {prev && (
            <Link href={`/projects/${prev?.slug}`} className="font-mono text-[0.65rem] font-bold tracking-widest uppercase transition-colors focus-visible:ring-2 focus-visible:ring-accent-purple rounded" style={{ color: "var(--muted)" }} aria-label={`Previous: ${prev?.title}`}>
              ← Prev
            </Link>
          )}
          {prev && next && <span style={{ color: "var(--border)" }}>|</span>}
          {next && (
            <Link href={`/projects/${next?.slug}`} className="font-mono text-[0.65rem] font-bold tracking-widest uppercase transition-colors focus-visible:ring-2 focus-visible:ring-accent-purple rounded" style={{ color: "var(--muted)" }} aria-label={`Next: ${next?.title}`}>
              Next →
            </Link>
          )}
        </div>
      </div>

      <div className="relative w-full overflow-hidden" style={{ height: "clamp(260px, 42vw, 560px)", background: color + "22", }} data-detail-cover>
        {cover && !cover?.startsWith("/projects") ? (
          <Image src={cover} alt={`${title} project cover`} fill sizes="100vw" className="object-cover" priority />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <span className="font-display font-bold text-chalk select-none" style={{ fontSize: "clamp(5rem, 14vw, 12rem)", opacity: 0.07 }}>
              {title?.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-32" style={{ background: "linear-gradient(to bottom, transparent, var(--canvas))", }} aria-hidden="true" />
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-24">
        <div className="pt-8 pb-10" data-detail-block>
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1" style={{ background: statusCfg?.bg }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: statusCfg?.dot }} aria-hidden="true" />
              <span className="font-mono text-[0.6rem] font-bold tracking-widest uppercase" style={{ color: statusCfg?.text }}>
                {statusCfg?.label}
              </span>
            </span>
            <span className="font-mono text-[0.6rem] font-bold tracking-widest uppercase rounded-full px-3 py-1" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", color: "var(--muted)", }}>
              {category}
            </span>
          </div>

          <h1 className="font-mono font-bold text-chalk leading-none mb-2" style={{ fontSize: "clamp(2.8rem, 7vw, 5rem)" }}>
            {title}
          </h1>
          <p className="font-sans leading-relaxed" style={{ fontSize: "clamp(1.1rem, 2.5vw, 1rem)", color: "var(--muted)", }}>
            {tagline}
          </p>

          <div className="flex items-center gap-5 mt-5 flex-wrap">
            <span className="flex items-center gap-1.5 font-mono text-xs"style={{ color: "var(--muted)" }}>
              <Calendar size={12} aria-hidden="true" />
              {year}
            </span>
            <span className="flex items-center gap-1.5 font-mono text-xs"style={{ color: "var(--muted)" }}>
              <User size={12} aria-hidden="true" />
              {role}
            </span>
            <span className="flex items-center gap-1.5 font-mono text-xs" style={{ color: "var(--muted)" }}>
              <Tag size={12} aria-hidden="true" />
              {tech?.length} technologies
            </span>
          </div>
        </div>

        <hr style={{ borderColor: "var(--border)" }} className="mb-10" />

        <div className="mb-10" data-detail-block>
          <p className="font-mono leading-relaxed" style={{ fontSize: "clamp(1.1rem, 2.2vw, 1rem)", color: "rgba(240,237,232,0.8)", lineHeight: 1.7, }}>
            {description}
          </p>
        </div>

        <div className="mb-12" data-detail-block>
          <h2 className="font-mono text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "var(--accent-purple)" }}>
            Stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {tech?.map((t) => (
              <span key={t} className="tech-chip" style={{ fontSize: "0.75rem", padding: "0.3rem 0.8rem" }}>{t}</span>
            ))}
          </div>
        </div>

        {caseStudy && (
          <div className="mb-12 rounded-2xl overflow-hidden" data-detail-blockstyle={{ border: "1px solid var(--border)" }}>
            <div className="px-6 py-3 flex items-center gap-2" style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", }}>
              <span className="font-mono text-[0.65rem] font-bold tracking-widest uppercase" style={{ color: "var(--muted)" }}>
                📋 Case Study
              </span>
            </div>

            <div className="px-6 py-6" style={{ background: "var(--surface-alt)", borderBottom: "1px solid var(--border)", }}>
              <h3 className="font-mono text-[0.65rem] font-bold tracking-widest uppercase mb-3" style={{ color: color }}>
                The Goal
              </h3>
              <p className="font-mono leading-relaxed" style={{ fontSize: "0.90rem", color: "var(--chalk)" }}>
                {caseStudy?.goal}
              </p>
            </div>

            <div className="px-6 py-6" style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", }}>
              <h3 className="font-mono text-[0.65rem] font-bold tracking-widest uppercase mb-4" style={{ color: "#5ECFFF" }}>
                The Approach
              </h3>
              <ol className="flex flex-col gap-3" role="list">
                {caseStudy?.approach?.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span data-approach-step className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full font-mono text-xs font-bold mt-0.5" style={{ background: "rgba(94,207,255,0.12)", color: "#5ECFFF", border: "1px solid rgba(94,207,255,0.2)", }} aria-hidden="true">
                      {i + 1}
                    </span>
                    <p className="font-mono leading-snug" style={{ fontSize: "0.90rem", color: "rgba(240,237,232,0.8)", }}>
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="px-6 py-6" style={{ background: "var(--surface-alt)" }}>
              <h3 className="font-mono text-[0.65rem] font-bold tracking-widest uppercase mb-3" style={{ color: "#4ADE80" }}>
                The Result
              </h3>
              <p className="font-mono leading-relaxed" style={{ fontSize: "0.90rem", color: "var(--chalk)" }}>
                {caseStudy?.result}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12" data-detail-block>
          <div className="rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid var(--border)", }}>
            <h2 className="font-mono text-[0.65rem] font-bold tracking-widest uppercase mb-4" style={{ color: "var(--accent-red)" }}>
              Challenge
            </h2>
            <p className="font-mono leading-relaxed" style={{ fontSize: "0.90rem", color: "rgba(240,237,232,0.75)", lineHeight: 1.65, }}>
              {challenges}
            </p>
          </div>

          <div className="rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid var(--border)", }}>
            <h2 className="font-mono text-[0.65rem] font-bold tracking-widest uppercase mb-4" style={{ color: "var(--accent-green)" }}>
              Outcome
            </h2>
            <p className="font-mono leading-relaxed" style={{ fontSize: "0.90rem", color: "rgba(240,237,232,0.75)", lineHeight: 1.65, }}>
              {outcome}
            </p>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap mb-16" data-detail-block>
          {liveUrl && (
            <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-mono text-sm font-bold tracking-wider uppercase px-7 py-3.5 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-accent-purple" style={{ background: "var(--chalk)", color: "var(--canvas)" }} aria-label={`Open ${title} live site`}>
              <ExternalLink size={14} aria-hidden="true" />
              Live Site
            </a>
          )}
          {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-mono text-sm font-bold tracking-wider uppercase px-7 py-3.5 rounded-xl transition-colors detail-btn-outline focus-visible:ring-2 focus-visible:ring-accent-purple" style={{ border: "2px solid var(--border)", color: "var(--chalk)", }} aria-label={`View ${title} source code`}>
              <Github size={14} aria-hidden="true" />
              View Code
            </a>
          )}
          <Link href="/projects" className="flex items-center gap-2 font-mono text-sm font-bold tracking-wider uppercase px-7 py-3.5 rounded-xl transition-colors detail-btn-outline focus-visible:ring-2 focus-visible:ring-accent-purple" style={{ border: "2px solid var(--border)", color: "var(--muted)" }}>
            All Projects
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>

        {(prev || next) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16" data-detail-block>
            {prev ? (
              <Link href={`/projects/${prev?.slug}`} className="group flex items-start gap-4 rounded-2xl p-5 transition-colors" style={{ background: "var(--surface)", border: "1px solid var(--border)", }} aria-label={`Previous project: ${prev?.title}`}>
                <ArrowLeft size={16} className="mt-1 flex-shrink-0" style={{ color: "var(--muted)" }} aria-hidden="true" />
                <div className="min-w-0">
                  <p className="font-mono text-[0.6rem] font-bold tracking-widest uppercase mb-1" style={{ color: "var(--muted)" }}>
                    Previous
                  </p>
                  <p className="font-display font-bold text-2xl text-chalk truncate">{prev?.title}</p>
                  <p className="font-mono text-xs truncate" style={{ color: "var(--muted)" }}>{prev?.tagline}</p>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {next ? (
              <Link href={`/projects/${next?.slug}`} className="group flex items-start gap-4 rounded-2xl p-5 transition-colors text-right sm:flex-row-reverse" style={{ background: "var(--surface)", border: "1px solid var(--border)", }} aria-label={`Next project: ${next?.title}`}>
                <ArrowRight size={16} className="mt-1 flex-shrink-0" style={{ color: "var(--muted)" }} aria-hidden="true" />
                <div className="min-w-0">
                  <p className="font-mono text-[0.6rem] font-bold tracking-widest uppercase mb-1" style={{ color: "var(--muted)" }}>
                    Next
                  </p>
                  <p className="font-display font-bold text-2xl text-chalk truncate">{next?.title}</p>
                  <p className="font-mono text-xs truncate" style={{ color: "var(--muted)" }}>{next?.tagline}</p>
                </div>
              </Link>
            ) : (
              <div />
            )}
          </div>
        )}

        {related?.length > 0 && (
          <div data-detail-block>
            <h2 className="font-display font-bold text-2xl text-chalk mb-6">
              More {category === "professional" ? "professional" : "personal"}{" "}
              work
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related?.map((rel) => (
                <Link key={rel?.slug} href={`/projects/${rel?.slug}`} className="group flex flex-col rounded-2xl overflow-hidden transition-transform hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-accent-purple" style={{ background: "var(--surface)", border: "1px solid var(--border)", }}>
                  <div className="relative overflow-hidden" style={{ height: 120, background: (rel?.color || "#FFE566") + "20", }}>
                    {rel?.cover && !rel?.cover.startsWith("/projects") ? (
                      <Image src={rel?.cover} alt={rel?.title} fill sizes="300px" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                        <span className="font-display font-bold text-3xl text-chalk opacity-15">{rel?.title.slice(0, 2).toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-display font-bold text-xl text-chalk leading-tight mb-1">{rel?.title}</p>
                    <p className="font-mono text-xs" style={{ color: "var(--muted)" }}>{rel?.tagline}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </ProjectDetail>
  );
}