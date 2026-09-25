export type SpotlightId = 1 | 2 | 3 | 4 | 5;
export type ProjectId = SpotlightId;
export type SlotMode = "stack" | "plugin" | "turned";
export type TurnedFacing = "left" | "right";
export type TagVariant = "long" | "short" | "two-line";
export type TagSkew = "stack" | "plugin";

export type Rect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type TurnedCard = {
  left: number;
  top: number;
  facing: TurnedFacing;
};

export type TagLayout = {
  left: number;
  top: number;
  variant: TagVariant;
  skew: TagSkew;
  textLeft: number;
  textTop: number;
};

export type NumberLayout = {
  left: number;
  top: number;
};

export type PluginLayout = {
  card: Rect;
  face: { width: number; height: number };
};

export type SlotLayout = {
  mode: SlotMode;
  number: NumberLayout;
  stack?: Rect[];
  plugin?: PluginLayout;
  turned?: TurnedCard[];
  tag?: TagLayout;
};

export const STACK_SKEW = 26.565;
export const PLUGIN_SKEW = 30;
/** Shear the tag into a ground-plane parallelogram, leftward. */
export const TAG_WARP = -32;
export const TAG_PAD_X = 6;
export const TAG_PAD_Y = 4;
export const TAG_FONT_SIZE = 12;
export const TAG_LINE_GAP = 2;
/** Space between the last image’s bottom edge and the tag’s top edge. */
export const TAG_IMAGE_GAP = 8;
const TAG_IMAGE_GAP_BY_ID: Partial<Record<ProjectId, number>> = {
  1: 2,
  4: 12,
};
const TAG_NOTCH_RATIO = 15.6004 / 19;

type FrontImageFit = {
  width: number;
  height: number;
  /** Opaque bottom at the left of the PNG, as a fraction of image height. */
  opaqueBottom: number;
  /** Bottom-edge angle of the isometric shot, in degrees. */
  angle: number;
  fit: "cover" | "contain";
  position: "center" | "bottom";
};

/** Front-most screenshot for each project (matches STACK_IMAGES / PLUGIN_IMAGES). */
const FRONT_IMAGE: Record<ProjectId, FrontImageFit> = {
  1: { width: 1790, height: 2549, opaqueBottom: 0.694, angle: 30, fit: "contain", position: "bottom" },
  2: { width: 1512, height: 1842, opaqueBottom: 0.6683, angle: 26.565, fit: "contain", position: "bottom" },
  3: { width: 1995, height: 2048, opaqueBottom: 1249 / 2048, angle: 26.565, fit: "cover", position: "center" },
  4: { width: 1184, height: 1561, opaqueBottom: 0.6451, angle: 30, fit: "contain", position: "center" },
  5: { width: 1199, height: 1573, opaqueBottom: 0.6434, angle: 30, fit: "contain", position: "center" },
};

export function tagSkewAngle(id: ProjectId) {
  return FRONT_IMAGE[id].angle;
}

/** Where the isometric card’s left bottom lands inside its layout box. */
function visualBottomFrac(id: ProjectId, boxWidth: number, boxHeight: number) {
  const img = FRONT_IMAGE[id];
  const imgAspect = img.width / img.height;
  const boxAspect = boxWidth / boxHeight;
  if (img.fit === "cover") {
    if (boxAspect > imgAspect) {
      const scale = boxWidth / img.width;
      const displayedHeight = img.height * scale;
      const cropTop = (displayedHeight - boxHeight) / 2;
      return (img.opaqueBottom * displayedHeight - cropTop) / boxHeight;
    }
    return img.opaqueBottom;
  }
  const scale = Math.min(boxWidth / img.width, boxHeight / img.height);
  const displayedHeight = img.height * scale;
  const offsetTop =
    img.position === "bottom" ? boxHeight - displayedHeight : (boxHeight - displayedHeight) / 2;
  return (offsetTop + img.opaqueBottom * displayedHeight) / boxHeight;
}

const textWidthCache = new Map<string, number>();
let measureCtx: CanvasRenderingContext2D | null | undefined;

export function measureTagText(text: string) {
  const cached = textWidthCache.get(text);
  if (cached != null) return cached;
  const fallback = text.length * 7.2;
  if (typeof document === "undefined") return fallback;
  if (measureCtx === undefined) {
    const canvas = document.createElement("canvas");
    measureCtx = canvas.getContext("2d");
  }
  if (!measureCtx) return fallback;
  measureCtx.font = `400 ${TAG_FONT_SIZE}px Helvetica, "Helvetica Neue", Arial, sans-serif`;
  const width = measureCtx.measureText(text).width;
  textWidthCache.set(text, width);
  return width;
}

/** Alphabetic cap/descender metrics so SVG padding matches Safari (no dominantBaseline). */
export function tagFontBox() {
  const fallback = { ascent: TAG_FONT_SIZE * 0.72, descent: TAG_FONT_SIZE * 0.22 };
  if (typeof document === "undefined") return fallback;
  measureTagText("Hyg");
  if (!measureCtx) return fallback;
  const m = measureCtx.measureText("Hyg");
  const ascent = m.actualBoundingBoxAscent || m.fontBoundingBoxAscent || fallback.ascent;
  const descent = m.actualBoundingBoxDescent || m.fontBoundingBoxDescent || fallback.descent;
  return { ascent, descent };
}

export function tagTitleLines(id: ProjectId): string[] {
  const title = projectCopy[id].title;
  return Array.isArray(title) ? title.map((line) => line.trim()) : [title];
}

export function tagMetrics(id: ProjectId) {
  const lines = tagTitleLines(id);
  const textWidth = Math.max(...lines.map(measureTagText));
  const { ascent, descent } = tagFontBox();
  const lineStep = TAG_FONT_SIZE + TAG_LINE_GAP;
  const textBlock = ascent + Math.max(0, lines.length - 1) * lineStep + descent;
  const height = TAG_PAD_Y * 2 + textBlock;
  const notch = height * TAG_NOTCH_RATIO;
  const width = notch + TAG_PAD_X * 2 + textWidth;
  const firstLineY = TAG_PAD_Y + ascent;
  return { lines, width, height, notch, textWidth, firstLineY, lineStep };
}

export function tagPath(width: number, height: number, notch: number) {
  const mid = height / 2;
  return `M${width} ${height}L${notch} ${height}L0 ${mid}L${notch} 0H${width}V${height}Z`;
}

export function tagAnchorTop(
  id: ProjectId,
  slot: SlotLayout,
  tagHeight: number,
): number {
  const angle = (tagSkewAngle(id) * Math.PI) / 180;
  const notch = tagHeight * TAG_NOTCH_RATIO;
  const front = slot.stack?.[slot.stack.length - 1] ?? slot.plugin?.card;
  if (!front) return slot.tag?.top ?? 0;
  const visualBottom =
    front.top + front.height * visualBottomFrac(id, front.width, front.height);
  const gap = TAG_IMAGE_GAP_BY_ID[id] ?? TAG_IMAGE_GAP;
  return visualBottom + gap - notch * Math.sin(angle);
}

export const projectCopy = {
  1: {
    label: "01",
    title: "FINTECH PLATFORM MODERNIZATION",
  },
  2: {
    label: "02",
    title: ["FINANCIAL CALL CENTER ", "AI-ENABLEMENT + MODERNIZATION"] as const,
  },
  3: {
    label: "03",
    title: "FINTECH ALL-IN-ONE DASHBOARD",
  },
  4: {
    label: "04",
    title: "DESIGN SYSTEM PLUGIN",
  },
  5: {
    label: "05",
    title: "WCAG ACCESIBILITY PLUGIN",
  },
} as const;

const n = (left: number, top: number): NumberLayout => ({ left, top });
const r = (left: number, top: number, width: number, height: number): Rect => ({
  left,
  top,
  width,
  height,
});
const t = (
  left: number,
  top: number,
  facing: TurnedFacing,
): TurnedCard => ({ left, top, facing });

const tag = (
  left: number,
  top: number,
  variant: TagVariant,
  skew: TagSkew,
  textLeft: number,
  textTop = 1,
): TagLayout => ({ left, top, variant, skew, textLeft, textTop });

const plugin = (
  left: number,
  top: number,
  width: number,
  height: number,
  faceW: number,
  faceH: number,
): PluginLayout => ({
  card: r(left, top, width, height),
  face: { width: faceW, height: faceH },
});

/** Figma frames 72:1231 / 72:1283 / 71:940 / 70:803 / 70:724 */
export const spotlightLayouts: Record<
  SpotlightId,
  Record<ProjectId, SlotLayout>
> = {
  1: {
    1: {
      mode: "stack",
      number: n(1096, 419),
      stack: [
        r(810.18, 309, 301.504, 527.92),
        r(792.08, 482.96, 301.669, 372.058),
        r(777, 508.1, 301.531, 372.058),
      ],
      tag: tag(793.45, 760, "long", "stack", 15),
    },
    2: {
      mode: "stack",
      number: n(1439.46, 469.12),
      stack: [
        r(1233.45, 391, 222.654, 334.57),
        r(1221.58, 441.45, 222.753, 293.027),
        r(1206, 482.25, 222.262, 270.771),
      ],
      tag: tag(1193.42, 655, "two-line", "stack", 23.04, 5.94),
    },
    3: {
      mode: "turned",
      number: n(1013, 250),
      turned: [
        t(1009, 274, "right"),
        t(1022, 272, "right"),
        t(997, 275, "right"),
      ],
    },
    4: {
      mode: "turned",
      number: n(815, 250),
      turned: [t(701, 274, "left")],
    },
    5: {
      mode: "plugin",
      number: n(599, 537),
      plugin: plugin(424, 466, 192.734, 252.868, 222.55, 141.593),
      tag: tag(420.48, 623, "short", "plugin", 15),
    },
  },
  2: {
    1: {
      mode: "stack",
      number: n(612, 422),
      stack: [
        r(436.97, 367, 190.565, 333.671),
        r(425.53, 476.95, 190.669, 235.158),
        r(416, 492.84, 190.582, 235.158),
      ],
      tag: tag(396.45, 634, "long", "stack", 15),
    },
    2: {
      mode: "stack",
      number: n(1085, 438),
      stack: [
        r(803, 333, 300, 451),
        r(787, 401, 300, 395),
        r(766, 456, 300, 365),
      ],
      tag: tag(793.42, 702, "two-line", "stack", 23.04, 5.94),
    },
    3: {
      mode: "stack",
      number: n(1457, 541),
      stack: [
        r(1224, 456, 250, 256),
        r(1213, 484, 249, 257),
        r(1203, 511, 249, 257),
      ],
      tag: tag(1205.45, 660, "long", "stack", 25.29, 1.47),
    },
    4: {
      mode: "turned",
      number: n(1013, 252),
      turned: [t(1009, 276, "right")],
    },
    5: {
      mode: "turned",
      number: n(815, 252),
      turned: [t(701, 276, "left")],
    },
  },
  3: {
    1: {
      mode: "turned",
      number: n(811, 260),
      turned: [
        t(684, 283, "left"),
        t(674, 279, "left"),
        t(694, 286, "left"),
      ],
    },
    2: {
      mode: "stack",
      number: n(646.46, 459.12),
      stack: [
        r(440.45, 381, 222.654, 334.57),
        r(428.58, 431.45, 222.753, 293.027),
        r(413, 472.25, 222.262, 270.771),
      ],
      tag: tag(408.42, 646, "two-line", "stack", 23.04, 5.94),
    },
    3: {
      mode: "stack",
      number: n(1101.76, 562),
      stack: [
        r(813.94, 457, 308.993, 316.235),
        r(800.35, 491.59, 307.588, 317.471),
        r(788, 524.94, 307.588, 317.471),
      ],
      tag: tag(808.45, 719, "long", "stack", 25.29, 1.47),
    },
    4: {
      mode: "plugin",
      number: n(1403, 544.5),
      plugin: plugin(1228, 479, 193, 254.437, 222.857, 143.008),
      tag: tag(1224.48, 639.5, "short", "plugin", 28.72, 0.77),
    },
    5: {
      mode: "turned",
      number: n(1009, 260),
      turned: [t(1005, 284, "right")],
    },
  },
  4: {
    1: {
      mode: "turned",
      number: n(1009, 238),
      turned: [
        t(1005, 262, "right"),
        t(1018, 260, "right"),
        t(993, 263, "right"),
      ],
    },
    2: {
      mode: "turned",
      number: n(811, 238),
      turned: [
        t(697, 262, "left"),
        t(687, 258, "left"),
        t(707, 265, "left"),
      ],
    },
    3: {
      mode: "stack",
      number: n(667, 505),
      stack: [
        r(434, 420, 250, 256),
        r(423, 448, 249, 257),
        r(413, 475, 249, 257),
      ],
      tag: tag(415.45, 624, "long", "stack", 25.29, 1.47),
    },
    4: {
      mode: "plugin",
      number: n(1085, 592),
      plugin: plugin(807, 463, 296, 390.224, 341.791, 219.329),
      tag: tag(843.48, 729, "short", "plugin", 28.72, 0.77),
    },
    5: {
      mode: "plugin",
      number: n(1415, 534),
      plugin: plugin(1240, 463, 192.734, 252.868, 222.55, 141.593),
      tag: tag(1236.48, 620, "short", "plugin", 15),
    },
  },
  5: {
    1: {
      mode: "stack",
      number: n(1439, 396),
      stack: [
        r(1228.83, 323, 225.643, 395.092),
        r(1215.29, 453.19, 225.767, 278.446),
        r(1204, 472.01, 225.664, 278.446),
      ],
      tag: tag(1191.45, 649, "long", "stack", 15),
    },
    2: {
      mode: "turned",
      number: n(1009, 246),
      turned: [
        t(1005, 270, "right"),
        t(1018, 268, "right"),
        t(993, 271, "right"),
      ],
    },
    3: {
      mode: "turned",
      number: n(811, 246),
      turned: [
        t(697, 270, "left"),
        t(687, 266, "left"),
        t(707, 273, "left"),
      ],
    },
    4: {
      mode: "plugin",
      number: n(595, 524),
      plugin: plugin(420, 458.5, 193, 254.437, 222.857, 143.008),
      tag: tag(416.48, 619, "short", "plugin", 28.72, 0.77),
    },
    5: {
      mode: "plugin",
      number: n(1065, 590),
      plugin: plugin(783, 460, 299.587, 393.059, 345.933, 220.093),
      tag: tag(816.48, 721, "short", "plugin", 15),
    },
  },
};

export function neighborIds(spotlight: SpotlightId): {
  left: SpotlightId;
  right: SpotlightId;
} {
  return {
    left: (spotlight === 1 ? 5 : ((spotlight - 1) as SpotlightId)),
    right: (spotlight === 5 ? 1 : ((spotlight + 1) as SpotlightId)),
  };
}

export function visualSide(
  slot: SlotLayout,
  isSpotlight: boolean,
): "center" | "left" | "right" | "back-left" | "back-right" {
  if (isSpotlight && slot.mode !== "turned") return "center";
  if (slot.mode === "turned") {
    return slot.turned?.[0]?.facing === "left" ? "back-left" : "back-right";
  }
  const rect = hitRect(slot);
  if (!rect) return "right";
  return rect.left + rect.width / 2 < 960 ? "left" : "right";
}

export function hitRect(slot: SlotLayout): Rect | null {
  if (slot.mode === "plugin" && slot.plugin) return slot.plugin.card;
  if (slot.mode === "stack" && slot.stack && slot.stack.length > 0) {
    const layers = slot.stack;
    const left = Math.min(...layers.map((l) => l.left));
    const top = Math.min(...layers.map((l) => l.top));
    const right = Math.max(...layers.map((l) => l.left + l.width));
    const bottom = Math.max(...layers.map((l) => l.top + l.height));
    return { left, top, width: right - left, height: bottom - top };
  }
  return null;
}

/** Native stack arrangement when that project is in the spotlight. */
export const canonicalStacks: Record<1 | 2 | 3, Rect[]> = {
  1: spotlightLayouts[1][1].stack!,
  2: spotlightLayouts[2][2].stack!,
  3: spotlightLayouts[3][3].stack!,
};

export function stackGroupPose(id: 1 | 2 | 3, layers: Rect[]) {
  const canonical = canonicalStacks[id];
  const cFront = canonical[canonical.length - 1];
  const tFront = layers[layers.length - 1] ?? cFront;
  const scale = tFront.width / cFront.width;

  const cLeft = Math.min(...canonical.map((layer) => layer.left));
  const cTop = Math.min(...canonical.map((layer) => layer.top));
  const cWidth =
    Math.max(...canonical.map((layer) => layer.left + layer.width)) - cLeft;
  const cHeight =
    Math.max(...canonical.map((layer) => layer.top + layer.height)) - cTop;

  return {
    left: tFront.left - (cFront.left - cLeft) * scale,
    top: tFront.top - (cFront.top - cTop) * scale,
    width: cWidth * scale,
    height: cHeight * scale,
    layers: canonical.map((layer) => ({
      left: ((layer.left - cLeft) / cWidth) * 100,
      top: ((layer.top - cTop) / cHeight) * 100,
      width: (layer.width / cWidth) * 100,
      height: (layer.height / cHeight) * 100,
    })),
  };
}
