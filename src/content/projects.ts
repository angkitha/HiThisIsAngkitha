import type { ProjectId } from "./projectCarousel";
import { projectCopy } from "./projectCarousel";

export const projectsCopy = {
  youAreOn: "YOU ARE ON",
  title: "PROJ E C T  S",
  goToLabel: "NO! I WANT TO GO TO...",
  links: [
    { label: "LANDING", href: "#landing" },
    { label: "ABOUT ME", href: "#about" },
    { label: "WORK EXPERIENCE", href: "#work" },
  ],
};

export type OverlayPersona = {
  name: string;
  role: string;
  quote: string;
  goals: string[];
  frustrations: string[];
  /** Future headshot; red circle until provided. */
  photo?: string;
};

export type OverlaySection = {
  heading?: string;
  body: string;
};

export type OverlayProject = {
  number: string;
  title: string;
  industryLabel: string;
  industry: string;
  durationLabel: string;
  duration: string;
  demoLabel: string;
  demo: string;
  /** Demo GIF or looping video. Falls back to `demoPoster` until provided. */
  demoSrc?: string;
  demoPoster: string;
  sections: OverlaySection[];
  personasHeading: string;
  personasIntro: string;
  personas: OverlayPersona[];
  personasOutro: string;
  resultsHeading: string;
  resultsBody: string;
  /** Case-study still/image under Results. Red slot until provided. */
  gallerySrc?: string;
};

const PLACEHOLDER_PERSONAS: OverlayPersona[] = [
  {
    name: "Name",
    role: "Title",
    quote: "“Insert Quote Here”",
    goals: ["Bullet One", "Bullet Two", "Bullet Three"],
    frustrations: ["Bullet One", "Bullet Two", "Bullet Three"],
  },
  {
    name: "Name",
    role: "Title",
    quote: "“Insert Quote Here”",
    goals: ["Bullet One", "Bullet Two", "Bullet Three"],
    frustrations: ["Bullet One", "Bullet Two", "Bullet Three"],
  },
];

function overlayTitle(id: ProjectId) {
  const title = projectCopy[id].title;
  if (typeof title === "string") return title;
  return title.join("").replace(/\s+/g, " ").trim();
}

function overlayTemplate(
  id: ProjectId,
  extras: Partial<Omit<OverlayProject, "number" | "title">> = {},
): OverlayProject {
  return {
    number: projectCopy[id].label,
    title: overlayTitle(id),
    industryLabel: "INDUSTRY",
    industry: "FINANCE, TECH",
    durationLabel: "DURATION",
    duration: "MAY 2026",
    demoLabel: "LINK TO DEMO",
    demo: "WATCH HERE",
    demoPoster: "",
    sections: [
      { heading: "Background", body: "This is text." },
      { heading: "Competitor Analysis and Research", body: "This is text." },
    ],
    personasHeading: "User Personas",
    personasIntro: "This is text.",
    personas: PLACEHOLDER_PERSONAS,
    personasOutro: "This is text.",
    resultsHeading: "Results",
    resultsBody: "This is text.",
    ...extras,
  };
}

/** Expanded-project copy. Other IDs share the template until their Figma screens arrive. */
export const projectOverlays: Record<ProjectId, OverlayProject> = {
  1: overlayTemplate(1),
  2: overlayTemplate(2),
  3: overlayTemplate(3),
  4: overlayTemplate(4),
  5: overlayTemplate(5),
};

/** @deprecated Use projectOverlays[id] */
export const projectOverlayCopy = projectOverlays[1];
