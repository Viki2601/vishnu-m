/**
 * app/sitemap.js — Auto-generates sitemap.xml via Next.js Metadata API.
 */

import { projects } from '@/data/projects';
const BASE_URL = 'https://viki.dev';

export default function sitemap() {
  const now = new Date().toISOString();

  const staticRoutes = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE_URL}/projects`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/#about`, lastModified: now, changeFrequency: 'yearly', priority: 0.7 },
    { url: `${BASE_URL}/#experience`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/#projects`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/#contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
  ];

  const projectRoutes = projects.map((p) => ({
    url: `${BASE_URL}/projects/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...projectRoutes];
}