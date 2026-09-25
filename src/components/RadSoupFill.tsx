import { useEffect, useRef } from "react";
import {
  SHADER_HEIGHT,
  SHADER_WIDTH,
  createRadSoupContext,
  RadSoupRenderer,
  type PointerState,
} from "../lib/radSoup";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function RadSoupFill() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = createRadSoupContext(canvas);
    if (!gl) return;

    let renderer: RadSoupRenderer;
    try {
      renderer = new RadSoupRenderer(gl);
    } catch (error) {
      console.error("Rad Soup shader failed", error);
      return;
    }

    const pointer: PointerState = { x: 0, y: 0, inside: false };
    let reduced = prefersReducedMotion();
    let visible = true;
    let sawVisible = false;
    let raf = 0;
    canvas.dataset.radSoup = reduced ? "static" : "live";

    const mapPointer = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) {
        pointer.inside = false;
        return;
      }
      pointer.inside =
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom;
      if (pointer.inside) {
        pointer.x = ((clientX - rect.left) / rect.width) * SHADER_WIDTH;
        pointer.y = ((clientY - rect.top) / rect.height) * SHADER_HEIGHT;
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      mapPointer(event.clientX, event.clientY);
    };

    const onPointerLeave = () => {
      pointer.inside = false;
    };

    const tick = (now: number) => {
      renderer.draw(now, pointer, !reduced, !reduced);
      canvas.dataset.radSoup = reduced ? "static" : pointer.inside ? "hover" : "live";
      if (!reduced && visible) {
        raf = requestAnimationFrame(tick);
      }
    };

    const start = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => {
      reduced = media.matches;
      if (reduced) {
        pointer.inside = false;
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        renderer.draw(performance.now(), pointer, false, false);
      } else if (visible) {
        start();
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const intersecting = entry?.isIntersecting ?? false;
        if (intersecting) sawVisible = true;
        // Headless/first-layout can report a false negative before the first true.
        visible = intersecting || !sawVisible;
        if (reduced) return;
        if (visible) start();
        else if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0.01 },
    );
    const pageRoot = canvas.closest(".page") ?? canvas;
    observer.observe(pageRoot);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    media.addEventListener("change", onMotion);
    start();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      observer.disconnect();
      media.removeEventListener("change", onMotion);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      renderer.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="notebook-shader__canvas"
      width={SHADER_WIDTH}
      height={SHADER_HEIGHT}
      aria-hidden="true"
    />
  );
}
