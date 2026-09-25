import { useRef } from "react";
import { ScaledStage } from "./components/ScaledStage";
import { pages } from "./content/site";
import { useFullPageScroll } from "./hooks/useFullPageScroll";
import { AboutPage } from "./pages/AboutPage";
import { LandingPage } from "./pages/LandingPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import "./App.css";

function PageBody({ type }: { type: (typeof pages)[number]["type"] }) {
  if (type === "landing") return <LandingPage />;
  if (type === "projects") return <ProjectsPage />;
  return <AboutPage />;
}

export default function App() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  useFullPageScroll(scrollerRef, pages.length);

  return (
    <div className="portfolio" ref={scrollerRef}>
      {pages.map((page) => (
        <ScaledStage
          key={page.id}
          id={page.id}
          label={page.type === "landing" ? "Landing" : page.label}
        >
          <PageBody type={page.type} />
        </ScaledStage>
      ))}
    </div>
  );
}
