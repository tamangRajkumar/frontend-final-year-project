import React, { useEffect, useMemo, useRef, useState } from "react";

interface CarouselProps {
  children: React.ReactNode[] | React.ReactNode;
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}

const Carousel: React.FC<CarouselProps> = ({ children, autoPlay = true, interval = 3500, className = "" }) => {
  const items = useMemo(() => React.Children.toArray(children), [children]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [pages, setPages] = useState(1);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const p = Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth));
      setPages(p);
      setActive(Math.round(el.scrollLeft / el.clientWidth));
    };
    update();
    const onScroll = () => setActive(Math.round(el.scrollLeft / el.clientWidth));
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    if (!autoPlay) return;
    const el = containerRef.current;
    if (!el) return;
    const id = setInterval(() => {
      const next = (Math.round(el.scrollLeft / el.clientWidth) + 1) % pages;
      el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    }, Math.max(2000, interval));
    return () => clearInterval(id);
  }, [autoPlay, interval, pages]);

  const goTo = (i: number) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };
  const prev = () => goTo(Math.max(0, active - 1));
  const next = () => goTo(Math.min(pages - 1, active + 1));

  return (
    <div className={`relative ${className}`}>
      <div
        ref={containerRef}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
        style={{ scrollBehavior: "smooth" }}
      >
        {items.map((child, idx) => (
          <div key={idx} className="snap-start shrink-0 w-full px-1">
            {child}
          </div>
        ))}
      </div>

      {/* Arrows */}
      {pages > 1 && (
        <>
          <button
            aria-label="Previous"
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30 shadow-lg p-2 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            aria-label="Next"
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30 shadow-lg p-2 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </>
      )}

      {/* Dots */}
      {pages > 1 && (
        <div className="absolute inset-x-0 -bottom-3 flex items-center justify-center gap-2">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-2.5 rounded-full transition-all ${i === active ? "bg-white/90 w-6" : "bg-white/40 w-2.5"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
