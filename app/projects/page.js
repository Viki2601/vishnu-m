/**
 * app/projects/page.js
 * Full project listing page — /projects
 * Server Component. Client animation layer in ProjectsListClient.jsx.
 */

import ProjectsListClient from './ProjectsListClient';
import { projects } from '@/data/projects';

export const metadata = {
  title: 'Projects — Viki',
  description: 'All projects by Vishnu "Viki" Muthukumar — personal experiments, professional work, and client builds.',
};

export default function ProjectsPage() {
  return <ProjectsListClient projects={projects} />;
}