'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Mail, Bookmark } from 'lucide-react';
import { profile } from '@/data/profile';
import { useLenis } from '@/components/layout/SmoothScrollProvider';
import ProfileModal from './ProfileModal';

const NAV_ITEMS = [
  { label: 'Profile', action: 'profile' },
  { label: 'Portfolio', action: 'home' },
];

export default function Sidebar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const lenisRef = useLenis();

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
          <Image src={profile.avatar} alt={`${profile.name} avatar`} fill sizes="120px" className="object-cover" priority />
        </div>

        <div>
          <h1 className="font-display text-2xl font-bold text-chalk leading-tight">{profile.name}</h1>
          <p className="text-lg font-bold tracking-wider uppercase mt-0.5" style={{ color: 'var(--accent-purple)' }}>{profile.role}</p>
        </div>
      </div>

      <hr style={{ borderColor: 'var(--border)' }} className="my-1" />

      <div className="flex gap-2 mt-1">
        <a href={`mailto:${profile.email}`} className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 font-mono text-xs font-bold tracking-wider uppercase transition-colors focus-visible:ring-2 focus-visible:ring-accent-purple" style={{ background: 'var(--chalk)', color: 'var(--canvas)' }} aria-label="Send email">
          <Mail size={14} aria-hidden="true" />
          Message
        </a>
        <a href={profile.resume} download aria-label="Download resume" className="flex items-center justify-center w-10 h-10 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-accent-purple" style={{ border: '1px solid var(--border)', color: 'var(--chalk)' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
          <Bookmark size={16} aria-hidden="true" />
        </a>
      </div>

      <nav aria-label="Page sections" className="mt-2 flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ label, action }) => {
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
      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </aside>
  );
}