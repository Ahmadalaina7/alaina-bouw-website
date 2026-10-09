import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'wouter';
import { CtaBand, Reveal, SectionHeading, ServiceCard } from '@/components/ui';
import { areaPlaces, company, photoBySrcNumber, processSteps, projectPhotos, services } from '@/config/site';
import { usePageMeta } from '@/lib/seo';

const heroMain = photoBySrcNumber(1);

export default function Home() {
  usePageMeta(
    'Klusbedrijf voor bouwdiensten',
    `Alaina Bouw is een klusbedrijf voor stukadoorswerk, schilderwerk, tegelwerk, laminaat leggen en tuinwerk in ${company.areaLower}. Vraag vrijblijvend een offerte aan.`,
  );
  return (
    <>
      <Hero />
      <TrustStrip />

      <section className="section">
        <div className="container-x">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading eyebrow="Bouwdiensten" title="Alles voor een woning die weer klopt." text="Van strakke wanden tot een nieuwe vloer: de bouwdiensten van dit klusbedrijf. Staat uw klus er niet tussen? Vraag het ons gerust." />
            <Link href="/diensten" className="link-arrow shrink-0">Alle diensten <ArrowRight className="size-4" /></Link>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <Reveal key={service.slug} delay={i * 0.06}>
                <ServiceCard service={service} index={i} />
              </Reveal>
            ))}
            <Reveal delay={services.length * 0.06}>
              <Link
                href="/offerte-aanvragen?service=anders"
                className="group flex h-full min-h-[260px] flex-col justify-between rounded-2xl bg-ink p-7 text-white no-underline transition-transform duration-300 hover:-translate-y-1"
              >
                <span className="eyebrow !bg-white/10 !text-white/75">Iets anders?</span>
                <div>
                  <h3 className="text-3xl leading-tight">Uw klus staat er niet tussen?</h3>
                  <p className="mt-3 text-white/65">Leg het ons voor. We denken graag met u mee.</p>
                  <span className="mt-6 inline-flex items-center gap-2 font-semibold">
                    Vraag het ons <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <Process />
      <ProjectsPreview />
      <AreaBand />
      <div className="pt-20 lg:pt-28">
        <CtaBand />
      </div>
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-t border-line">
      <div className="container-x grid items-center gap-10 py-10 sm:py-14 lg:grid-cols-[1fr_0.95fr] lg:gap-16 lg:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-brand sm:text-xs">
            Alaina Bouw Klusbedrijf · Uw plannen, eerst
          </p>
          <h1 className="mt-6 max-w-xl text-[2.8rem] font-medium leading-[1.03] tracking-[-0.055em] sm:text-6xl lg:text-[4rem]">
            Van binnen tot buiten, <span className="text-brand">vakkundig geregeld.</span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-stone sm:text-lg">
            Alaina Bouw is een klusbedrijf voor bouwdiensten: stukadoorswerk, schilderwerk, tuinwerk, tegelwerk en laminaat leggen. Vertel wat u wilt laten doen.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/offerte-aanvragen" className="btn btn-primary !min-h-12 !rounded-none px-5 text-sm">
              Bespreek uw plannen <ArrowRight className="size-4" />
            </Link>
            <Link href="/diensten" className="btn btn-outline !min-h-12 !rounded-none px-5 text-sm">Bekijk mogelijkheden</Link>
          </div>
          <p className="mt-5 text-xs leading-relaxed text-stone">
            Werkgebied: {company.areaLower}. Beschikbaarheid wordt per aanvraag afgestemd.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-[620px] lg:max-w-none"
        >
          <div className="relative aspect-[1.08] overflow-hidden bg-sand shadow-soft sm:aspect-[1.18]">
            <img src={heroMain.src} alt={heroMain.alt} width={heroMain.width} height={heroMain.height} fetchPriority="high" className="size-full object-cover object-center" />
          </div>
          <div className="absolute left-4 top-16 max-w-[16rem] bg-white px-4 py-3 shadow-soft sm:left-6 sm:top-20 sm:max-w-[18rem] sm:px-5 sm:py-4">
            <p className="text-[0.58rem] font-bold uppercase tracking-[0.14em] text-brand">Eerst luisteren</p>
            <p className="mt-2 text-base leading-snug tracking-tight text-ink sm:text-lg">We beginnen bij uw wensen.</p>
          </div>
          <div className="absolute bottom-0 right-0 w-[38%] min-w-[9rem] bg-brand px-4 py-4 text-white sm:px-5 sm:py-5">
            <p className="text-[0.58rem] font-bold uppercase tracking-[0.14em] text-white/80">Uw woning</p>
            <p className="mt-2 text-2xl font-medium leading-tight tracking-tight sm:text-3xl">Uw plan.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TrustStrip() {
  return (
    <section className="border-y border-line bg-white">
      <div className="container-x">
        <ul className="flex snap-x gap-8 overflow-x-auto py-5 [scrollbar-width:none] sm:justify-between [&::-webkit-scrollbar]:hidden">
          {services.map((s) => (
            <li key={s.slug} className="flex shrink-0 snap-start items-center gap-2.5 text-sm font-semibold text-ink/80">
              <s.icon className="size-5 text-brand" /> {s.title}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="section bg-ink text-white">
      <div className="container-x grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="eyebrow !bg-white/10 !text-[#e7a1a2]">Zo werken wij</p>
          <h2 className="mt-4 text-[2.1rem] leading-[1.1] sm:text-5xl">Van eerste vraag tot oplevering.</h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-white/65">
            Een heldere aanpak in vier stappen. Zo weet u vooraf precies wat u kunt verwachten.
          </p>
          <Link href="/werkwijze" className="btn btn-ghost-light mt-8">
            Meer over onze werkwijze <ArrowRight className="size-4" />
          </Link>
        </div>
        <ol className="grid gap-4">
          {processSteps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.08}>
              <li className="flex gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
                <span className="font-serif text-4xl leading-none text-[#e7a1a2]">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="text-2xl">{step.title}</h3>
                  <p className="mt-2 leading-relaxed text-white/65">{step.text}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ProjectsPreview() {
  const picks = [29, 32, 26, 22, 33, 28].map(photoBySrcNumber);
  return (
    <section className="section">
      <div className="container-x">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading eyebrow="Projecten" title="Een kijkje in ons werk." text="Foto's van echte projecten: van badkamer en keuken tot vloeren en maatwerk." />
          <Link href="/projecten" className="link-arrow shrink-0">Alle {projectPhotos.length} foto's <ArrowRight className="size-4" /></Link>
        </div>
        <div className="mt-12 grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[220px] sm:gap-4 lg:auto-rows-[260px] lg:grid-cols-4">
          {picks.map((photo, i) => (
            <Reveal key={photo.src} delay={i * 0.05} className={i === 0 ? 'row-span-2' : i === 3 ? 'col-span-2 lg:col-span-1 lg:row-span-2' : ''}>
              <Link href="/projecten" className="group relative block size-full overflow-hidden rounded-2xl bg-sand">
                <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-4 pt-12 text-sm font-medium text-white">{photo.caption}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function AreaBand() {
  return (
    <section className="border-y border-line bg-sand">
      <div className="container-x grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-20">
        <div>
          <p className="eyebrow">Werkgebied</p>
          <h2 className="mt-4 text-[2.1rem] leading-[1.1] sm:text-5xl">Actief in {company.areaLower}.</h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-stone">
            Van Zeeuws-Vlaanderen tot Schouwen-Duiveland: we komen bij u langs. Laat ons weten waar uw project zich bevindt, dan stemmen we de planning met u af.
          </p>
          <Link href="/werkgebied" className="link-arrow mt-6">Meer over ons werkgebied <ArrowRight className="size-4" /></Link>
        </div>
        <div className="flex flex-wrap gap-2.5 lg:justify-end">
          {areaPlaces.map((p) => (
            <span key={p} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink/80">
              <MapPin className="size-3.5 text-brand" /> {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
