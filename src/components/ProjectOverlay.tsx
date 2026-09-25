import { useEffect, useRef, useState, type MouseEvent } from "react";
import { projectAssets } from "../assets/projects";
import { CallCenterCase } from "./CallCenterCase";
import { DesignSystemCase } from "./DesignSystemCase";
import { WcagCase } from "./WcagCase";
import { DashboardCase } from "./DashboardCase";
import { projectOverlays, type OverlayPersona, type OverlayProject } from "../content/projects";
import type { ProjectId } from "../content/projectCarousel";
import "./ProjectOverlay.css";

const PREVIEW_IMAGES = [projectAssets.fintechDesk, projectAssets.fintechTabs];
const PREVIEW_RATIO = new Map<string, number>([
  [projectAssets.fintechDesk, 1894 / 1390],
  [projectAssets.fintechTabs, 1249 / 1569],
  [projectAssets.callAi, 2620 / 1882],
  [projectAssets.callWizard, 2620 / 2665],
  [projectAssets.callWorkflow, 2510 / 4096],
  [projectAssets.dashHome, 2868 / 1391],
  [projectAssets.dashBoards, 2868 / 1365],
  [projectAssets.dashWorkflows, 2868 / 1379],
]);
const PREVIEW_HEIGHT = 623;
const PREVIEW_ZOOM_MIN = 1;
const PREVIEW_ZOOM_MAX = 2;

type ProjectOverlayProps = {
  projectId?: ProjectId;
  onClose: () => void;
  onChangeProject: (id: ProjectId) => void;
  closing?: boolean;
};

function neighborProject(id: ProjectId, direction: -1 | 1): ProjectId {
  const next = id + direction;
  if (next < 1) return 5;
  if (next > 5) return 1;
  return next as ProjectId;
}

function isVideo(src?: string) {
  return Boolean(src && /\.(mp4|webm|mov)(\?|$)/i.test(src));
}

function DemoMedia({ src, poster }: { src?: string; poster: string }) {
  if (src && isVideo(src)) {
    return <video src={src} poster={poster} autoPlay loop muted playsInline />;
  }
  return <img alt="" src={src || poster} />;
}

function PersonaCard({ persona }: { persona: OverlayPersona }) {
  return (
    <article className="persona">
      <span className="persona__tick persona__tick--tl" aria-hidden="true" />
      <span className="persona__tick persona__tick--tr" aria-hidden="true" />
      <span className="persona__tick persona__tick--bl" aria-hidden="true" />
      <span className="persona__tick persona__tick--br" aria-hidden="true" />
      <div className="persona__top">
        <div className="persona__photo">
          {persona.photo ? <img alt="" src={persona.photo} /> : null}
        </div>
        <div className="persona__intro">
          <div className="persona__identity">
            <p className="persona__name">{persona.name}</p>
            <p className="persona__role">{persona.role}</p>
          </div>
          <p className="persona__quote">{persona.quote}</p>
        </div>
      </div>
      <div className="persona__bottom">
        <div className="persona__col">
          <p className="persona__label">Goals</p>
          <ol>
            {persona.goals.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>
        <div className="persona__col">
          <p className="persona__label">Frustrations</p>
          <ol>
            {persona.frustrations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>
      </div>
    </article>
  );
}

function OverlayCase({ project, poster }: { project: OverlayProject; poster: string }) {
  return (
    <div className="project-overlay__case">
      <div className="project-overlay__image">
        <DemoMedia src={project.demoSrc} poster={poster} />
      </div>

      <div className="project-overlay__meta">
        <div className="project-overlay__meta-item">
          <span>{project.industryLabel}</span>
          <span className="project-overlay__chip">{project.industry}</span>
        </div>
        <div className="project-overlay__meta-item">
          <span>{project.durationLabel}</span>
          <span className="project-overlay__chip">{project.duration}</span>
        </div>
        <div className="project-overlay__meta-item">
          <span>{project.demoLabel}</span>
          <span className="project-overlay__chip project-overlay__chip--plain">{project.demo}</span>
        </div>
      </div>

      {project.sections.map((section) => (
        <div key={`${section.heading ?? ""}-${section.body}`} className="project-overlay__section">
          {section.heading ? <p className="project-overlay__heading">{section.heading}</p> : null}
          <p className="project-overlay__body">{section.body}</p>
        </div>
      ))}

      <div className="project-overlay__section">
        <p className="project-overlay__heading">{project.personasHeading}</p>
        <p className="project-overlay__body">{project.personasIntro}</p>
      </div>

      <div className="persona-row">
        {project.personas.map((persona, index) => (
          <PersonaCard key={`${persona.name}-${index}`} persona={persona} />
        ))}
      </div>

      <div className="project-overlay__section">
        <p className="project-overlay__body">{project.personasOutro}</p>
      </div>

      <div className="project-overlay__section">
        <p className="project-overlay__heading">{project.resultsHeading}</p>
        <p className="project-overlay__body">{project.resultsBody}</p>
      </div>

      <div className="project-overlay__gallery">
        {project.gallerySrc ? (
          <img alt="" src={project.gallerySrc} />
        ) : (
          <div className="project-overlay__gallery-slot" aria-hidden="true" />
        )}
      </div>
    </div>
  );
}

function PersonaTicks() {
  return (
    <>
      <span className="fintech-persona__tick fintech-persona__tick--tl" aria-hidden="true" />
      <span className="fintech-persona__tick fintech-persona__tick--tr" aria-hidden="true" />
      <span className="fintech-persona__tick fintech-persona__tick--bl" aria-hidden="true" />
      <span className="fintech-persona__tick fintech-persona__tick--br" aria-hidden="true" />
    </>
  );
}

function FintechCase({ onPreview }: { onPreview: (src: string) => void }) {
  return (
    <div className="fintech-case">
      <div className="project-overlay__image">
        <img className="fintech-case__hero" alt="" src={projectAssets.fintechHero} />
      </div>
      <div className="project-overlay__meta">
        <div className="project-overlay__meta-item">
          <span>INDUSTRY</span>
          <span className="project-overlay__chip">FINANCE, TECH</span>
        </div>
        <div className="project-overlay__meta-item">
          <span>DURATION</span>
          <span className="project-overlay__chip">MAY 2026</span>
        </div>
        <div className="project-overlay__meta-item">
          <span>LINK TO DEMO</span>
          <a
            className="project-overlay__chip project-overlay__chip--plain"
            href="https://drive.google.com/file/d/1po4kGNLHcdwH9DsyJbTkaAniG9OsD3Ro/view"
            target="_blank"
            rel="noreferrer"
          >
            WATCH HERE
          </a>
        </div>
      </div>
      <section className="fintech-case__block">
        <h2 className="fintech-case__heading">Background</h2>
        <div className="fintech-case__cards">
          <article className="fintech-case__card">
            <p className="fintech-case__card-title">The Problem</p>
            <p>
              While satisfactory, our financial tech services client wanted to revamp our team’s
              previous product’s UI to better emulate the experience found across competitors’
              financial platforms. The client’s internal team of call center representatives and
              senior managers would be the primary users of the platform. This meant we were
              building a product for a team of technically experienced users with a comfort for old
              platform patterns.
            </p>
          </article>
          <article className="fintech-case__card">
            <p className="fintech-case__card-title">My Ownership</p>
            <p>
              I owned end-to-end UI/UX. This meant I was in charge of competitor analysis, UX
              research, and design system standardization while maintaining the original product’s
              functional logic.
            </p>
          </article>
        </div>
        <div className="fintech-case__audit">
          <div className="fintech-case__shot">
            <img alt="" src={projectAssets.fintechAudit} />
          </div>
          <p className="fintech-case__note">
            I first wanted to identify gaps in which I could jump in and improve the website’s look
            and feel. I went through each screen to pinpoint avenues for improvement.
          </p>
        </div>
      </section>

      <section className="fintech-case__block">
        <h2 className="fintech-case__heading">Competitor Analysis and Research</h2>
        <div className="fintech-case__prose">
          <p>
            Given the original platform&apos;s complexity, I took to Mobbin to conduct a broad
            pattern sweep. There were three features I pinpointed I should focus on: the AI
            assistant, the New Account Creation wizard, and the Investor Hub. I scraped through
            approximately 18 competitor screens with the same functionalities and mapped each to the
            3 aforementioned features. All 18 of these screens were designed with minimal visual
            clutter. Data was displayed logically so as not to overwhelm the user with numbers but
            to rather provide them with enough insight required to perform their high level tasks.
            AI assistants immediately surfaced quick action cards so as to reduce the time from data
            point discovery to action. Form inputs and wizards focused on reducing text and
            scrolling by employing a tab-based architecture.
          </p>
          <p>
            Additionally, to ensure that I aligned with the client’s ultimate needs, I performed
            user interviews on 5 employees who would be amongst the first few end users of the
            platform’s redesign. During my sessions, I asked said employees what their pain points
            with the current platform were, what features they feel they’re benefiting from, and
            what data they interact with day-to-day. As we were on a quick turnaround time, I was
            unable to perform other methods of UX research; I focused on making the most of the data
            from these sessions while asking follow-up questions through asynchronous emails.
          </p>
          <p>
            By combining the two aforementioned methods, I aimed to apply successful UI patterns and
            concepts gathered from my research sessions to create a cohesive and personally tailored
            final product.
          </p>
        </div>
      </section>

      <section className="fintech-case__block">
        <h2 className="fintech-case__heading">User Persona</h2>
        <p className="fintech-case__intro">
          With my research complete, I formulated 2 user personas to better guide my design process
          whilst visually documenting the platform’s needs.
        </p>
      </section>

      <div className="fintech-case__personas">
        <article className="fintech-persona">
          <PersonaTicks />
          <div className="fintech-persona__top">
            <div className="fintech-persona__photo fintech-persona__photo--isha">
              <img alt="" src={projectAssets.fintechIsha} />
            </div>
            <div className="fintech-persona__intro">
              <p className="fintech-persona__name">Isha Singh</p>
              <p className="fintech-persona__role">Call Center Agent, 3 yrs experience</p>
              <p className="fintech-persona__quote fintech-persona__quote--medium">
                “I need to navigate to the correct pages before the person I have on call loses
                patience.”
              </p>
            </div>
          </div>
          <div className="fintech-persona__bottom">
            <div className="fintech-persona__col">
              <p className="fintech-persona__label">Goals</p>
              <ol>
                <li>
                  Resolve calls quickly, reduce hold time, surface account info without deep
                  navigation
                </li>
              </ol>
            </div>
            <div className="fintech-persona__col">
              <p className="fintech-persona__label">Frustrations</p>
              <ol>
                <li>Cluttered layout made it hard to find key info mid-call</li>
                <li>Harsh lines increases visual fatigue</li>
                <li>
                  Fragmented information makes it hard to formulate action plan with someone on the
                  line
                </li>
              </ol>
            </div>
          </div>
        </article>
        <article className="fintech-persona">
          <PersonaTicks />
          <div className="fintech-persona__top">
            <div className="fintech-persona__photo fintech-persona__photo--jason">
              <img alt="" src={projectAssets.fintechJason} />
            </div>
            <div className="fintech-persona__intro">
              <p className="fintech-persona__name">Jason Smith</p>
              <p className="fintech-persona__role">
                Senior Financial Account Manager, 10 yrs experience
              </p>
              <p className="fintech-persona__quote fintech-persona__quote--strong">
                “I want a clear picture of the accounts I need to oversee, without having to dig for
                it.”
              </p>
            </div>
          </div>
          <div className="fintech-persona__bottom">
            <div className="fintech-persona__col">
              <p className="fintech-persona__label">Goals</p>
              <ol>
                <li>
                  Quickly understand account health, identify accounts requiring action, and keep
                  client commitments on track
                </li>
                <li>Monitor account sentiment w/o clicking through pages manually.</li>
              </ol>
            </div>
            <div className="fintech-persona__col">
              <p className="fintech-persona__label">Frustrations</p>
              <ol>
                <li>
                  Information scattered across pages; unclear account ownership; urgent issues
                  buried in tables; outdated or inconsistent data.
                </li>
              </ol>
            </div>
          </div>
        </article>
      </div>

      <section className="fintech-case__block">
        <h2 className="fintech-case__heading">Process and Results</h2>
        <div className="fintech-case__pills">
          <p className="fintech-case__pill">Onboarding: 4 hours → 1 hour</p>
          <p className="fintech-case__pill">Design-to-Code Generation: ~10 days → 2 days</p>
        </div>
        <div className="fintech-case__results">
          <div className="fintech-case__collage">
            <p className="fintech-case__hint">Click on images to review annotations!</p>
            <div className="fintech-case__collage-row">
              <button type="button" onClick={() => onPreview(projectAssets.fintechDesk)}>
                <img alt="Annotated one-stop-shop dashboard" src={projectAssets.fintechDesk} />
              </button>
              <button type="button" onClick={() => onPreview(projectAssets.fintechTabs)}>
                <img alt="Annotated tab navigation" src={projectAssets.fintechTabs} />
              </button>
            </div>
          </div>
          <div className="fintech-case__results-copy">
            <p>
              My redesign delivered on two fronts: a stronger foundation and a significantly cleaner
              experience. When designing, I aim to bring users what I like to call a “one stop shop”.
              Thinking of a platform as a work desk, users should have everything they need to get
              started on their work day readily available to them on one page. Account information was
              organized around focused views, key details stayed available, and employees had
              consistent access to the platform’s other tools all in one page. The navigation bar and
              side menu remained accessible without taking attention away from the account itself; I
              focused on heightening the interactivity of the navigation bar such that it didn’t stay
              static and occupy visual real estate.
            </p>
            <p>
              One thing that became clear was that reducing clutter couldn’t mean making users dig for
              information. I used tab-based navigation to organize account details while keeping
              integral data points visible without switching tabs or scrolling vertically. This was
              especially important for call center representatives, who needed to reference account
              information while maintaining a conversation, and managers, who needed a clear overview
              before looking into individual details. Inputs were grouped into focused sections to
              reduce the original “form-heavy” feel.
            </p>
          </div>
        </div>
      </section>
      <div className="fintech-case__closer">
        <div className="fintech-case__closer-col">
          <p className="fintech-case__tag">FURTHER DETAILS</p>
          <div className="fintech-case__closer-copy">
            <p>
              Throughout my design process, I regularly shared the screens with end users through
              asynchronous emails. This allowed me to receive their input while the designs were still
              being built and incorporate feedback as I went. With a quick turnaround, these exchanges
              helped me stay aligned with the people who would actually use the platform.
            </p>
            <p>
              Furthermore, to keep my changes consistent, I built a design system in Figma from the
              ground up, including tokens, variables, and a standardized component library. Every
              layer was built using a design system building block. This gave the screens a shared
              visual language and provided a clearer reference for design-to-code handoff. It also
              meant that future changes could be made through shared components and variables instead
              of updating each screen individually. Effectively, my standardized design system
              organization reduced the design-to-code generation process from 10 days to 2 days.
            </p>
          </div>
        </div>
        <div className="fintech-case__closer-col fintech-case__closer-col--end">
          <p className="fintech-case__tag">CONCLUDING THOUGHTS</p>
          <p>
            Once I delivered this product, we received resounding positive feedback from our end
            users. The platform that used to take 4 hours to onboard and train new employees on took
            1 hour due to its simplicity and easy navigability. All in all, I learned that for users
            already comfortable with a complex platform, modernization requires care. They still
            needed the information and functionality they relied on, presented in a way that was
            easier to follow. The final design reflected that balance: a more organized experience
            built around their existing work, with a foundation that could grow alongside the
            product.
          </p>
        </div>
      </div>
    </div>
  );
}

export function ProjectOverlay({
  projectId = 1,
  onClose,
  onChangeProject,
  closing = false,
}: ProjectOverlayProps) {
  const [entered, setEntered] = useState(false);
  const [previewImages, setPreviewImages] = useState(PREVIEW_IMAGES);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [previewZoom, setPreviewZoom] = useState(PREVIEW_ZOOM_MIN);
  const [previewLeaving, setPreviewLeaving] = useState(false);
  const previewTimer = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const arrowsRef = useRef<HTMLDivElement>(null);
  const swapTimer = useRef(0);
  const [swapping, setSwapping] = useState(false);
  const project = projectOverlays[projectId];
  const poster = project.demoPoster || projectAssets.overlayThumb;

  useEffect(
    () => () => {
      window.clearTimeout(previewTimer.current);
      window.clearTimeout(swapTimer.current);
    },
    [],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    let inner = 0;
    const outer = window.requestAnimationFrame(() => {
      inner = window.requestAnimationFrame(() => setEntered(true));
    });
    return () => {
      window.cancelAnimationFrame(outer);
      window.cancelAnimationFrame(inner);
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const scroller = scrollerRef.current;
    if (!root || !scroller) return;

    const onWheel = (event: WheelEvent) => {
      event.stopPropagation();
      if (scroller.contains(event.target as Node)) return;
      event.preventDefault();
      scroller.scrollTop += event.deltaY;
    };

    root.addEventListener("wheel", onWheel, { passive: false });
    return () => root.removeEventListener("wheel", onWheel);
  }, []);

  const openPreview = (src: string, images: string[] = PREVIEW_IMAGES) => {
    const index = images.indexOf(src);
    setPreviewImages(images);
    window.clearTimeout(previewTimer.current);
    setPreviewLeaving(false);
    setPreviewZoom(PREVIEW_ZOOM_MIN);
    setPreviewIndex(index < 0 ? 0 : index);
  };

  const showPreviewImage = (index: number) => {
    setPreviewZoom(PREVIEW_ZOOM_MIN);
    setPreviewIndex(index);
  };

  const closePreview = () => {
    if (previewIndex === null || previewLeaving) return;
    setPreviewLeaving(true);
    previewTimer.current = window.setTimeout(() => {
      setPreviewIndex(null);
      setPreviewZoom(PREVIEW_ZOOM_MIN);
      setPreviewLeaving(false);
    }, 320);
  };

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: 0 });
    setPreviewIndex(null);
    setPreviewZoom(PREVIEW_ZOOM_MIN);
    setPreviewLeaving(false);
  }, [projectId]);

  const goToProject = (id: ProjectId) => {
    if (swapping || id === projectId) return;
    setSwapping(true);
    swapTimer.current = window.setTimeout(() => {
      onChangeProject(id);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setSwapping(false));
      });
    }, 280);
  };

  const closeIfOutsideBoard = (event: MouseEvent) => {
    if (previewIndex !== null) return;
    const target = event.target as Node;
    if (boardRef.current?.contains(target)) return;
    if (arrowsRef.current?.contains(target)) return;
    onClose();
  };
  const previousProject = neighborProject(projectId, -1);
  const nextProject = neighborProject(projectId, 1);
  const shown = entered && !closing;

  return (
    <div
      ref={rootRef}
      className={`project-overlay${shown ? " is-in" : ""}${closing ? " is-out" : ""}`}
      role="dialog"
      aria-label={project.title}
      onClick={closeIfOutsideBoard}
    >
      <div className="project-overlay__fog" aria-hidden="true" />

      <div className="project-overlay__stage">
        <div className="project-overlay__arrows" ref={arrowsRef}>
          <button
            type="button"
            className="project-overlay__btn"
            aria-label="Back"
            onClick={onClose}
          >
            <img alt="" src={projectAssets.arrowLeft} width={20} height={20} />
          </button>
          <div className="project-overlay__arrows-end">
            <button
              type="button"
              className="project-overlay__btn"
              aria-label={`Go to Project ${previousProject}`}
              onClick={() => goToProject(previousProject)}
            >
              <img alt="" src={projectAssets.arrowUp} width={20} height={20} />
              <span className="project-overlay__tip">Go to Project {previousProject}</span>
            </button>
            <button
              type="button"
              className="project-overlay__btn"
              aria-label={`Go to Project ${nextProject}`}
              onClick={() => goToProject(nextProject)}
            >
              <img alt="" src={projectAssets.arrowDown} width={20} height={20} />
              <span className="project-overlay__tip">Go to Project {nextProject}</span>
            </button>
          </div>
        </div>

        <div
          className={`project-overlay__board${swapping ? " is-swapping" : ""}`}
          ref={boardRef}
        >
          <div className="project-overlay__paper">
            <div className="project-overlay__title-row">
              <p className="project-overlay__number">{project.number}</p>
              <p className="project-overlay__title">{project.title}</p>
            </div>

            <div ref={scrollerRef} className="project-overlay__scroll">
              {projectId === 1 ? (
                <FintechCase onPreview={openPreview} />
              ) : projectId === 2 ? (
                <CallCenterCase onPreview={openPreview} />
              ) : projectId === 3 ? (
                <DashboardCase onPreview={openPreview} />
              ) : projectId === 4 ? (
                <DesignSystemCase />
              ) : projectId === 5 ? (
                <WcagCase />
              ) : (
                <OverlayCase project={project} poster={poster} />
              )}
            </div>
          </div>
        </div>
        {previewIndex !== null ? (
        <div className={`project-overlay__viewer${previewLeaving ? " is-out" : ""}`}>
          <button
            className="project-overlay__viewer-scrim"
            type="button"
            aria-label="Close image"
            onClick={closePreview}
          />
          <button
            className="project-overlay__viewer-nav project-overlay__viewer-nav--prev"
            type="button"
            aria-label="Previous image"
            disabled={previewIndex === 0}
            style={{
              left:
                51 +
                (1032 - Math.round(PREVIEW_HEIGHT * (PREVIEW_RATIO.get(previewImages[previewIndex]) ?? 1))) / 2 -
                50,
            }}
            onClick={() => showPreviewImage(previewIndex - 1)}
          >
            <img alt="" src={projectAssets.arrowLeft} width={14} height={14} />
          </button>
          <button
            className={`project-overlay__viewer-shot${previewZoom > PREVIEW_ZOOM_MIN ? " is-zoomed" : ""}`}
            type="button"
            aria-label={previewZoom > PREVIEW_ZOOM_MIN ? "Zoom out" : "Zoom in"}
            style={{
              width: Math.round(PREVIEW_HEIGHT * (PREVIEW_RATIO.get(previewImages[previewIndex]) ?? 1)),
              left: 51 + (1032 - Math.round(PREVIEW_HEIGHT * (PREVIEW_RATIO.get(previewImages[previewIndex]) ?? 1))) / 2,
            }}
            onClick={() =>
              setPreviewZoom((current) =>
                current > PREVIEW_ZOOM_MIN ? PREVIEW_ZOOM_MIN : PREVIEW_ZOOM_MAX,
              )
            }
          >
            <img alt="" src={previewImages[previewIndex]} draggable={false} />
          </button>
          <button
            className="project-overlay__viewer-nav project-overlay__viewer-nav--next"
            type="button"
            aria-label="Next image"
            disabled={previewIndex === previewImages.length - 1}
            style={{
              left:
                51 +
                (1032 - Math.round(PREVIEW_HEIGHT * (PREVIEW_RATIO.get(previewImages[previewIndex]) ?? 1))) / 2 +
                Math.round(PREVIEW_HEIGHT * (PREVIEW_RATIO.get(previewImages[previewIndex]) ?? 1)) +
                16,
            }}
            onClick={() => showPreviewImage(previewIndex + 1)}
          >
            <img alt="" src={projectAssets.arrowLeft} width={14} height={14} />
          </button>
        </div>
      ) : null}
      </div>
    </div>
  );
}
