import { useEffect, useRef, useState } from "react";
import { projectAssets } from "../assets/projects";
import { ProjectOverlay } from "../components/ProjectOverlay";
import { projectsCopy } from "../content/projects";
import {
  hitRect,
  neighborIds,
  projectCopy,
  TAG_FONT_SIZE,
  TAG_PAD_X,
  TAG_WARP,
  stackGroupPose,
  tagAnchorTop,
  tagMetrics,
  tagPath,
  tagSkewAngle,
  spotlightLayouts,
  visualSide,
  type ProjectId,
  type Rect,
  type SlotLayout,
  type SpotlightId,
  type TagLayout,
} from "../content/projectCarousel";
import { useProjectSpotlight } from "../hooks/useProjectSpotlight";
import "./ProjectsPage.css";

const PROJECT_IDS: ProjectId[] = [1, 2, 3, 4, 5];

const PIXELS_LEFT = [
  { color: "#3270a3", left: 0, top: 25 },
  { color: "#4981ae", left: 25, top: 25 },
  { color: "#c0383a", left: 25, top: 50 },
  { color: "#cf6567", left: 50, top: 75 },
  { color: "#eaacad", left: 75, top: 75 },
  { color: "#eac3ac", left: 100, top: 75 },
  { color: "#de9063", left: 125, top: 75 },
  { color: "#7fb4df", left: 50, top: 25 },
  { color: "#b4d5f1", left: 50, top: 0 },
] as const;

const PIXELS_RIGHT = [
  { color: "#c0383a", left: 25, top: 0 },
  { color: "#3270a3", left: 50, top: 0 },
  { color: "#ca494b", left: 0, top: 25 },
  { color: "#d56264", left: 25, top: 50 },
] as const;

const STACK_IMAGES: Record<1 | 2 | 3, string[]> = {
  1: [projectAssets.int3, projectAssets.int2, projectAssets.int1],
  2: [projectAssets.dgc3, projectAssets.dgc2, projectAssets.dgc1],
  3: [projectAssets.ms3, projectAssets.ms2, projectAssets.ms1],
};

const PLUGIN_IMAGES: Record<4 | 5, string> = {
  4: projectAssets.dsPlugin,
  5: projectAssets.a11yPlugin,
};

function CarouselChevron() {
  return (
    <span className="project-carousel__chevron" aria-hidden="true">
      <svg viewBox="0 0 12 20" fill="none" width="12" height="20">
        <path
          d="M8.4 3.2L3.2 10l5.2 6.8"
          stroke="currentColor"
          strokeWidth="2.15"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function GrayCard({
  left,
  top,
  facing,
}: {
  left: number;
  top: number;
  facing: "left" | "right";
}) {
  return (
    <div
      className={`turned-card turned-card--${facing}`}
      style={{ left, top }}
      aria-hidden="true"
    >
      <div className="turned-card__face" />
    </div>
  );
}

function ProjectTag({
  layout,
  id,
  onOpen,
  anchor,
}: {
  layout: TagLayout;
  id: ProjectId;
  onOpen: (id: ProjectId) => void;
  anchor: SlotLayout | null;
}) {
  const copy = projectCopy[id];
  const angle = tagSkewAngle(id);
  const metrics = tagMetrics(id);
  const { width, height, notch, lines, firstLineY, lineStep } = metrics;
  const top = anchor ? tagAnchorTop(id, anchor, height) : layout.top;
  const textX = notch + TAG_PAD_X + metrics.textWidth / 2;

  return (
    <button
      type="button"
      className="project-tag"
      style={{ left: layout.left, top }}
      onClick={() => onOpen(id)}
      aria-label={`Open project ${copy.label}`}
    >
      <svg
        className="project-tag__svg"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        overflow="visible"
        aria-hidden="true"
      >
        <g transform={`rotate(${angle})`}>
          <g transform={`skewX(${TAG_WARP})`}>
            <path d={tagPath(width, height, notch)} fill="#FFC021" />
            <text
              x={textX}
              y={firstLineY}
              fill="#000"
              fontFamily='Helvetica, "Helvetica Neue", Arial, sans-serif'
              fontSize={TAG_FONT_SIZE}
              fontWeight="400"
              textAnchor="middle"
            >
              {lines.length > 1
                ? lines.map((line, index) => (
                    <tspan key={line} x={textX} y={firstLineY + index * lineStep}>
                      {line}
                    </tspan>
                  ))
                : lines[0]}
            </text>
          </g>
        </g>
      </svg>
    </button>
  );
}

function StackGroup({
  id,
  layers,
  images,
}: {
  id: 1 | 2 | 3;
  layers: Rect[];
  images: string[];
}) {
  const pose = stackGroupPose(id, layers);
  return (
    <div
      className="project-slot__stack"
      style={{
        left: pose.left,
        top: pose.top,
        width: pose.width,
        height: pose.height,
      }}
    >
      <div className="project-slot__lift">
        {images.map((src, index) => {
          const layer = pose.layers[index];
          if (!layer) return null;
          return (
            <img
              key={`${id}-layer-${index}`}
              className={`project-slot__layer${id === 1 || id === 2 ? " project-slot__layer--deck" : ""}`}
              alt=""
              src={src}
              draggable={false}
              decoding="async"
              style={{
                left: `${layer.left}%`,
                top: `${layer.top}%`,
                width: `${layer.width}%`,
                height: `${layer.height}%`,
                zIndex: index + 1,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

function ProjectSlot({
  id,
  slot,
  spotlight,
  onHover,
  onLeave,
  onOpen,
}: {
  id: ProjectId;
  slot: SlotLayout;
  spotlight: SpotlightId;
  onHover: (id: SpotlightId) => void;
  onLeave: () => void;
  onOpen: (id: ProjectId) => void;
}) {
  const copy = projectCopy[id];
  const isSpotlight = id === spotlight;
  const lastFacing = useRef<SlotLayout | null>(slot.mode === "turned" ? null : slot);
  const lastTurned = useRef(slot.turned ?? []);
  if (slot.mode !== "turned") lastFacing.current = slot;
  if (slot.turned?.length) lastTurned.current = slot.turned;

  const facing = lastFacing.current;
  const hit = hitRect(slot);
  const side = visualSide(slot, isSpotlight);
  const stackImages = id === 1 || id === 2 || id === 3 ? STACK_IMAGES[id] : null;
  const pluginImage = id === 4 || id === 5 ? PLUGIN_IMAGES[id] : null;
  const stack = facing?.stack ?? [];
  const plugin = facing?.plugin;
  const tag = slot.tag ?? facing?.tag;
  const turnedCards = slot.turned?.length ? slot.turned : lastTurned.current;

  return (
    <div
      className={[
        "project-slot",
        `project-slot--${id}`,
        `project-slot--${slot.mode}`,
        `is-${side}`,
        isSpotlight ? "is-spotlight" : "",
      ].join(" ")}
    >
      <p
        className={`projects__number${isSpotlight ? " is-spotlight" : ""}`}
        style={{ left: slot.number.left, top: slot.number.top }}
      >
        {isSpotlight ? (
          <>
            <span>{copy.label[0]}</span>
            <span>{copy.label[1]}</span>
          </>
        ) : (
          copy.label
        )}
      </p>

      <div className="project-slot__front">
        {stackImages && stack.length > 0 ? (
          <StackGroup id={id as 1 | 2 | 3} layers={stack} images={stackImages} />
        ) : null}

        {pluginImage && plugin ? (
          <div
            className="project-slot__card"
            style={{
              left: plugin.card.left,
              top: plugin.card.top,
              width: plugin.card.width,
              height: plugin.card.height,
            }}
          >
            <div className="project-slot__lift">
              <img
                className="project-slot__plugin-shot"
                alt=""
                src={pluginImage}
                draggable={false}
                decoding="async"
              />
            </div>
          </div>
        ) : null}
      </div>

      <div className="project-slot__back">
        {turnedCards.map((card, index) => (
          <GrayCard
            key={`${id}-turned-${index}`}
            left={card.left}
            top={card.top}
            facing={card.facing}
          />
        ))}
      </div>

      {tag ? (
        <ProjectTag layout={tag} id={id} onOpen={onOpen} anchor={facing} />
      ) : null}

      {hit ? (
        <button
          type="button"
          className="project-slot__hit"
          aria-label={`Open project ${copy.label}`}
          style={{
            left: hit.left,
            top: hit.top,
            width: hit.width,
            height: hit.height,
          }}
          onMouseEnter={() => onHover(id)}
          onMouseLeave={onLeave}
          onFocus={() => onHover(id)}
          onBlur={onLeave}
          onClick={() => onOpen(id)}
        />
      ) : null}
    </div>
  );
}

export function ProjectsPage() {
  const { spotlight, hoverProject, advanceSide, cancelHover } = useProjectSpotlight();
  const [overlay, setOverlay] = useState<"closed" | "open" | "out">("closed");
  const [overlayId, setOverlayId] = useState<ProjectId>(1);
  const [hint, setHint] = useState<"left" | "right" | null>(null);
  const closeTimer = useRef<number | null>(null);
  const layout = spotlightLayouts[spotlight];
  const { left, right } = neighborIds(spotlight);
  const overlayOpen = overlay !== "closed";

  const hover = (id: SpotlightId) => {
    if (overlayOpen) return;
    if (id === left) setHint("left");
    else if (id === right) setHint("right");
    else setHint(null);
    hoverProject(id);
  };

  const leave = () => {
    setHint(null);
    if (!overlayOpen) cancelHover();
  };

  const clickSide = (side: "left" | "right") => {
    if (overlayOpen) return;
    setHint(side);
    advanceSide(side);
  };

  useEffect(() => {
    if (overlayOpen || !hint) return;
    hoverProject(hint === "left" ? left : right);
  }, [spotlight, hint, left, right, overlayOpen, hoverProject]);

  useEffect(() => {
    return () => {
      if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    };
  }, []);

  const openOverlay = (id: ProjectId) => {
    setHint(null);
    cancelHover();
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    setOverlayId(id);
    setOverlay("open");
  };

  const closeOverlay = () => {
    setOverlay("out");
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOverlay("closed"), 380);
  };

  return (
    <section className="page" aria-label="Projects">
      <div
        className={`projects${overlayOpen ? " is-overlay" : ""}`}
        data-spotlight={spotlight}
        data-hint={hint ?? undefined}
      >
        <div className="projects__paper" aria-hidden="true">
          <img alt="" src={projectAssets.notebookPaper} width={1680} height={893} />
          <div className="projects__paper-fill" />
        </div>

        <div className="projects__macbook" aria-hidden="true">
          <img alt="" src={projectAssets.macbookFrame} />
        </div>

        {PROJECT_IDS.map((id) => (
          <ProjectSlot
            key={id}
            id={id}
            slot={layout[id]}
            spotlight={spotlight}
            onHover={hover}
            onLeave={leave}
            onOpen={openOverlay}
          />
        ))}

        <button
          type="button"
          className="project-carousel__rail project-carousel__rail--left"
          aria-label={`Show project ${projectCopy[left].label}`}
          onMouseEnter={() => hover(left)}
          onMouseLeave={leave}
          onFocus={() => hover(left)}
          onBlur={leave}
          onClick={() => clickSide("left")}
        >
          <CarouselChevron />
        </button>
        <button
          type="button"
          className="project-carousel__rail project-carousel__rail--right"
          aria-label={`Show project ${projectCopy[right].label}`}
          onMouseEnter={() => hover(right)}
          onMouseLeave={leave}
          onFocus={() => hover(right)}
          onBlur={leave}
          onClick={() => clickSide("right")}
        >
          <CarouselChevron />
        </button>

        <div className="projects__pixels projects__pixels--left" aria-hidden="true">
          {PIXELS_LEFT.map((pixel) => (
            <span
              key={`${pixel.color}-${pixel.left}-${pixel.top}`}
              className="projects__pixel"
              style={{ background: pixel.color, left: pixel.left, top: pixel.top }}
            />
          ))}
        </div>

        <div className="projects__pixels projects__pixels--right" aria-hidden="true">
          {PIXELS_RIGHT.map((pixel) => (
            <span
              key={`${pixel.color}-${pixel.left}-${pixel.top}`}
              className="projects__pixel"
              style={{ background: pixel.color, left: pixel.left, top: pixel.top }}
            />
          ))}
        </div>

        <div className="projects__heading">
          <p>{projectsCopy.youAreOn}</p>
          <p>{projectsCopy.title}</p>
        </div>

        <p className="projects__goto-label">{projectsCopy.goToLabel}</p>
        <ol className="projects__goto">
          {projectsCopy.links.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ol>

        {overlay !== "closed" ? (
          <ProjectOverlay
            projectId={overlayId}
            closing={overlay === "out"}
            onClose={closeOverlay}
            onChangeProject={setOverlayId}
          />
        ) : null}
      </div>
    </section>
  );
}
