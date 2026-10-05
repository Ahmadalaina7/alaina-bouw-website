import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import type { Service } from '@/config/site';
import { cn } from '@/lib/utils';

export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = 'left',
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  text?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}) {
  return (
    <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      <p className={cn('eyebrow', align === 'center' && 'justify-center')}>{eyebrow}</p>
      <h2 className="mt-4 text-[2.1rem] leading-[1.1] sm:text-5xl">{title}</h2>
      {text && <p className="mt-5 text-lg leading-relaxed text-stone">{text}</p>}
    </div>
  );
}

export function PageHero({ eyebrow, title, text, children }: { eyebrow: string; title: ReactNode; text?: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-sand">
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-[420px] rounded-full border border-brand/15" />
      <div aria-hidden className="pointer-events-none absolute -right-8 -top-8 size-[260px] rounded-full border border-brand/10" />
      <div className="container-x relative py-14 sm:py-20 lg:py-24">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-5 max-w-4xl text-[2.6rem] leading-[1.05] sm:text-6xl lg:text-7xl">{title}</h1>
          {text && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-stone sm:text-xl">{text}</p>}
          {children}
        </motion.div>
      </div>
    </section>
  );
}

export function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = service.icon;
  return (
    <Link
      href={`/diensten/${service.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white no-underline shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-sand">
        {service.image ? (
          <img
            src={service.image.src}
            alt=""
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="grid size-full place-items-center bg-[radial-gradient(circle_at_30%_20%,#fff_0,#f2eee8_60%)]">
            <Icon className="size-20 text-brand/25" strokeWidth={1} />
          </div>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink backdrop-blur">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-brand-soft text-brand">
            <Icon className="size-5" />
          </span>
          <h3 className="text-2xl">{service.title}</h3>
        </div>
        <p className="mt-3 flex-1 leading-relaxed text-stone">{service.short}</p>
        <span className="link-arrow mt-5 text-sm">
          Meer over {service.title.toLowerCase()} <ArrowRight className="size-4" />
        </span>
      </div>
    </Link>
  );
}

export function CtaBand({ title = 'Een klus in gedachten?', text = 'Beschrijf uw plannen in een paar minuten. We nemen contact met u op om de mogelijkheden te bespreken.' }: { title?: string; text?: string }) {
  return (
    <section className="container-x pb-20 lg:pb-28">
      <Reveal className="relative overflow-hidden rounded-3xl bg-brand px-6 py-12 text-white sm:px-12 lg:px-16 lg:py-16">
        <div aria-hidden className="absolute -bottom-40 -right-20 size-[420px] rounded-full border border-white/15" />
        <div aria-hidden className="absolute -bottom-28 -right-6 size-[280px] rounded-full border border-white/10" />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-3xl leading-tight sm:text-4xl">{title}</h2>
            <p className="mt-3 text-white/80">{text}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/offerte-aanvragen" className="btn btn-light">
              Offerte aanvragen <ArrowRight className="size-4" />
            </Link>
            <Link href="/projecten" className="btn btn-ghost-light">Bekijk projecten</Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
