import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
import { aboutAssets } from "../assets/about";
import { aboutCopy } from "../content/about";
import "./AboutPage.css";

/** How far the second and third folders travel, from the step-1 frame. */
const DO_DROP = 642;
const WORK_DROP = 744;

/** First-folder slide into the step-2 frame. */
const WHO_SHIFT_X = 761;
const WHO_SHIFT_Y = -10;
const WHO_PHOTO_X = 695;
const WHO_PHOTO_Y = -1;

/** Second-folder open: other folders drop, then the red folder slides in. */
const WHO_DROP_FOR_DO = 1035;
const WORK_DROP_FOR_DO = 1034;
const DO_STAGGER_MS = 200;
const DO_SLIDE_MS = 900;
const DO_SHIFT_X = 415;
const DO_PHOTO_X = -63;

const FOLDER = { left: -761, top: 69, right: 559, bottom: 1433 };
const STAMP_HOME = { left: -340, top: 718 };
const NOTE_HOME = { left: 117.53 - WHO_SHIFT_X, top: 796 - WHO_SHIFT_Y };
const NOTE_BOX = { width: 232.431, height: 193 };
const NOTE_MAX = 200;
const NOTE_DRAG = 6;
const STAMP_W = 175;
const STAMP_H = 233;
/** Black base center inside the stamper image, in design pixels. */
const STAMP_BASE = { x: 84.1, y: 128.2 };
const MARK_W = 81;
const MARK_H = 77;

type Box = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type Crop = {
  left: string;
  top: string;
  width: string;
  height: string;
};

function FolderShape({
  src,
  box,
  className,
}: {
  src: string;
  box: Box;
  className?: string;
}) {
  return (
    <div
      className={className ? `about-folder-shape ${className}` : "about-folder-shape"}
      style={box}
      aria-hidden="true"
    >
      <div className="about-folder-shape__inner">
        <img alt="" src={src} />
      </div>
    </div>
  );
}

function FolderTab({
  label,
  left,
  top,
  className,
}: {
  label: string;
  left: number;
  top: number;
  className?: string;
}) {
  return (
    <div
      className={className ? `about-tab ${className}` : "about-tab"}
      style={{ left, top }}
      aria-hidden="true"
    >
      <span>{label}</span>
    </div>
  );
}

function Photo({
  src,
  box,
  crop,
}: {
  src: string;
  box: Box;
  crop?: Crop;
}) {
  return (
    <div className="about-photo" style={box} aria-hidden="true">
      {crop ? (
        <img alt="" src={src} style={crop} />
      ) : (
        <img className="about-photo__cover" alt="" src={src} />
      )}
    </div>
  );
}

function SpinPhoto({
  src,
  box,
  deg,
  inner,
}: {
  src: string;
  box: Box;
  deg: number;
  inner: { width: number; height: number };
}) {
  return (
    <div className="about-spin" style={box} aria-hidden="true">
      <div
        className="about-spin__inner"
        style={{
          width: inner.width,
          height: inner.height,
          transform: `rotate(${deg}deg)`,
        }}
      >
        <img className="about-photo__cover" alt="" src={src} />
      </div>
    </div>
  );
}

const REEL = { cx: 144, cy: 577, r: 482 };
const FILM_W = 148;
const FILM_H = 128;
const FILM_GAP = 16;
const FILM_RING = REEL.r - FILM_H / 2 - FILM_GAP;

function FilmFrame({ src, angle }: { src: string; angle: number }) {
  const rad = (angle * Math.PI) / 180;
  const cx = REEL.cx + FILM_RING * Math.cos(rad);
  const cy = REEL.cy + FILM_RING * Math.sin(rad);
  const tilt = angle + 90;
  return (
    <div
      className="about-film__frame"
      style={{
        left: cx - FILM_W / 2,
        top: cy - FILM_H / 2,
        width: FILM_W,
        height: FILM_H,
        transform: `rotate(${tilt}deg)`,
      }}
      aria-hidden="true"
    >
      <img alt="" src={src} />
      <div className="about-filter" aria-hidden="true" />
    </div>
  );
}

const FILM: Array<{ src: string; angle: number }> = [
  { src: aboutAssets.filmSeverance, angle: -90 },
  { src: aboutAssets.filmNathan, angle: -45 },
  { src: aboutAssets.filmIsleOfDogs, angle: 0 },
  { src: aboutAssets.filmFfxv, angle: 45 },
  { src: aboutAssets.filmBourdain, angle: 90 },
  { src: aboutAssets.filmVince, angle: 135 },
  { src: aboutAssets.filmZelda, angle: 180 },
  { src: aboutAssets.filmSpiderverse, angle: -135 },
];

const REEL_COAST_MS = 1000;

const SPIN_HOME = { left: 469.33, top: 868.98 };
const SPIN_BOX = { width: 185.423, height: 178.048 };
const DO_AREA = { left: 0, top: 69, right: 1349, bottom: 1433 };

function clampSpin(left: number, top: number) {
  return {
    left: Math.max(DO_AREA.left, Math.min(DO_AREA.right - SPIN_BOX.width, left)),
    top: Math.max(DO_AREA.top, Math.min(DO_AREA.bottom - SPIN_BOX.height, top)),
  };
}

function pointerInDoLayer(
  clientX: number,
  clientY: number,
  layer: HTMLElement,
) {
  const rect = layer.getBoundingClientRect();
  const sx = rect.width / 1920;
  const sy = rect.height / 1080;
  if (sx < 0.01 || sy < 0.01) return { x: 0, y: 0 };
  return {
    x: (clientX - rect.left) / sx,
    y: (clientY - rect.top) / sy,
  };
}

function unwrapDegrees(delta: number) {
  if (delta > 180) return delta - 360;
  if (delta < -180) return delta + 360;
  return delta;
}

function FilmReel({
  active,
  hitRef,
}: {
  active: boolean;
  hitRef: RefObject<HTMLButtonElement | null>;
}) {
  const spinRef = useRef<HTMLDivElement>(null);
  const drag = useRef({
    holding: false,
    lastAngle: 0,
    lastTime: 0,
    velocity: 0,
    spin: 0,
    raf: 0,
  });
  const [holding, setHolding] = useState(false);

  const applySpin = (deg: number) => {
    drag.current.spin = deg;
    const node = spinRef.current;
    if (node) node.style.transform = `rotate(${deg}deg)`;
  };

  const angleAt = (clientX: number, clientY: number) => {
    const node = spinRef.current;
    if (!node) return 0;
    const rect = node.getBoundingClientRect();
    const cx = rect.left + (REEL.cx / 1920) * rect.width;
    const cy = rect.top + (REEL.cy / 1080) * rect.height;
    return (Math.atan2(clientY - cy, clientX - cx) * 180) / Math.PI;
  };

  const stopCoast = () => {
    window.cancelAnimationFrame(drag.current.raf);
    drag.current.raf = 0;
  };

  const coast = () => {
    stopCoast();
    const start = drag.current.spin;
    let distance = drag.current.velocity * REEL_COAST_MS * 0.5;
    distance = Math.max(-420, Math.min(420, distance));
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / REEL_COAST_MS);
      const eased = 1 - (1 - t) ** 3;
      applySpin(start + distance * eased);
      if (t < 1) drag.current.raf = requestAnimationFrame(tick);
    };
    drag.current.raf = requestAnimationFrame(tick);
  };

  useEffect(() => () => stopCoast(), []);

  const onPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!active) return;
    event.preventDefault();
    event.stopPropagation();
    stopCoast();
    event.currentTarget.setPointerCapture(event.pointerId);
    const angle = angleAt(event.clientX, event.clientY);
    drag.current.holding = true;
    drag.current.lastAngle = angle;
    drag.current.lastTime = performance.now();
    drag.current.velocity = 0;
    setHolding(true);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!drag.current.holding) return;
    const angle = angleAt(event.clientX, event.clientY);
    const step = unwrapDegrees(angle - drag.current.lastAngle);
    const now = performance.now();
    const dt = now - drag.current.lastTime;
    applySpin(drag.current.spin + step);
    drag.current.velocity = dt > 0 && dt < 64 ? step / dt : 0;
    drag.current.lastAngle = angle;
    drag.current.lastTime = now;
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!drag.current.holding) return;
    drag.current.holding = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setHolding(false);
    coast();
  };

  return (
    <>
      <div className="about-film__spin" ref={spinRef}>
        <div className="about-film__reel">
          <img alt="" src={aboutAssets.filmReel} />
        </div>
        <div className="about-film__ring about-film__ring--blue">
          <img alt="" src={aboutAssets.filmReelRing} />
        </div>
        <div className="about-film__ring about-film__ring--red">
          <img alt="" src={aboutAssets.filmReelRingInner} />
        </div>
        {FILM.map((frame, index) => (
          <FilmFrame key={index} {...frame} />
        ))}
      </div>
      <button
        ref={hitRef}
        type="button"
        className={holding ? "about-film__hit about-film__hit--held" : "about-film__hit"}
        aria-label="Rotate film reel"
        disabled={!active}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      />
    </>
  );
}

function SpinTab({
  active,
  rest,
  tabRef,
}: {
  active: boolean;
  rest: boolean;
  tabRef: RefObject<HTMLButtonElement | null>;
}) {
  const layerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(SPIN_HOME);
  const grabRef = useRef({ x: 0, y: 0 });
  const holdingRef = useRef(false);
  const [pos, setPos] = useState(SPIN_HOME);
  const [holding, setHolding] = useState(false);

  useEffect(() => {
    if (!rest) return;
    holdingRef.current = false;
    posRef.current = SPIN_HOME;
    setPos(SPIN_HOME);
    setHolding(false);
  }, [rest]);

  useEffect(() => {
    if (!holding) return;
    const move = (event: PointerEvent) => {
      const layer = layerRef.current;
      if (!layer) return;
      const point = pointerInDoLayer(event.clientX, event.clientY, layer);
      const next = clampSpin(point.x - grabRef.current.x, point.y - grabRef.current.y);
      posRef.current = next;
      setPos(next);
    };
    const up = () => {
      holdingRef.current = false;
      setHolding(false);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [holding]);

  const onPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!active || holdingRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    const layer = layerRef.current;
    if (!layer) return;
    const point = pointerInDoLayer(event.clientX, event.clientY, layer);
    grabRef.current = {
      x: point.x - posRef.current.left,
      y: point.y - posRef.current.top,
    };
    holdingRef.current = true;
    setHolding(true);
  };

  return (
    <div className="about-spin-layer" ref={layerRef}>
      <div
        className={holding ? "about-spin-tab about-spin-tab--held" : "about-spin-tab"}
        style={{ left: pos.left, top: pos.top }}
      >
        <button
          ref={tabRef}
          type="button"
          className="about-spin-tab__note"
          aria-label={aboutCopy.spinMe}
          disabled={!active}
          onPointerDown={onPointerDown}
        >
          {aboutCopy.spinMe}
        </button>
      </div>
    </div>
  );
}

const COLLAGE: Array<
  | { type: "photo"; src: string; box: Box; crop?: Crop }
  | { type: "spin"; src: string; box: Box; deg: number; inner: { width: number; height: number } }
> = [
  {
    type: "spin",
    src: aboutAssets.kaytranadaVinyl,
    box: { left: -171, top: -174, width: 588.261, height: 588.261 },
    deg: 45.76,
    inner: { width: 416, height: 416 },
  },
  {
    type: "photo",
    src: aboutAssets.isseyMiyake,
    box: { left: 181, top: 377, width: 203, height: 304 },
  },
  {
    type: "photo",
    src: aboutAssets.limboVinyl,
    box: { left: 271, top: 508, width: 406, height: 395 },
    crop: { left: "-7.24%", top: "-27.82%", width: "113.07%", height: "155.09%" },
  },
  {
    type: "photo",
    src: aboutAssets.lumix,
    box: { left: 184, top: -66, width: 533, height: 280 },
  },
  {
    type: "photo",
    src: aboutAssets.fkaTwigs,
    box: { left: -39, top: 755, width: 351, height: 356 },
  },
  {
    type: "photo",
    src: aboutAssets.breville,
    box: { left: -11, top: 214, width: 294, height: 326 },
    crop: { left: "-13.79%", top: "-9.44%", width: "130.92%", height: "118.17%" },
  },
  {
    type: "spin",
    src: aboutAssets.brooks,
    box: { left: 208, top: 113, width: 371.215, height: 439.146 },
    deg: 7.97,
    inner: { width: 319.021, height: 398.777 },
  },
  {
    type: "photo",
    src: aboutAssets.castIron,
    box: { left: 101, top: 665, width: 178, height: 178 },
  },
  {
    type: "photo",
    src: aboutAssets.anthonyBourdain,
    box: { left: -174, top: 399, width: 507, height: 380 },
  },
  {
    type: "photo",
    src: aboutAssets.nathan,
    box: { left: 308, top: 705, width: 257, height: 343 },
  },
  {
    type: "photo",
    src: aboutAssets.playstation,
    box: { left: -11, top: 670, width: 81, height: 79 },
  },
  {
    type: "photo",
    src: aboutAssets.leonJacket,
    box: { left: 208, top: 599, width: 132, height: 189 },
  },
  {
    type: "photo",
    src: aboutAssets.rimowa,
    box: { left: -26, top: 644, width: 153, height: 306 },
    crop: { left: "-143.66%", top: "-3.15%", width: "373.65%", height: "105.12%" },
  },
  {
    type: "photo",
    src: aboutAssets.leLabo,
    box: { left: 248, top: 159, width: 110, height: 165 },
  },
  {
    type: "photo",
    src: aboutAssets.chocobo,
    box: { left: 39, top: 612, width: 186, height: 186 },
  },
  {
    type: "photo",
    src: aboutAssets.link,
    box: { left: 393, top: 297, width: 261, height: 266 },
  },
  {
    type: "photo",
    src: aboutAssets.letterboxd,
    box: { left: 312, top: 482, width: 94, height: 94 },
  },
  {
    type: "photo",
    src: aboutAssets.imdb,
    box: { left: 235, top: 779, width: 105, height: 121 },
  },
  {
    type: "photo",
    src: aboutAssets.complex,
    box: { left: 283, top: 710, width: 76, height: 87 },
    crop: { left: "-51.01%", top: "0", width: "202.7%", height: "100%" },
  },
];

type Mark = { id: number; left: number; top: number };
type Phase = "rest" | "down" | "open";

function pointerInStampSpace(
  clientX: number,
  clientY: number,
  stamp: HTMLElement,
  pos: { left: number; top: number },
) {
  const rect = stamp.getBoundingClientRect();
  const sx = rect.width / STAMP_W;
  const sy = rect.height / STAMP_H;
  if (sx < 0.01 || sy < 0.01) return { x: pos.left, y: pos.top };
  return {
    x: pos.left + (clientX - rect.left) / sx,
    y: pos.top + (clientY - rect.top) / sy,
  };
}

function pointInFolder(x: number, y: number) {
  return x >= FOLDER.left && x <= FOLDER.right && y >= FOLDER.top && y <= FOLDER.bottom;
}

function clampNote(left: number, top: number) {
  return {
    left: Math.max(FOLDER.left, Math.min(FOLDER.right - NOTE_BOX.width, left)),
    top: Math.max(FOLDER.top, Math.min(FOLDER.bottom - NOTE_BOX.height, top)),
  };
}

function pointerInNoteSpace(
  clientX: number,
  clientY: number,
  note: HTMLElement,
  pos: { left: number; top: number },
) {
  const rect = note.getBoundingClientRect();
  const sx = rect.width / NOTE_BOX.width;
  const sy = rect.height / NOTE_BOX.height;
  if (sx < 0.01 || sy < 0.01) return { x: pos.left, y: pos.top };
  return {
    x: pos.left + (clientX - rect.left) / sx,
    y: pos.top + (clientY - rect.top) / sy,
  };
}

function noteFits(el: HTMLTextAreaElement, value: string) {
  const stored = el.value;
  el.value = value;
  const fits = el.scrollHeight <= el.clientHeight + 1;
  el.value = stored;
  return fits;
}

function WhoSticky({
  active,
  rest,
  noteRef,
  inputRef,
}: {
  active: boolean;
  rest: boolean;
  noteRef: RefObject<HTMLDivElement | null>;
  inputRef: RefObject<HTMLTextAreaElement | null>;
}) {
  const posRef = useRef(NOTE_HOME);
  const grabRef = useRef({ x: 0, y: 0 });
  const drag = useRef({ holding: false, moved: false, x: 0, y: 0 });
  const [pos, setPos] = useState(NOTE_HOME);
  const [holding, setHolding] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!rest) return;
    drag.current.holding = false;
    posRef.current = NOTE_HOME;
    setPos(NOTE_HOME);
    setHolding(false);
  }, [rest]);

  useEffect(() => {
    if (!holding) return;
    const move = (event: PointerEvent) => {
      const node = noteRef.current;
      if (!node) return;
      const dx = event.clientX - drag.current.x;
      const dy = event.clientY - drag.current.y;
      if (!drag.current.moved && dx * dx + dy * dy < NOTE_DRAG * NOTE_DRAG) return;
      if (!drag.current.moved) {
        drag.current.moved = true;
        inputRef.current?.blur();
      }
      const point = pointerInNoteSpace(event.clientX, event.clientY, node, posRef.current);
      const next = clampNote(point.x - grabRef.current.x, point.y - grabRef.current.y);
      posRef.current = next;
      setPos(next);
    };
    const up = () => {
      const wasDrag = drag.current.moved;
      drag.current.holding = false;
      setHolding(false);
      if (!wasDrag && active) inputRef.current?.focus();
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [holding, active, noteRef, inputRef]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!active) return;
    const typing =
      event.target === inputRef.current && document.activeElement === inputRef.current;
    if (typing) return;
    event.preventDefault();
    event.stopPropagation();
    const node = noteRef.current;
    if (!node) return;
    const point = pointerInNoteSpace(event.clientX, event.clientY, node, posRef.current);
    grabRef.current = {
      x: point.x - posRef.current.left,
      y: point.y - posRef.current.top,
    };
    drag.current.holding = true;
    drag.current.moved = false;
    drag.current.x = event.clientX;
    drag.current.y = event.clientY;
    setHolding(true);
  };

  const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const next = event.target.value;
    if (next.length > NOTE_MAX) return;
    if (!noteFits(event.currentTarget, next)) return;
    setText(next);
  };

  return (
    <div
      ref={noteRef}
      className={holding ? "about-who-sticky about-who-sticky--held" : "about-who-sticky"}
      style={{ left: pos.left, top: pos.top }}
      onPointerDown={onPointerDown}
    >
      <div className="about-who-sticky__note">
        <textarea
          ref={inputRef}
          className="about-who-sticky__input"
          value={text}
          maxLength={NOTE_MAX}
          placeholder={aboutCopy.stickyPlaceholder}
          spellCheck={false}
          disabled={!active}
          aria-label="Sticky note"
          onChange={onChange}
          onKeyDown={(event) => {
            if (event.key !== "Escape") return;
            event.stopPropagation();
            event.currentTarget.blur();
          }}
        />
      </div>
    </div>
  );
}

function TamilMark() {
  return (
    <span className="about-mark__ring" aria-hidden="true">
      <img className="about-mark__top" alt="" src={aboutAssets.stampTop} />
      <img className="about-mark__bottom" alt="" src={aboutAssets.stampBottom} />
    </span>
  );
}

export function AboutPage() {
  const aboutRef = useRef<HTMLDivElement>(null);
  const stampRef = useRef<HTMLButtonElement>(null);
  const whoNoteRef = useRef<HTMLDivElement>(null);
  const whoNoteInputRef = useRef<HTMLTextAreaElement>(null);
  const holdingRef = useRef(false);
  const grabRef = useRef({ x: 0, y: 0 });
  const stampPosRef = useRef(STAMP_HOME);
  const markId = useRef(0);
  const openingRef = useRef(true);
  const doOpeningRef = useRef(true);
  const workOpeningRef = useRef(false);
  const phaseRef = useRef<Phase>("rest");
  const doPhaseRef = useRef<Phase>("rest");
  const workPhaseRef = useRef<Phase>("rest");
  const boundsRef = useRef<HTMLDivElement>(null);
  const doBoundsRef = useRef<HTMLDivElement>(null);
  const workBoundsRef = useRef<HTMLDivElement>(null);
  const reelHitRef = useRef<HTMLButtonElement>(null);
  const spinTabRef = useRef<HTMLButtonElement>(null);
  const [phase, setPhase] = useState<Phase>("rest");
  const [doPhase, setDoPhase] = useState<Phase>("rest");
  const [workPhase, setWorkPhase] = useState<Phase>("rest");
  const [doClosing, setDoClosing] = useState(false);
  const [stampOn, setStampOn] = useState(false);
  const [holding, setHolding] = useState(false);
  const [pressing, setPressing] = useState(false);
  const [returning, setReturning] = useState(false);
  const [stampPos, setStampPos] = useState(STAMP_HOME);
  const [marks, setMarks] = useState<Mark[]>([]);
  const pressTimer = useRef(0);

  useEffect(() => {
    holdingRef.current = holding;
  }, [holding]);

  useEffect(() => {
    const sources = [
      aboutAssets.tornPaper,
      aboutAssets.noteText,
      aboutAssets.clip,
      aboutAssets.stamper,
      aboutAssets.filmReel,
      aboutAssets.filmReelRing,
      aboutAssets.filmReelRingInner,
      aboutAssets.filmSeverance,
      aboutAssets.filmNathan,
      aboutAssets.filmIsleOfDogs,
      aboutAssets.filmFfxv,
      aboutAssets.filmBourdain,
      aboutAssets.filmVince,
      aboutAssets.filmZelda,
      aboutAssets.filmSpiderverse,
    ];
    sources.forEach((src) => {
      const img = new Image();
      img.src = src;
      void img.decode?.().catch(() => undefined);
    });
  }, []);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    doPhaseRef.current = doPhase;
  }, [doPhase]);

  useEffect(() => {
    workPhaseRef.current = workPhase;
  }, [workPhase]);

  useEffect(() => {
    const onFolder = (event: Event) => {
      const folder = (event as CustomEvent<string>).detail;
      if (folder === "about") {
        if (
          phaseRef.current === "open" &&
          doPhaseRef.current === "rest" &&
          workPhaseRef.current === "rest"
        ) {
          return;
        }
        openingRef.current = true;
        doOpeningRef.current = false;
        workOpeningRef.current = false;
        setDoPhase("rest");
        setWorkPhase("rest");
        setPhase("down");
        return;
      }
      if (folder === "work") {
        if (
          workPhaseRef.current === "open" &&
          phaseRef.current === "rest" &&
          doPhaseRef.current === "rest"
        ) {
          return;
        }
        openingRef.current = false;
        doOpeningRef.current = false;
        workOpeningRef.current = true;
        setPhase("rest");
        setDoPhase("rest");
        setWorkPhase("down");
      }
    };
    window.addEventListener("about-folder", onFolder);
    return () => window.removeEventListener("about-folder", onFolder);
  }, []);

  const releaseStamp = () => {
    window.clearTimeout(pressTimer.current);
    setPressing(false);
    const away =
      stampPosRef.current.left !== STAMP_HOME.left ||
      stampPosRef.current.top !== STAMP_HOME.top;
    stampPosRef.current = STAMP_HOME;
    setHolding(false);
    setReturning(away);
    setStampPos(STAMP_HOME);
  };

  const closeWho = () => {
    if (phaseRef.current !== "open") return;
    openingRef.current = false;
    releaseStamp();
    setStampOn(false);
    setPhase("down");
  };

  const closeDo = () => {
    if (doPhaseRef.current !== "open") return;
    doOpeningRef.current = false;
    setDoClosing(true);
    setDoPhase("down");
  };

  const closeWork = () => {
    if (workPhaseRef.current !== "open") return;
    workOpeningRef.current = false;
    setWorkPhase("down");
  };

  useEffect(() => {
    if (phase === "rest") return;
    const id = window.setTimeout(() => {
      if (phase === "down") {
        setPhase(openingRef.current ? "open" : "rest");
      }
      if (phase === "open" && openingRef.current) {
        setStampOn(true);
      }
    }, 900);
    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (doPhase === "rest") return;
    const wait =
      doPhase === "down" && doOpeningRef.current
        ? DO_SLIDE_MS + DO_STAGGER_MS
        : DO_SLIDE_MS;
    const id = window.setTimeout(() => {
      if (doPhase === "down") {
        setDoPhase(doOpeningRef.current ? "open" : "rest");
      }
    }, wait);
    return () => window.clearTimeout(id);
  }, [doPhase]);

  useEffect(() => {
    if (doPhase !== "rest" || !doClosing) return;
    const id = window.setTimeout(() => setDoClosing(false), DO_SLIDE_MS);
    return () => window.clearTimeout(id);
  }, [doPhase, doClosing]);

  useEffect(() => {
    if (workPhase === "rest") return;
    const wait =
      workPhase === "down" && workOpeningRef.current
        ? DO_SLIDE_MS + DO_STAGGER_MS
        : DO_SLIDE_MS;
    const id = window.setTimeout(() => {
      if (workPhase === "down") {
        setWorkPhase(workOpeningRef.current ? "open" : "rest");
      }
    }, wait);
    return () => window.clearTimeout(id);
  }, [workPhase]);

  useEffect(() => {
    if (phase !== "open") return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      if (holdingRef.current) {
        releaseStamp();
        return;
      }
      if (whoNoteInputRef.current === document.activeElement) {
        whoNoteInputRef.current.blur();
        return;
      }
      closeWho();
    };

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (boundsRef.current?.contains(target)) return;
      if (stampRef.current?.contains(target)) return;
      if (whoNoteRef.current?.contains(target)) return;
      closeWho();
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [phase]);

  useEffect(() => {
    if (doPhase !== "open") return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      closeDo();
    };

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (doBoundsRef.current?.contains(target)) return;
      if (reelHitRef.current?.contains(target)) return;
      if (spinTabRef.current?.contains(target)) return;
      closeDo();
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [doPhase]);

  useEffect(() => {
    if (workPhase !== "open") return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      closeWork();
    };

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (workBoundsRef.current?.contains(target)) return;
      closeWork();
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [workPhase]);

  useEffect(() => {
    if (!holding) return;
    const stamp = stampRef.current;
    if (!stamp) return;

    const move = (event: PointerEvent) => {
      const point = pointerInStampSpace(
        event.clientX,
        event.clientY,
        stamp,
        stampPosRef.current,
      );
      if (!pointInFolder(point.x, point.y)) {
        releaseStamp();
        return;
      }
      const next = {
        left: point.x - grabRef.current.x,
        top: point.y - grabRef.current.y,
      };
      stampPosRef.current = next;
      setStampPos(next);
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape" && event.key !== " " && event.code !== "Space") {
        return;
      }
      event.preventDefault();
      releaseStamp();
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("keydown", onKey);
    };
  }, [holding]);

  const grabStamp = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const stamp = stampRef.current;
    if (!stamp || !stampOn || holdingRef.current || returning) return;
    const point = pointerInStampSpace(
      event.clientX,
      event.clientY,
      stamp,
      stampPosRef.current,
    );
    grabRef.current = {
      x: point.x - stampPosRef.current.left,
      y: point.y - stampPosRef.current.top,
    };
    setHolding(true);
  };

  const placeMark = (event: ReactMouseEvent<HTMLButtonElement>) => {
    if (!holdingRef.current || pressing) return;
    if (event.detail === 0) return;
    setPressing(true);
    window.clearTimeout(pressTimer.current);
    pressTimer.current = window.setTimeout(() => {
      const pos = stampPosRef.current;
      markId.current += 1;
      setMarks((current) => [
        ...current,
        {
          id: markId.current,
          left: pos.left + STAMP_BASE.x - MARK_W / 2,
          top: pos.top + STAMP_BASE.y - MARK_H / 2,
        },
      ]);
    }, 150);
  };

  const foldersIdle = phase === "rest" && doPhase === "rest" && workPhase === "rest";
  const phaseClass = [
    "about",
    phase !== "rest" ? "about--down" : "",
    phase === "open" ? "about--open" : "",
    stampOn ? "about--ready" : "",
    doPhase !== "rest" ? "about--do-down" : "",
    doPhase === "open" ? "about--do-open" : "",
    doClosing ? "about--do-closing" : "",
    workPhase !== "rest" ? "about--work-down" : "",
    workPhase === "open" ? "about--work-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className="page" aria-label="About Me">
      <div className={phaseClass} ref={aboutRef}>
        <div className="about__paper" aria-hidden="true" />

        <div className="about-folders">
          <div className="about-layer about-layer--work">
            <div className="about-work-slide">
            <div className="about-work-extend" aria-hidden="true" />
            <FolderShape
              src={aboutAssets.lastFolder}
              box={{ left: 565, top: 70, width: 703, height: 1364 }}
            />
            <div className="about-work-copy">
              <p className="about-work-title">{aboutCopy.workTitle}</p>
              <div className="about-work-items">
                {aboutCopy.workExperience.map((job) => (
                  <div key={job.role}>
                    <p className="about-work-role">{job.role}</p>
                    <p className="about-work-dates">{job.dates}</p>
                    <ol className="about-work-list">
                      {job.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
              <div className="about-work-skills">
                <div className="about-work-skills__track">
                  {[0, 1].map((copy) => (
                    <div
                      className="about-work-skills__set"
                      key={copy}
                      aria-hidden={copy === 1}
                    >
                      {aboutCopy.workSkills.map((skill) => (
                        <p key={`${copy}-${skill}`}>{skill}</p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <FolderTab label={aboutCopy.workTab} left={1232} top={105} />
            <div className="about-work">
              <Photo
                src={aboutAssets.ucSanDiego}
                box={{ left: 0, top: 0, width: 524, height: 338 }}
                crop={{ left: "0", top: "-8.09%", width: "100%", height: "116.27%" }}
              />
              <Photo
                src={aboutAssets.sanDiego}
                box={{ left: 0, top: 338, width: 524, height: 338 }}
              />
              <Photo
                src={aboutAssets.sanFrancisco}
                box={{ left: 0, top: 676, width: 526, height: 339 }}
                crop={{ left: "-6.11%", top: "-5.82%", width: "106.11%", height: "118.46%" }}
              />
              <div className="about-script about-script--ucsd" aria-hidden="true">
                <img alt="" src={aboutAssets.ucSanDiegoType} />
              </div>
              <div className="about-script about-script--l3" aria-hidden="true">
                <img alt="" src={aboutAssets.l3harris} />
              </div>
              <div className="about-script about-script--l3b" aria-hidden="true">
                <img alt="" src={aboutAssets.l3harris2} />
              </div>
            <div className="about-script about-script--altimetrik" aria-hidden="true">
              <img alt="" src={aboutAssets.altimetrik} />
            </div>
            <div className="about-filter" aria-hidden="true" />
          </div>
            {workPhase === "open" ? (
              <div className="about-work__bounds" ref={workBoundsRef} />
            ) : null}
            {foldersIdle ? (
              <button
                type="button"
                className="about-work__hit"
                aria-label={aboutCopy.workTab}
                onClick={() => {
                  workOpeningRef.current = true;
                  setWorkPhase("down");
                }}
              />
            ) : null}
            </div>
          </div>

          <div className="about-layer about-layer--do">
            <div className="about-do-slide">
            <div className="about-do-slide__sheet">
            <div className="about-do-fill" aria-hidden="true" />
            <FolderShape
              className="about-folder-shape--do"
              src={aboutAssets.secondFolder}
              box={{ left: 289, top: 69, width: 645, height: 1364 }}
            />
            <div className="about-do-inside" aria-hidden="true">
              <FilmReel
                active={doPhase === "open" || doClosing}
                hitRef={reelHitRef}
              />
              <div className="about-do-frame-slot">
              <div className="about-do-frame">
                <p className="about-do-title">{aboutCopy.hobbiesTitle}</p>
                <div className="about-do-columns">
                  {[aboutCopy.hobbies.slice(0, 6), aboutCopy.hobbies.slice(6)].map(
                    (column, columnIndex) => (
                      <ol
                        className="about-do-list"
                        key={columnIndex}
                        start={columnIndex === 0 ? 1 : 7}
                      >
                        {column.map((item) => (
                          <li key={item.text}>
                            {item.text}
                            {item.children ? (
                              <ol>
                                {item.children.map((child) => (
                                  <li key={child}>{child}</li>
                                ))}
                              </ol>
                            ) : null}
                          </li>
                        ))}
                      </ol>
                    ),
                  )}
                </div>
              </div>
              </div>
            </div>
            <FolderTab className="about-tab--do" label={aboutCopy.doTab} left={897} top={414} />
            <div className="about-collage" aria-hidden="true">
              {COLLAGE.map((item, index) =>
                item.type === "spin" ? (
                  <SpinPhoto
                    key={index}
                    src={item.src}
                    box={item.box}
                    deg={item.deg}
                    inner={item.inner}
                  />
                ) : (
                  <Photo key={index} src={item.src} box={item.box} crop={item.crop} />
                ),
              )}
              <div className="about-filter" aria-hidden="true" />
            </div>
            <SpinTab
              active={doPhase === "open"}
              rest={doPhase === "rest" && !doClosing}
              tabRef={spinTabRef}
            />
            {doPhase === "open" ? (
              <div className="about-do__bounds" ref={doBoundsRef} />
            ) : null}
            {foldersIdle ? (
              <button
                type="button"
                className="about-do__hit"
                aria-label={aboutCopy.doTab}
                onClick={() => {
                  doOpeningRef.current = true;
                  setDoClosing(false);
                  setDoPhase("down");
                }}
              />
            ) : null}
            </div>
            </div>
          </div>

          <div className="about-layer about-layer--who">
            <div className="about-who-edge" aria-hidden="true" />
            <div className="about-who-slide">
            <div className="about-who-fill" aria-hidden="true" />
            <FolderShape
              className="about-folder-shape--who"
              src={aboutAssets.firstFolder}
              box={{ left: -86, top: 69, width: 645, height: 1364 }}
            />
            <div className="about-note" aria-hidden="true">
              <div className="about-note__sheet">
                <div className="about-note__sheet-turn">
                  <img alt="" src={aboutAssets.tornPaper} />
                </div>
              </div>
              <img className="about-note__text" alt="" src={aboutAssets.noteText} />
              <img className="about-note__clip" alt="" src={aboutAssets.clip} />
            </div>
            <div className="about-who">
              <div
                className="about-who__type"
                style={{
                  WebkitMaskImage: `url(${aboutAssets.whoMask})`,
                  maskImage: `url(${aboutAssets.whoMask})`,
                }}
                aria-hidden="true"
              >
                <Photo
                  src={aboutAssets.whoFill1}
                  box={{ left: -447.89, top: -274.42, width: 962, height: 1136 }}
                />
                <Photo
                  src={aboutAssets.whoFill2}
                  box={{ left: 159.115, top: 414.58, width: 559, height: 745 }}
                />
              </div>
              <Photo
                src={aboutAssets.fullBody}
                box={{ left: 87, top: 223, width: 275, height: 508 }}
              />
              <p className="about-who__name">{aboutCopy.name}</p>
              <p className="about-who__label">{aboutCopy.whoAmI}</p>
              <div className="about-filter" aria-hidden="true" />
            </div>
            <FolderTab className="about-tab--who" label={aboutCopy.whoTab} left={521} top={667} />
            {phase === "open" ? (
              <div className="about-who__bounds" ref={boundsRef} />
            ) : null}
            {foldersIdle ? (
              <button
                type="button"
                className="about-who__hit"
                aria-label={aboutCopy.whoTab}
                onClick={() => {
                  openingRef.current = true;
                  setPhase("down");
                }}
              />
            ) : null}
            {marks.map((mark) => (
              <span
                key={mark.id}
                className="about-mark"
                style={{ left: mark.left, top: mark.top }}
              >
                <TamilMark />
              </span>
            ))}
            <WhoSticky
              active={phase === "open"}
              rest={phase === "rest"}
              noteRef={whoNoteRef}
              inputRef={whoNoteInputRef}
            />
            <button
              ref={stampRef}
              type="button"
              className={[
                "about-stamper",
                holding ? "about-stamper--held" : "",
                pressing ? "about-stamper--press" : "",
                returning ? "about-stamper--return" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{ left: stampPos.left, top: stampPos.top }}
              aria-label="Stamp"
              onPointerEnter={grabStamp}
              onClick={placeMark}
              onAnimationEnd={() => setPressing(false)}
              onTransitionEnd={(event) => {
                if (event.propertyName !== "left" && event.propertyName !== "top") return;
                setReturning(false);
              }}
            >
              <img alt="" src={aboutAssets.stamper} />
            </button>
            </div>
          </div>
        </div>

        <div className="about-aside" aria-hidden="true">
          <p className="about-end">{aboutCopy.endOfPage}</p>
          <p className="about-end__arrow">{aboutCopy.arrow}</p>
          <p className="about-credit">{aboutCopy.credit}</p>
        </div>
        <nav className="about-jump" aria-label="Pages">
          <a className="about-jump__link about-jump__link--landing" href="#landing">
            {aboutCopy.landing}
          </a>
          <a className="about-jump__link about-jump__link--projects" href="#projects">
            {aboutCopy.projects}
          </a>
        </nav>
      </div>
    </section>
  );
}
