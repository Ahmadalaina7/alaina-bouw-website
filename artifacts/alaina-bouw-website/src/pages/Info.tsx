import { ArrowRight, Handshake, MapPin, MessageSquareText, Sparkles } from 'lucide-react';
import { Link } from 'wouter';
import { CtaBand, PageHero, Reveal } from '@/components/ui';
import { areaPlaces, company, photoBySrcNumber, processSteps, services } from '@/config/site';
import { usePageMeta } from '@/lib/seo';

export function ProcessPage() {
  usePageMeta('Werkwijze', 'Zo werkt Alaina Bouw Klusbedrijf: van aanvraag en kennismaking tot offerte en uitvoering.');
  const tips = [
    'Beschrijf om welke ruimte(s) het gaat en hoe groot ze ongeveer zijn.',
    'Vermeld wat de huidige situatie is en wat u anders wilt.',
    'Geef aan wanneer u het werk graag uitgevoerd ziet.',
    'Twijfelt u over de aanpak? Zet het erbij, we denken graag mee.',
  ];
  return (
    <>
      <PageHero eyebrow="Werkwijze" title="Helder vanaf de eerste stap." text="Een goede klus begint met een goed gesprek. Zo pakken we het samen aan." />
      <section className="section">
        <div className="container-x">
          <ol className="relative grid gap-6 lg:grid-cols-4">
            <span aria-hidden className="absolute left-[1.6rem] top-0 h-full w-px bg-line lg:left-0 lg:top-[1.6rem] lg:h-px lg:w-full" />
            {processSteps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.08}>
                <li className="relative flex gap-5 lg:flex-col">
                  <span className="relative grid size-[3.2rem] shrink-0 place-items-center rounded-full border border-line bg-cream font-serif text-xl text-brand">
                    {i + 1}
                  </span>
                  <div>
                    <h2 className="text-2xl">{step.title}</h2>
                    <p className="mt-2 leading-relaxed text-stone">{step.text}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
      <section className="border-y border-line bg-white py-16 lg:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="eyebrow">Tip</p>
            <h2 className="mt-4 text-4xl leading-tight sm:text-5xl">Zo krijgt u sneller een passend voorstel.</h2>
          </div>
          <ul className="space-y-4">
            {tips.map((tip, i) => (
              <li key={tip} className="flex gap-4 rounded-2xl bg-sand p-5">
                <span className="font-serif text-2xl leading-none text-brand">{i + 1}.</span>
                <span className="leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <div className="pt-20 lg:pt-28">
        <CtaBand />
      </div>
    </>
  );
}

export function AboutPage() {
  usePageMeta('Over ons', `Maak kennis met Alaina Bouw Klusbedrijf: stukadoors-, schilder-, tegel-, vloer- en tuinwerk in ${company.areaLower}.`);
  const values = [
    { icon: MessageSquareText, title: 'Duidelijke communicatie', text: 'Vooraf heldere afspraken over aanpak, planning en kosten.' },
    { icon: Sparkles, title: 'Oog voor detail', text: 'Strakke aansluitingen en een nette afwerking maken het verschil.' },
    { icon: Handshake, title: 'Persoonlijk contact', text: 'We denken met u mee en houden u op de hoogte tijdens het werk.' },
  ];
  const photo = photoBySrcNumber(14);
  return (
    <>
      <PageHero eyebrow="Over ons" title={`Maak kennis met ${company.name}.`} text={`${company.legalName} helpt particulieren in ${company.areaLower} met het opknappen en afwerken van hun woning en tuin.`} />
      <section className="section">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="aspect-[4/5] overflow-hidden rounded-[2rem] shadow-lift">
            <img src={photo.src} alt={photo.alt} loading="lazy" className="size-full object-cover" />
          </div>
          <div>
            <p className="eyebrow">Wie we zijn</p>
            <h2 className="mt-4 text-4xl leading-tight sm:text-5xl">Vakwerk met aandacht voor uw woning.</h2>
            <p className="mt-6 text-lg leading-relaxed text-stone">
              Bij {company.name} draait alles om goed uitgevoerd werk in en om het huis. We voeren {services.map((s) => s.title.toLowerCase()).join(', ').replace(/, ([^,]*)$/, ' en $1')} uit, zodat u voor meerdere klussen bij één partij terecht kunt.
            </p>
            <div className="mt-10 grid gap-4">
              {values.map((v) => (
                <div key={v.title} className="flex gap-4 rounded-2xl border border-line bg-white p-5 shadow-soft">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                    <v.icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-sans text-lg font-semibold tracking-normal">{v.title}</h3>
                    <p className="mt-1 text-stone">{v.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

export function AreaPage() {
  usePageMeta('Werkgebied', `Alaina Bouw Klusbedrijf werkt in ${company.areaLower}. Vraag een offerte aan voor uw project in Zeeland.`);
  return (
    <>
      <PageHero eyebrow="Werkgebied" title={`Actief in ${company.areaLower}.`} text="Ligt uw project in Zeeland, dan kunt u het bij ons voorleggen. De plaats van uw project helpt ons bij de planning." />
      <section className="section">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div>
            <h2 className="text-4xl leading-tight sm:text-5xl">De gemeenten in Zeeland.</h2>
            <p className="mt-5 text-lg leading-relaxed text-stone">
              We werken in heel Zeeland. Vul bij uw aanvraag de plaats en eventueel de postcode in, dan stemmen we de beschikbaarheid en planning met u af.
            </p>
            <Link href="/offerte-aanvragen" className="btn btn-primary mt-8">
              Bespreek uw project <ArrowRight className="size-4" />
            </Link>
          </div>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {areaPlaces.map((p) => (
              <li key={p} className="flex items-center gap-2 rounded-2xl border border-line bg-white px-4 py-4 font-medium shadow-soft">
                <MapPin className="size-4 shrink-0 text-brand" /> {p}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
