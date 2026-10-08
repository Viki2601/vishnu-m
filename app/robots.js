/**
 * app/robots.js — Generates robots.txt via Next.js Metadata API.
 */

export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', },],
    sitemap: 'https://viki.dev/sitemap.xml',
  };
}