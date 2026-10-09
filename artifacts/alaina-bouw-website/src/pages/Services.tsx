import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'wouter';
import { CtaBand, PageHero, Reveal, ServiceCard } from '@/components/ui';
import { company, processSteps, services } from '@/config/site';
import { usePageMeta } from '@/lib/seo';
import NotFound from './NotFound';

export function ServicesPage() {
  usePageMeta('Bouwdiensten van het klusbedrijf', 'Bouwdiensten van Alaina Bouw: stukadoorswerk, schilderwerk, tegelwerk, laminaat leggen en tuinwerk in heel Nederland.');
  return (
    <>
      <PageHero
        eyebrow="Diensten"
        title="Vakmanschap voor binnen en buiten."
        text="Kies de dienst die bij uw klus past. Combineert u meerdere werkzaamheden? Dan stemmen we alles in één aanvraag op elkaar af."
      />
      <section className="section">
        <div className="container-x grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.slug} delay={i * 0.05}>
              <ServiceCard service={service} index={i} />
            </Reveal>
          ))}
          <Reveal delay={0.25}>
            <div className="flex h-full min-h-[260px] flex-col justify-between rounded-2xl border border-dashed border-stone/30 p-7">
              <p className="eyebrow">Overige klus</p>
              <div>
                <h3 className="text-2xl">Staat uw klus er niet bij?</h3>
                <p className="mt-2 text-stone">Kies in het formulier voor “Overige klus” en beschrijf wat u wilt laten doen.</p>
                <Link href="/offerte-aanvragen?service=anders" className="link-arrow mt-5">Leg uw klus voor <ArrowRight className="size-4" /></Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

export function ServiceDetailPage({ slug }: { slug: string }) {
  const service = services.find((s) => s.slug === slug);
  usePageMeta(service ? service.title : 'Pagina niet gevonden', service ? `${service.title} door Alaina Bouw Klusbedrijf. ${service.short} Werkgebied: heel Nederland.` : undefined);
  if (!service) return <NotFound />;
  const Icon = service.icon;
  const others = services.filter((s) => s.slug !== slug);

  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-sand">
        <div className="container-x grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-20">
          <div>
            <nav aria-label="Kruimelpad" className="mb-6 text-sm text-stone">
              <Link href="/diensten" className="no-underline hover:text-brand">Diensten</Link>
              <span className="mx-2">/</span>
              <span className="text-ink">{service.title}</span>
            </nav>
            <span className="grid size-14 place-items-center rounded-2xl bg-brand text-white shadow-soft">
              <Icon className="size-7" />
            </span>
            <h1 className="mt-6 text-[2.6rem] leading-[1.05] sm:text-6xl">{service.title}</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-stone">{service.intro}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={`/offerte-aanvragen?service=${service.slug}`} className="btn btn-primary h-14 px-7">
                Offerte aanvragen <ArrowRight className="size-4" />
              </Link>
              <Link href="/projecten" className="btn btn-outline h-14 px-7">Bekijk projecten</Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-white shadow-lift lg:aspect-[4/5]">
            {service.image ? (
              <img src={service.image.src} alt={service.image.alt} className="size-full object-cover" />
            ) : (
              <div className="grid size-full place-items-center bg-[radial-gradient(circle_at_30%_20%,#fff_0,#efe9e1_70%)]">
                <Icon className="size-32 text-brand/20" strokeWidth={0.8} />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="eyebrow">Waarvoor u ons inschakelt</p>
            <h2 className="mt-4 text-4xl leading-tight sm:text-5xl">{service.title} op maat.</h2>
            <p className="mt-5 text-lg leading-relaxed text-stone">
              Elke woning en elke wens is anders. Daarom bespreken we vooraf wat u voor ogen heeft, zodat de uitvoering precies aansluit op uw situatie. Werkgebied: {company.areaLower}.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {service.examples.map((ex) => (
              <li key={ex} className="flex items-start gap-3 rounded-2xl border border-line bg-white p-5 shadow-soft">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
                  <Check className="size-4" strokeWidth={2.5} />
                </span>
                <span className="font-medium leading-snug">{ex}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-y border-line bg-white py-16 lg:py-20">
        <div className="container-x">
          <p className="eyebrow">Zo werkt het</p>
          <h2 className="mt-4 text-3xl sm:text-4xl">In vier stappen geregeld.</h2>
          <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, i) => (
              <li key={step.title} className="border-t-2 border-brand pt-5">
                <span className="text-sm font-bold text-brand">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-2 text-xl">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <h2 className="text-3xl sm:text-4xl">Andere diensten</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((s) => (
              <Link key={s.slug} href={`/diensten/${s.slug}`} className="group flex items-center justify-between gap-3 rounded-2xl border border-line bg-white p-5 no-underline transition-shadow hover:shadow-soft">
                <span className="flex items-center gap-3 font-semibold">
                  <s.icon className="size-5 text-brand" /> {s.title}
                </span>
                <ArrowRight className="size-4 text-stone transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CtaBand title={`${service.title} laten uitvoeren?`} />
    </>
  );
}
