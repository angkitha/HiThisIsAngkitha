import { useLayoutEffect, useState, type RefObject } from "react";
import { DESIGN_HEIGHT, DESIGN_WIDTH } from "../content/site";

/** Top of the about-page folder art, in the 1080-tall design. */
const FOLDER_TOP = 69;

/** Narrow screens fit the design to the screen height so type stays readable. */
const PHONE_MAX_WIDTH = 820;

function measureScale(width: number, height: number) {
  if (width < PHONE_MAX_WIDTH) return Math.min(1, height / DESIGN_HEIGHT);
  return Math.min(1, width / DESIGN_WIDTH, height / DESIGN_HEIGHT);
}

export function getViewportScale() {
  if (typeof window === "undefined") return 1;
  return measureScale(window.innerWidth, window.innerHeight);
}

export function useFitScale(container: RefObject<HTMLElement | null>) {
  const [scale, setScale] = useState(getViewportScale);

  useLayoutEffect(() => {
    const node = container.current;
    if (!node) return;

    const update = () => {
      const { width, height } = node.getBoundingClientRect();
      if (width < 2 || height < 2) return;
      const next = measureScale(width, height);
      const padX = Math.max(0, (width - DESIGN_WIDTH * next) / 2);
      const padY = Math.max(0, (height - DESIGN_HEIGHT * next) / 2);
      const span = DESIGN_HEIGHT - FOLDER_TOP;
      let folderScale =
        span * next > 0 ? (height - padY - FOLDER_TOP * next) / (span * next) : 1;
      if (!Number.isFinite(folderScale)) folderScale = 1;
      if (Math.abs(folderScale - 1) < 0.001) folderScale = 1;
      node.style.setProperty("--stage-pad-x", `${padX}px`);
      node.style.setProperty("--stage-pad-y", `${padY}px`);
      node.style.setProperty("--stage-scale", String(next));
      node.style.setProperty("--folder-scale", String(folderScale));
      setScale(next);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [container]);

  return scale;
}
