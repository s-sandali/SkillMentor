import { useEffect, useRef } from "react";

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
}

/**
 * Attaches an IntersectionObserver to the returned ref.
 * When the element enters the viewport, sets data-visible="true".
 * Use with the `.anim` CSS class in index.css for slide-up/fade-in effects.
 */
export function useScrollAnimation<T extends HTMLElement>(
  options: UseScrollAnimationOptions = {}
) {
  const ref = useRef<T>(null);
  const { threshold = 0, rootMargin = "0px 0px -32px 0px" } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.setAttribute("data-visible", "true");
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return ref;
}
