'use client';
import { useState } from 'react';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { profile } from '@/data/profile';
import ProfileModal from '@/components/layout/ProfileModal';

export default function MobileHeader() {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      <header className="xl:hidden sticky top-0 z-50" style={{ background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)', }} aria-label="Profile header">
        <div className="flex items-center gap-3 px-4 py-3 max-w-screen-xl mx-auto">
          <button onClick={() => setProfileOpen(true)} aria-label="View profile" className="relative rounded-full overflow-hidden flex-shrink-0 focus-visible:ring-2 focus-visible:ring-accent-purple" style={{ width: 40, height: 40, border: '1.5px solid rgba(255,255,255,0.15)', boxShadow: '0 2px 8px rgba(0,0,0,0.5)', }}>
            <Image src={profile?.avatar} alt={`${profile?.name} avatar`} fill sizes="40px" className="object-cover" priority />
          </button>

          <div className="flex-1 min-w-0">
            <p className="font-mono  font-bold text-sm text-chalk truncate leading-tight">
              {profile?.casual} — {profile?.role}
            </p>
            <p className="flex items-center gap-1 font-mono text-[0.6rem] tracking-wide mt-0.5" style={{ color: 'var(--muted)' }}>
              <MapPin size={10} aria-hidden="true" />
              {profile?.locationShort}
            </p>
          </div>

          <div className="hidden sm:flex items-center">
            {profile?.companies?.slice(0, 2)?.map((c, i) => (
              <div key={c.name} className="relative rounded-full overflow-hidden" style={{ width: 28, height: 28, marginLeft: i > 0 ? -8 : 0, background: 'var(--surface-alt)', border: '1.5px solid var(--border)', }} title={c.name} aria-label={c.name}>
                <Image src={c.logo} alt={c.name} fill sizes="28px" className="object-contain p-0.5" />
              </div>
            ))}
          </div>

          {/* Say Hi CTA */}
          <a href={`https://wa.me/${profile?.whatsapp}?text=${encodeURIComponent(profile?.whatsappMessage)}`} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 rounded-lg py-1.5 px-3 font-mono text-[0.65rem] font-bold tracking-wider uppercase transition-colors focus-visible:ring-2 focus-visible:ring-accent-purple" style={{ background: 'var(--chalk)', color: 'var(--canvas)' }} aria-label="Message me on WhatsApp">
            Say Hi
          </a>
        </div>
      </header>

      {/* Profile modal — shared with the sidebar's Profile button */}
      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
}