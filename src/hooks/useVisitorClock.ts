import { useEffect, useState } from "react";
import { formatVisitorClock, type VisitorClock } from "../lib/visitorTime";

export function useVisitorClock(): VisitorClock {
  const [clock, setClock] = useState(formatVisitorClock);

  useEffect(() => {
    const tick = () => setClock(formatVisitorClock());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return clock;
}
