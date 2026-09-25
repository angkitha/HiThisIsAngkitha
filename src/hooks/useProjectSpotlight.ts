import { useCallback, useEffect, useRef, useState } from "react";
import type { SpotlightId } from "../content/projectCarousel";

/** Pointer must stay on a side for this long before the first carousel slide. */
export const CAROUSEL_DWELL_MS = 1000;
/** Extra pause between later slides while the pointer stays on that side. */
const FOLLOWUP_DWELL_MS = 1600;
const SLIDE_MS = 900;

function neighborOn(side: "left" | "right", id: SpotlightId): SpotlightId {
  if (side === "left") return (id === 1 ? 5 : id - 1) as SpotlightId;
  return (id === 5 ? 1 : id + 1) as SpotlightId;
}

export function useProjectSpotlight() {
  const [spotlight, setSpotlight] = useState<SpotlightId>(1);
  const spotlightRef = useRef(spotlight);
  const timerRef = useRef<number>(0);
  const lockedUntilRef = useRef(0);
  const chainedRef = useRef(false);

  const clearTimer = useCallback(() => {
    window.clearTimeout(timerRef.current);
    timerRef.current = 0;
  }, []);

  const cancel = useCallback(() => {
    clearTimer();
    chainedRef.current = false;
  }, [clearTimer]);

  const commit = useCallback((id: SpotlightId) => {
    spotlightRef.current = id;
    setSpotlight(id);
    lockedUntilRef.current = Date.now() + SLIDE_MS;
    chainedRef.current = true;
    timerRef.current = 0;
  }, []);

  const schedule = useCallback(
    (id: SpotlightId, delay: number) => {
      clearTimer();
      if (id === spotlightRef.current) return;
      if (delay <= 0) {
        commit(id);
        return;
      }
      timerRef.current = window.setTimeout(() => commit(id), delay);
    },
    [clearTimer, commit],
  );

  const hoverProject = useCallback(
    (id: SpotlightId) => {
      if (id === spotlightRef.current) {
        cancel();
        return;
      }
      const remainingLock = Math.max(0, lockedUntilRef.current - Date.now());
      const dwell = chainedRef.current ? FOLLOWUP_DWELL_MS : CAROUSEL_DWELL_MS;
      schedule(id, remainingLock + dwell);
    },
    [cancel, schedule],
  );

  const advanceSide = useCallback(
    (side: "left" | "right") => {
      const next = neighborOn(side, spotlightRef.current);
      const wait = Math.max(0, lockedUntilRef.current - Date.now());
      schedule(next, wait);
    },
    [schedule],
  );

  useEffect(() => () => cancel(), [cancel]);

  return { spotlight, hoverProject, advanceSide, cancelHover: cancel };
}
