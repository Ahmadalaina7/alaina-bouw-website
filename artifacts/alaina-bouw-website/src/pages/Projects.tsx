import { useMemo, useState } from 'react';
import { Gallery } from '@/components/Gallery';
import { CtaBand, PageHero } from '@/components/ui';
import { photoCategories, projectPhotos, type PhotoCategory } from '@/config/site';
import { usePageMeta } from '@/lib/seo';
import { cn } from '@/lib/utils';

export default function ProjectsPage() {
  usePageMeta('Projecten', "Bekijk foto's van echte projecten van Alaina Bouw Klusbedrijf: badkamers, keukens, vloeren, tuinwerk, bestrating en maatwerk.");
  const [filter, setFilter] = useState<PhotoCategory | 'all'>('all');
  const photos = useMemo(() => (filter === 'all' ? projectPhotos : projectPhotos.filter((p) => p.category === filter)), [filter]);
  const counts = useMemo(() => Object.fromEntries(photoCategories.map((c) => [c.id, projectPhotos.filter((p) => p.category === c.id).length])), []);

  return (
    <>
      <PageHero eyebrow="Projecten" title="Echt werk, in beeld." text="Een selectie foto's van projecten tijdens en na de uitvoering. Klik op een foto om hem te vergroten." />
      <section className="section !pt-10 sm:!pt-14">
        <div className="container-x">
          <div role="toolbar" aria-label="Filter op categorie" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden">
            {[{ id: 'all' as const, label: 'Alles' }, ...photoCategories].map((c) => {
              const active = filter === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(c.id)}
                  className={cn(
                    'inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors',
                    active ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink hover:border-stone/50',
                  )}
                >
                  {c.label}
                  <span className={cn('rounded-full px-1.5 text-xs', active ? 'bg-white/15' : 'bg-sand text-stone')}>
                    {c.id === 'all' ? projectPhotos.length : counts[c.id]}
                  </span>
                </button>
              );
            })}
          </div>
          <Gallery photos={photos} className="mt-8" />
        </div>
      </section>
      <CtaBand title="Ook zo'n resultaat in uw woning?" />
    </>
  );
}
