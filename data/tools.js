/**
 * tools.js – Edit to add/remove tool cards in the About section.
 * icon: react-icons/si key. fallbackIcon: used when no brand icon exists.
 * category: used to group cards (optional).
 * learning: true shows a small "learning" tag on the card (optional).
 */
export const tools = [
  { name: "React", icon: "SiReact", color: "#61DAFB", category: "frameworks" },
  { name: "Next.js", icon: "SiNextdotjs", color: "#FFFFFF", category: "frameworks", },
  { name: "JavaScript", icon: "SiJavascript", color: "#F7DF1E", category: "core", },
  { name: "SASS", icon: "SiSass", color: "#CC6699", category: "core" },
  { name: "Tailwind CSS", icon: "SiTailwindcss", color: "#38BDF8", category: "frameworks", },
  { name: "Expo", icon: "SiExpo", color: "#FFFFFF", category: "frameworks" },
  { name: "React Query", icon: "SiReactquery", color: "#FF4154", category: "frameworks", },
  { name: "GSAP", icon: "SiGreensock", color: "#88CE02", category: "creative" },
  { name: "Lenis", icon: "SiLenis", color: "#FFFFFF", category: "creative", fallbackIcon: "scroll", },
  { name: "Framer", icon: "SiFramer", color: "#0055FF", category: "creative", },
  { name: "Three.js", icon: "SiThreedotjs", color: "#FFFFFF", category: "creative", },
  { name: "WebGL", icon: "SiWebgl", color: "#990000", category: "creative" },
  { name: "Mapbox GL JS", icon: "SiMapbox", color: "#4264FB", category: "creative", },
  { name: "Node.js", icon: "SiNodedotjs", color: "#5FA04E", category: "backend", },
  { name: "Express", icon: "SiExpress", color: "#FFFFFF", category: "backend" },
  { name: "MongoDB", icon: "SiMongodb", color: "#47A248", category: "backend" },
  { name: "Git", icon: "SiGit", color: "#F05032", category: "workflow" },
  { name: "GitHub", icon: "SiGithub", color: "#FFFFFF", category: "workflow" },
  { name: "CI/CD", icon: "SiGithubactions", color: "#2088FF", category: "workflow", fallbackIcon: "workflow", },
  { name: "Vercel", icon: "SiVercel", color: "#FFFFFF", category: "workflow" },
  { name: "Figma", icon: "SiFigma", color: "#A259FF", category: "tools" },
  { name: "Claude", icon: "SiAnthropic", color: "#D4793B", category: "tools", fallbackIcon: "cpu", },
  { name: "Cursor", icon: "SiCursor", color: "#FFFFFF", category: "tools", fallbackIcon: "code", },
];