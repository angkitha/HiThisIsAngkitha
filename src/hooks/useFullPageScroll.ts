import { useEffect, type RefObject } from "react";

export function useFullPageScroll(scrollerRef: RefObject<HTMLElement | null>, pageCount: number) {
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;

    const pageHeight = () => root.clientHeight;

    let animation = 0;

    const pageIdFor = (id: string) => (id === "work" ? "about" : id);

    const goToId = (id: string, smooth = false) => {
      const pages = Array.from(root.children) as HTMLElement[];
      const index = pages.findIndex((page) => page.id === pageIdFor(id));
      if (index < 0) return;
      const next = Math.min(pageCount - 1, Math.max(0, index));
      const top = next * pageHeight();
      cancelAnimationFrame(animation);
      if (!smooth) {
        root.scrollTop = top;
        return;
      }
      const start = root.scrollTop;
      const delta = top - start;
      if (Math.abs(delta) < 1) {
        root.scrollTop = top;
        return;
      }
      const duration = 900;
      const started = performance.now();
      const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
      const step = (now: number) => {
        const t = Math.min(1, (now - started) / duration);
        root.scrollTop = start + delta * ease(t);
        if (t < 1) animation = requestAnimationFrame(step);
      };
      animation = requestAnimationFrame(step);
    };

    const openAboutFolder = (id: string) => {
      if (id !== "about" && id !== "work") return;
      window.dispatchEvent(new CustomEvent("about-folder", { detail: id }));
    };

    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement | null)?.closest?.('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href")?.slice(1);
      if (!id) return;
      event.preventDefault();
      goToId(id, true);
      history.pushState(null, "", `#${id}`);
      openAboutFolder(id);
    };

    const onHashChange = () => {
      const id = window.location.hash.slice(1);
      if (id) {
        goToId(id);
        openAboutFolder(id);
      }
    };

    if (window.location.hash) onHashChange();

    root.addEventListener("click", onClick);
    window.addEventListener("hashchange", onHashChange);

    return () => {
      cancelAnimationFrame(animation);
      root.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [pageCount, scrollerRef]);
}
