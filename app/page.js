import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";

export const metadata = {
  title: "Viki — Frontend Developer",
  description: 'Portfolio of Vishnu "Viki" Muthukumar — Frontend Developer & Motion Nerd from Chennai, India.',
};

export default function HomePage() {
  return (
    <>
      {/* Skip-to-content link for keyboard users */}
      <a href="#main-content" className="sr-only focus:not-sr-only fixed top-3 left-1/2 -translate-x-1/2 z-[9999] bg-white text-ink font-mono text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full shadow-lg border border-ink/10 focus-visible:ring-2 focus-visible:ring-accent-purple">
        Skip to main content
      </a>

      <Hero />
      <About />
      <Experience />
      <Projects />
      <Contact />
    </>
  );
}