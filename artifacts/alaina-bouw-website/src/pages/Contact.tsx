import { CheckCircle2, Clock, Mail, MapPin, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import { QuoteForm } from '@/components/form/QuoteForm';
import { company, emailHref, phoneHref, processSteps, whatsappHref } from '@/config/site';
import { usePageMeta } from '@/lib/seo';

function useInitialService() {
  return typeof window === 'undefined' ? undefined : new URLSearchParams(window.location.search).get('service') ?? undefined;
}

function ContactCards() {
  const cards = [
    phoneHref && { href: phoneHref, icon: Phone, label: 'Bel ons', value: company.phone },
    whatsappHref && { href: whatsappHref, icon: MessageCircle, label: 'WhatsApp', value: 'Stuur een bericht', external: true },
    emailHref && { href: emailHref, icon: Mail, label: 'E-mail', value: company.email },
  ].filter(Boolean) as { href: string; icon: typeof Phone; label: string; value: string; external?: boolean }[];

  if (!cards.length) return null;
  return (
    <div className="grid gap-3">
      {cards.map((c) => (
        <a
          key={c.label}
          href={c.href}
          {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4 no-underline transition-shadow hover:shadow-soft"
        >
          <span className="grid size-11 place-items-center rounded-xl bg-brand-soft text-brand">
            <c.icon className="size-5" />
          </span>
          <span>
            <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-stone">{c.label}</span>
            <span className="font-semibold text-ink">{c.value}</span>
          </span>
        </a>
      ))}
    </div>
  );
}

function FormPage({ eyebrow, title, text, metaTitle, metaDescription }: { eyebrow: string; title: string; text: string; metaTitle: string; metaDescription: string }) {
  usePageMeta(metaTitle, metaDescription);
  const initialService = useInitialService();

  return (
    <section className="relative overflow-hidden bg-sand">
      <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 size-[520px] rounded-full border border-brand/10" />
      <div className="container-x relative grid gap-10 py-10 sm:py-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:py-20">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-5 text-[2.5rem] leading-[1.05] sm:text-6xl">{title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-stone">{text}</p>

          <ul className="mt-8 hidden space-y-4 sm:block">
            {[
              { icon: Clock, text: 'Invullen duurt ongeveer 2 minuten' },
              { icon: CheckCircle2, text: 'Volledig vrijblijvend' },
              { icon: ShieldCheck, text: 'Uw gegevens worden vertrouwelijk behandeld' },
              { icon: MapPin, text: `Werkgebied: ${company.areaLower}` },
            ].map(({ icon: Icon, text: t }) => (
              <li key={t} className="flex items-center gap-3 font-medium text-ink/85">
                <Icon className="size-5 text-brand" /> {t}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <ContactCards />
          </div>

          <div className="mt-10 hidden rounded-2xl border border-line bg-white/60 p-6 lg:block">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-stone">Wat gebeurt er hierna?</p>
            <ol className="mt-4 space-y-4">
              {processSteps.slice(1).map((s, i) => (
                <li key={s.title} className="flex gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-ink text-xs font-bold text-white">{i + 1}</span>
                  <span className="text-sm leading-relaxed text-stone"><strong className="text-ink">{s.title}.</strong> {s.text}</span>
                </li>
              ))}
            </ol>
          </div>
        </aside>

        <div className="rounded-3xl border border-line bg-white p-5 shadow-lift sm:p-8 lg:p-10">
          <QuoteForm initialService={initialService} />
        </div>
      </div>
    </section>
  );
}

export function ContactPage() {
  return (
    <FormPage
      eyebrow="Contact"
      title="Laten we kennismaken."
      text="Heeft u een vraag of een klus in gedachten? Vul het formulier in en we nemen zo snel mogelijk contact met u op."
      metaTitle="Contact"
      metaDescription="Neem contact op met Alaina Bouw Klusbedrijf. Stel uw vraag of beschrijf uw klus via het contactformulier."
    />
  );
}

export function QuotePage() {
  return (
    <FormPage
      eyebrow="Offerte aanvragen"
      title="Vraag een offerte aan."
      text="Beschrijf uw klus in drie korte stappen. Hoe meer we weten, hoe beter we u een passend voorstel kunnen doen."
      metaTitle="Offerte aanvragen"
      metaDescription="Vraag vrijblijvend een offerte aan bij Alaina Bouw Klusbedrijf voor stukadoorswerk, schilderwerk, tegelwerk, laminaat of tuinwerk."
    />
  );
}
