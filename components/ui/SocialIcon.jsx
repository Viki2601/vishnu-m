'use client';
import { Github, Linkedin, Instagram, Twitter } from 'lucide-react';

const ICONS = {
  linkedin: Linkedin,
  github: Github,
  instagram: Instagram,
  twitter: Twitter,
  x: Twitter,
};

export default function SocialIcon({ href, label, platform }) {
  const Icon = ICONS[platform?.toLowerCase()] || Github;

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label || platform} className="inline-flex items-center justify-center w-11 h-11 rounded-full transition-all duration-200 focus-visible:ring-2 focus-visible:ring-accent-purple" style={{ border: '1.5px solid var(--border)', color: 'var(--muted)' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.color = 'var(--chalk)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.background = 'transparent'; }}>
      <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
    </a>
  );
}