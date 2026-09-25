export const DESIGN_WIDTH = 1920;
export const DESIGN_HEIGHT = 1080;

export const site = {
  intro: "HI, THIS IS",
  bio: "I’M A PRODUCT DESIGNER WITH AN EYE FOR DESIGN AND A HAND IN FRONTEND DEVELOPMENT. I SOLVE BUSINESS NEEDS THROUGH COLLABORATIVE PROCESSES AND A PASSION FOR INTUITIVE CRAFTSMANSHIP.",
  welcomeSpine: ["WELCOME TO MY SPACE! FEEL FREE TO STAY ", "A WHILE"],
  boardingPass: "PORTFOLIO BOARDING PASS ADMIT ONE",
  dateLabel: "DATE",
  email: {
    code: "EMA",
    lines: ["AANGKITHAA", "@GMAIL.COM"],
    href: "mailto:aangkithaa@gmail.com",
  },
  linkedin: {
    code: "LDN",
    lines: ["MY", "LINKEDIN"],
    href: "https://www.linkedin.com/in/angkitha-anguraj/",
  },
  role: {
    title: "DESIGN ENGINEER",
    company: "ALTIMETRIK",
  },
  nowPlaying: {
    listeningLabel: "LISTENING TO:",
    track: "DELETE",
    artist: "NINAJIRACHI",
    watchingLabel: "WATCHING:",
    watching: "SUCCESSION",
  },
  navigation: [
    {
      id: "projects",
      label: "PROJECTS",
      icon: "paperclip" as const,
      href: "#projects",
    },
    {
      id: "about",
      label: "ABOUT ME",
      icon: "user" as const,
      href: "#about",
    },
    {
      id: "work",
      label: "WORK EXPERIENCE",
      icon: "laptop" as const,
      href: "#work",
    },
  ],
  stamp: {
    heading: "DESIGN SYSTEMS",
    visualDesign: "visual design",
    abTesting: "a/b testing",
    uxResearch: "ux research",
    tools: "Figma•TypeScript•LLMs",
    stack: "REST APIs, DTOs, React",
    tamil: "அ",
  },
};

export const pages = [
  { id: "landing", type: "landing" as const },
  { id: "projects", type: "projects" as const, label: "Projects" },
  { id: "about", type: "about" as const, label: "About Me" },
];
