import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import type { ProjectPhoto } from '@/config/site';
import { cn } from '@/lib/utils';

export function Gallery({ photos, className }: { photos: ProjectPhoto[]; className?: string }) {
  const [active, setActive] = useState<number | null>(null);
  const carouselRef = useRef<HTMLUListElement>(null);

  const scrollCarousel = (direction: -1 | 1) => {
    const carousel = carouselRef.current;
    const firstSlide = carousel?.querySelector('li');
    if (!carousel || !firstSlide) return;

    const gap = Number.parseFloat(getComputedStyle(carousel).columnGap) || 0;
    carousel.scrollBy({
      left: (firstSlide.getBoundingClientRect().width + gap) * direction,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <section aria-label="Projectfoto's" className={cn('relative', className)}>
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-sm text-stone">{photos.length} foto's</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scrollCarousel(-1)}
              className="grid size-11 place-items-center rounded-full border border-line bg-white text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
              aria-label="Vorige projectfoto's"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollCarousel(1)}
              className="grid size-11 place-items-center rounded-full border border-line bg-white text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
              aria-label="Volgende projectfoto's"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
        <ul
          ref={carouselRef}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] sm:gap-4 [&::-webkit-scrollbar]:hidden"
          aria-label="Projectfoto's; veeg of gebruik de knoppen om meer foto's te bekijken"
        >
          {photos.map((photo, i) => (
            <motion.li
              key={photo.src}
              layout
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="w-[85%] shrink-0 snap-start sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]"
            >
              <button
                type="button"
                onClick={() => setActive(i)}
                className="group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-2xl bg-sand text-left"
                aria-label={`Vergroot foto: ${photo.caption}`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-3 pt-10 text-sm font-medium text-white sm:p-4">
                  <span className="leading-snug">{photo.caption}</span>
                  <Expand className="size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                </span>
              </button>
            </motion.li>
          ))}
        </ul>
      </section>
      <Lightbox photos={photos} index={active} onChange={setActive} />
    </>
  );
}

function Lightbox({ photos, index, onChange }: { photos: ProjectPhoto[]; index: number | null; onChange: (i: number | null) => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);
  const open = index !== null;

  const go = useCallback(
    (delta: number) => {
      if (index === null) return;
      onChange((index + delta + photos.length) % photos.length);
    },
    [index, onChange, photos.length],
  );

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      previouslyFocused?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onChange(null);
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, go, onChange]);

  const photo = index !== null ? photos[index] : null;

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={photo.caption}
          className="fixed inset-0 z-50 flex flex-col bg-[#0d0b0a]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          <div className="flex items-center justify-between px-4 py-3 text-sm text-white/80 sm:px-6">
            <span>
              {index! + 1} / {photos.length}
            </span>
            <button ref={closeRef} type="button" onClick={() => onChange(null)} className="grid size-11 place-items-center rounded-full text-white hover:bg-white/10" aria-label="Sluiten">
              <X className="size-6" />
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-20" onClick={(e) => e.target === e.currentTarget && onChange(null)}>
            <AnimatePresence mode="wait">
              <motion.img
                key={photo.src}
                src={photo.src}
                alt={photo.alt}
                className="max-h-full max-w-full rounded-lg object-contain"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </AnimatePresence>
            <button type="button" onClick={() => go(-1)} className="absolute left-3 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:grid" aria-label="Vorige foto">
              <ChevronLeft className="size-6" />
            </button>
            <button type="button" onClick={() => go(1)} className="absolute right-3 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:grid" aria-label="Volgende foto">
              <ChevronRight className="size-6" />
            </button>
          </div>
          <div className="flex items-center justify-between gap-4 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 sm:px-6">
            <button type="button" onClick={() => go(-1)} className="grid size-11 place-items-center rounded-full bg-white/10 text-white sm:hidden" aria-label="Vorige foto">
              <ChevronLeft className="size-5" />
            </button>
            <p className="flex-1 text-center text-white sm:text-left">{photo.caption}</p>
            <button type="button" onClick={() => go(1)} className="grid size-11 place-items-center rounded-full bg-white/10 text-white sm:hidden" aria-label="Volgende foto">
              <ChevronRight className="size-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
