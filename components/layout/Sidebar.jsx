'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Bookmark, MessageCircle, GraduationCap } from 'lucide-react';
import { profile } from '@/data/profile';
import { useLenis } from '@/components/layout/SmoothScrollProvider';
import ProfileModal from './ProfileModal';
import EducationOverlay from './EducationOverlay';

const NAV_ITEMS = [
  { label: 'Profile', action: 'profile' },
  { label: 'Portfolio', action: 'home' },
];

export default function Sidebar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const lenisRef = useLenis();
  const [eduOpen, setEduOpen] = useState(false);
  const [eduOrigin, setEduOrigin] = useState({ x: 0, y: 0 });

  function openEdu(e) {
    const r = e.currentTarget.getBoundingClientRect();
    const fromKeyboard = e.detail === 0;
    setEduOrigin(
      fromKeyboard
        ? { x: r.left + r.width / 2, y: r.top + r.height / 2 }
        : { x: e.clientX, y: e.clientY }
    );
    setEduOpen(true);
    lenisRef?.current?.stop();
  }

  function closeEdu() {
    setEduOpen(false);
    lenisRef?.current?.start();
  }

  function goHome() {
    const el = document.getElementById('hero');
    const lenis = lenisRef?.current;
    if (lenis) lenis.scrollTo(el ?? 0, { offset: -24, duration: 1.4 });
    else (el ?? document.body).scrollIntoView({ behavior: 'smooth' });
  }

  function handleNav(action) {
    if (action === 'profile') setProfileOpen(true);
    else goHome();
  }

  return (
    <aside className="sidebar hidden xl:flex" aria-label="Profile sidebar">
      <div className="flex flex-col items-center text-center gap-3">
        <div className="relative rounded-full overflow-hidden" style={{ width: 120, height: 120, border: '2px solid rgba(255,255,255,0.12)', boxShadow: '0 4px 24px rgba(0,0,0,0.6)', }}>
          <Image src={profile?.avatar} alt={`${profile?.name} avatar`} fill sizes="120px" className="object-cover" priority />
        </div>

        <div>
          <h1 className="font-display text-2xl font-bold text-chalk leading-tight">{profile?.name}</h1>
          <p className="text-lg font-bold tracking-wider uppercase mt-0.5" style={{ color: 'var(--accent-purple)' }}>{profile?.role}</p>
        </div>
      </div>

      <hr style={{ borderColor: 'var(--border)' }} className="my-1" />

      <div className="flex gap-2 mt-1">
        <a href={`https://wa.me/${profile?.whatsapp}?text=${encodeURIComponent(profile?.whatsappMessage)}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 font-mono text-xs font-bold tracking-wider uppercase transition-colors focus-visible:ring-2 focus-visible:ring-accent-purple" style={{ background: 'var(--chalk)', color: 'var(--canvas)' }} aria-label="Message me on WhatsApp">
          <MessageCircle size={14} aria-hidden="true" />
          Message
        </a>
        <a href={profile?.resume} download target="_blank" aria-label="Download resume" className="flex items-center justify-center w-10 h-10 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-accent-purple" style={{ border: '1px solid var(--border)', color: 'var(--chalk)' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
          <Bookmark size={16} aria-hidden="true" />
        </a>
      </div>

      <nav aria-label="Page sections" className="mt-2 flex flex-col gap-0.5">
        {NAV_ITEMS?.map(({ label, action }) => {
          const isActive = action === 'profile' ? profileOpen : !profileOpen;
          return (
            <button key={action} onClick={() => handleNav(action)} aria-current={isActive ? 'page' : undefined} className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl font-mono text-sm tracking-wide transition-all duration-150 focus-visible:ring-2 focus-visible:ring-accent-purple" style={{ background: isActive ? 'rgba(255,255,255,0.06)' : 'transparent', color: isActive ? 'var(--chalk)' : 'var(--muted)', fontWeight: isActive ? '700' : '400', }}>
              {label}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full" aria-hidden="true" style={{ background: 'var(--accent-purple)' }} />
              )}
            </button>
          );
        })}
      </nav>

      <div role="button" tabIndex={0} aria-label="Open education and certifications" onClick={openEdu} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), openEdu(e))} className="group absolute left-0 bottom-0 w-full cursor-pointer">
        <div className="pointer-events-none absolute bottom-full left-10 mb-1 flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 translate-y-2 scale-95 origin-bottom-left transition-all duration-200 ease-out group-hover:translate-y-0 group-hover:scale-100" style={{ background: 'var(--chalk)', color: 'var(--canvas)', boxShadow: '0 8px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)', }} role="tooltip">
          <GraduationCap size={14} style={{ color: 'var(--accent-purple)' }} aria-hidden="true" />
          <span className="font-mono text-xs font-bold tracking-wide">Click to switch education</span>
          <span aria-hidden="true" className="absolute -bottom-1 left-8 h-2.5 w-2.5 rotate-45" style={{ background: 'var(--chalk)' }} />
        </div>

        <Image src="https://w0anlcknbb.ufs.sh/f/frbi5WQIEfLAdtsuxP1Y5ropVtkXNxi7yDjAZwPcbhI8seB1" width={2000} height={2000} alt="Sidebar" className="w-full h-full object-contain -scale-x-100 brightness-80 transition duration-300 group-hover:brightness-110" />
      </div>
      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
      <EducationOverlay open={eduOpen} origin={eduOrigin} onClose={closeEdu} />
    </aside>
  );
}