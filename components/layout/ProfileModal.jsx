'use client';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { X, MapPin } from 'lucide-react';
import { profile } from '@/data/profile';

export default function ProfileModal({ open, onClose }) {
    const closeRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        closeRef.current?.focus();
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [open, onClose]);

    if (!open) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }} onClick={onClose}>
            <div role="dialog" aria-modal="true" aria-labelledby="profile-modal-title" data-lenis-prevent onClick={(e) => e.stopPropagation()} className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl p-5" style={{ background: 'var(--chalk)', color: 'var(--canvas)' }}>
                {/* ── Diagonal cross-hatch pattern — top-right corner ─────── */}
                <div aria-hidden="true" style={{ position: 'absolute', top: 0, right: 0, width: '55%', height: '240px', borderRadius: '0 1.5rem 0 0', overflow: 'hidden', pointerEvents: 'none', }}>
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0 }}>
                        <defs>
                            <pattern id="crosshatch" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(0)">
                                <line x1="0" y1="20" x2="20" y2="0" stroke="rgba(0,0,0,0.13)" strokeWidth="0.8" />
                                <line x1="0" y1="0" x2="20" y2="20" stroke="rgba(0,0,0,0.13)" strokeWidth="0.8" />
                            </pattern>

                            <radialGradient id="fadeOut" cx="100%" cy="0%" r="80%" gradientUnits="objectBoundingBox">
                                <stop offset="0%" stopColor="white" stopOpacity="1" />
                                <stop offset="55%" stopColor="white" stopOpacity="0.6" />
                                <stop offset="100%" stopColor="white" stopOpacity="0" />
                            </radialGradient>

                            <mask id="hatchMask">
                                <rect width="100%" height="100%" fill="url(#fadeOut)" />
                            </mask>
                        </defs>

                        <rect width="100%" height="100%" fill="url(#crosshatch)" mask="url(#hatchMask)" />
                    </svg>
                </div>

                <button ref={closeRef} onClick={onClose} aria-label="Close profile" className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center focus-visible:ring-2 focus-visible:ring-accent-purple" style={{ background: 'rgba(0,0,0,0.08)', zIndex: 10 }}>
                    <X size={16} aria-hidden="true" />
                </button>

                <div className="relative rounded-full overflow-hidden mb-2" style={{ width: 100, height: 100, zIndex: 1 }}>
                    <Image src={profile?.avatar} alt={`${profile?.name} avatar`} fill sizes="120px" className="object-cover" />
                </div>

                <h2 id="profile-modal-title" className="font-display font-bold leading-tight" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
                    {profile?.name}
                </h2>
                <p className="font-mono mt-2 flex items-center gap-2 text-xs" style={{ opacity: 0.6 }}>
                    <span>{profile?.role}</span>
                    {profile?.location && (
                        <>
                            <span aria-hidden="true">·</span>
                            <MapPin size={14} aria-hidden="true" />
                            <span>{profile?.location}</span>
                        </>
                    )}
                </p>

                {profile?.about && (
                    <section className="mt-4">
                        <h3 className="font-mono font-bold text-md mb-2">About</h3>
                        <p className="font-mono text-xs leading-relaxed" style={{ opacity: 0.8 }}>{profile?.about}</p>
                    </section>
                )}

                {profile?.companies?.length > 0 && (
                    <section className="mt-6">
                        <h3 className="font-mono font-bold text-sm mb-3">
                            {profile?.experience} Years Experience Includes:
                        </h3>
                        <ul className="flex flex-wrap gap-1">
                            {profile?.companies?.map((c) => (
                                <li key={c.name}>
                                    <a href={c.href} target="_blank" rel="noopener noreferrer" aria-label={`${c.name} (opens in a new tab)`} className="group flex items-center gap-3 rounded-full transition-all duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-accent-purple" style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.08)' }}>
                                        <span className="relative w-11 h-11 rounded-full overflow-hidden shrink-0" style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}>
                                            <Image src={c.logo} alt="" fill sizes="44px" className="object-contain p-1.5" />
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        </div>,
        document.body
    );
}