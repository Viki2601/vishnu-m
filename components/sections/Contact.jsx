'use client';
import { useRef, useEffect } from 'react';
import { Copy, Download, ArrowUpRight } from 'lucide-react';
import SectionTitle from '@/components/ui/SectionTitle';
import SocialIcon from '@/components/ui/SocialIcon';
import { profile } from '@/data/profile';
import { useToast } from '@/components/ui/Toast';
import { copyToClipboard } from '@/lib/utils';
import useReducedMotion from '@/hooks/useReducedMotion';

export default function Contact() {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const contentRef = useRef(null);
  const { showToast } = useToast();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let ctx;
    import('gsap').then(async ({ gsap }) => {
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.fromTo(headlineRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: headlineRef.current, start: 'top 85%', once: true }
          });

        gsap.set(contentRef.current, { opacity: 1 });

        gsap.fromTo(
          contentRef.current?.children ? Array.from(contentRef.current.children) : [],
          { y: 24, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out',
            scrollTrigger: { trigger: contentRef.current, start: 'top 82%', once: true }
          });
      }, sectionRef);
    });
    return () => ctx?.revert();
  }, [reduced]);

  async function handleCopyEmail() {
    try {
      await copyToClipboard(profile.email);
      showToast(`📋 Copied! ${profile.email}`);
    } catch {
      showToast('Could not copy — try manually!');
    }
  }

  return (
    <section id="contact" ref={sectionRef} className="py-8 px-6" aria-labelledby="contact-title">
      <SectionTitle title="Contact" id="contact-title" />

      <h2 ref={headlineRef} className="font-display font-bold text-center text-chalk leading-tight mb-10" style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)', opacity: reduced ? 1 : 0 }} aria-label="Let's build something fun">
        Let&apos;s build something{' '}
        <span className="relative inline-block" style={{ color: 'var(--accent-purple)' }}>
          fun
          <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 100 6" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0,4 Q10,1 20,4 T40,4 T60,4 T80,4 T100,4" stroke="#C084FF" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
        </span>
      </h2>

      {/* Content */}
      <div ref={contentRef} className="max-w-lg mx-auto flex flex-col items-center gap-6" style={{ opacity: reduced ? 1 : 0 }}>

        <button onClick={handleCopyEmail} className="group flex items-center gap-3 font-mono text-sm font-bold tracking-widest uppercase px-8 py-4 rounded-2xl transition-colors duration-200 w-full sm:w-auto justify-center focus-visible:ring-2 focus-visible:ring-accent-purple" style={{ background: 'var(--chalk)', color: 'var(--canvas)' }} aria-label={`Copy email address: ${profile.email}`}>
          <span>{profile.email}</span>
          <Copy size={15} aria-hidden="true" className="opacity-50 group-hover:opacity-100 transition-opacity" />
        </button>

        <a href={`mailto:${profile.email}`} className="font-mono text-xs tracking-wide flex items-center gap-1 transition-colors focus-visible:ring-2 focus-visible:ring-accent-purple rounded" style={{ color: 'var(--muted)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--chalk)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>
          or open your mail client
          <ArrowUpRight size={12} aria-hidden="true" />
        </a>

        {/* Divider */}
        <div className="flex items-center gap-4 w-full">
          <hr className="flex-1" style={{ borderColor: 'var(--border)' }} />
          <span className="font-mono text-[0.6rem] tracking-widest uppercase" style={{ color: 'var(--muted)' }}>or find me on</span>
          <hr className="flex-1" style={{ borderColor: 'var(--border)' }} />
        </div>

        {/* Socials */}
        <div className="flex gap-3 justify-center flex-wrap">
          {Object.entries(profile.social).map(([platform, href]) => (
            <SocialIcon key={platform} platform={platform} href={href} label={`${profile.casual} on ${platform}`} />
          ))}
        </div>

        {/* Resume */}
        <a href={profile.resume} download className="flex items-center gap-2 font-mono text-xs font-bold tracking-widest uppercase px-6 py-3 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-accent-purple" style={{ border: '2px solid var(--border)', color: 'var(--chalk)' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'} aria-label="Download Viki's resume PDF">
          <Download size={14} aria-hidden="true" />
          Download Résumé
        </a>
      </div>

      {/* Footer */}
      <footer className="mt-10 pt-8 text-center" style={{ borderTop: '1px solid var(--border)' }} role="contentinfo">
        <p className="text-xl tracking-wide" style={{ color: 'var(--muted)', }}>
          Designed &amp; built by Viki — Chennai 🌶️
        </p>
      </footer>
    </section>
  );
}