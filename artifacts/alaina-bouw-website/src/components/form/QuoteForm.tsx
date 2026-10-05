import { useEffect, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCreateLead } from '@workspace/api-client-react';
import type { LeadInput } from '@workspace/api-client-react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  User,
  type LucideIcon,
} from 'lucide-react';
import { Link } from 'wouter';
import { company, otherService, phoneHref, services } from '@/config/site';
import { cn } from '@/lib/utils';
import { FieldError, PillGroup, TextArea, TextField } from './fields';

type Timeline = LeadInput['timeline'];
type Budget = NonNullable<LeadInput['budget']>;
type ContactPreference = LeadInput['contactPreference'];

const timelineOptions: { value: Timeline; label: string }[] = [
  { value: 'asap', label: 'Zo snel mogelijk' },
  { value: 'within_month', label: 'Binnen een maand' },
  { value: 'one_to_three_months', label: '1 – 3 maanden' },
  { value: 'three_to_six_months', label: '3 – 6 maanden' },
  { value: 'exploring', label: 'Ik oriënteer me nog' },
];

const budgetOptions: { value: Budget; label: string }[] = [
  { value: 'under_2500', label: 'Tot € 2.500' },
  { value: '2500_5000', label: '€ 2.500 – 5.000' },
  { value: '5000_10000', label: '€ 5.000 – 10.000' },
  { value: '10000_25000', label: '€ 10.000 – 25.000' },
  { value: 'over_25000', label: 'Meer dan € 25.000' },
  { value: 'undecided', label: 'Weet ik nog niet' },
];

const contactOptions: { value: ContactPreference; label: string; icon: LucideIcon }[] = [
  { value: 'email', label: 'E-mail', icon: Mail },
  { value: 'phone', label: 'Telefoon', icon: Phone },
  { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
];

const serviceOptions = [
  ...services.map((s) => ({ value: s.slug, label: s.title, icon: s.icon })),
  { value: otherService.slug, label: otherService.title, icon: otherService.icon },
];

const steps = ['Uw klus', 'Planning', 'Contact'] as const;

interface Values {
  service: string;
  description: string;
  timeline: Timeline | '';
  city: string;
  postalCode: string;
  budget: Budget | '';
  name: string;
  phone: string;
  email: string;
  contactPreference: ContactPreference;
  privacyConsent: boolean;
  website: string;
}

type Errors = Partial<Record<keyof Values, string>>;

const emptyValues: Values = {
  service: '',
  description: '',
  timeline: '',
  city: '',
  postalCode: '',
  budget: '',
  name: '',
  phone: '',
  email: '',
  contactPreference: 'email',
  privacyConsent: false,
  website: '',
};

const DRAFT_KEY = 'alaina-bouw:aanvraag';
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+\d][\d\s\-().]{5,}$/;
const postalPattern = /^\d{4}\s?[a-zA-Z]{2}$/;

function validate(step: number, v: Values): Errors {
  const e: Errors = {};
  if (step === 0) {
    if (!v.service) e.service = 'Kies het soort werk.';
    if (v.description.trim().length < 10) e.description = 'Beschrijf uw klus in minimaal 10 tekens.';
  }
  if (step === 1) {
    if (!v.timeline) e.timeline = 'Kies wanneer u het werk wilt laten uitvoeren.';
    if (v.city.trim().length < 2) e.city = 'Vul de plaats van het project in.';
    if (v.postalCode.trim() && !postalPattern.test(v.postalCode.trim())) e.postalCode = 'Gebruik het formaat 1234 AB.';
  }
  if (step === 2) {
    if (v.name.trim().length < 2) e.name = 'Vul uw naam in.';
    if (!phonePattern.test(v.phone.trim())) e.phone = 'Vul een geldig telefoonnummer in.';
    if (!emailPattern.test(v.email.trim())) e.email = 'Vul een geldig e-mailadres in.';
    if (!v.privacyConsent) e.privacyConsent = 'Geef toestemming om uw aanvraag te kunnen verwerken.';
  }
  return e;
}

function loadDraft(initialService?: string): Values {
  let draft = emptyValues;
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (raw) draft = { ...emptyValues, ...JSON.parse(raw), privacyConsent: false, website: '' };
  } catch {
    /* geen opslag beschikbaar */
  }
  if (initialService && serviceOptions.some((o) => o.value === initialService)) draft = { ...draft, service: initialService };
  return draft;
}

export function QuoteForm({ initialService }: { initialService?: string }) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [values, setValues] = useState<Values>(() => loadDraft(initialService));
  const [errors, setErrors] = useState<Errors>({});
  const topRef = useRef<HTMLDivElement>(null);
  const mutation = useCreateLead();

  useEffect(() => {
    if (mutation.isSuccess) return;
    try {
      const { privacyConsent: _p, website: _w, ...draft } = values;
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      /* geen opslag beschikbaar */
    }
  }, [values, mutation.isSuccess]);

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const scrollToTop = () => {
    const el = topRef.current;
    if (el && el.getBoundingClientRect().top < 80) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' });
    }
  };

  const focusFirstError = (errs: Errors) => {
    const first = Object.keys(errs)[0];
    requestAnimationFrame(() => {
      // Scoped to the form: `name="description"` also matches the page's <meta> tag.
      const el = topRef.current?.querySelector<HTMLElement>(`[name="${first}"]`);
      el?.focus();
      el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });
  };

  const goTo = (target: number) => {
    setDirection(target > step ? 1 : -1);
    setStep(target);
    scrollToTop();
  };

  const next = () => {
    const errs = validate(step, values);
    setErrors(errs);
    if (Object.keys(errs).length) return focusFirstError(errs);
    goTo(step + 1);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (step < steps.length - 1) return next();
    const errs = validate(step, values);
    setErrors(errs);
    if (Object.keys(errs).length) return focusFirstError(errs);

    const params = new URLSearchParams(window.location.search);
    const utm = (key: string) => params.get(key)?.slice(0, 200) || undefined;
    const data: LeadInput = {
      service: values.service,
      description: values.description.trim(),
      timeline: values.timeline as Timeline,
      city: values.city.trim(),
      ...(values.postalCode.trim() ? { postalCode: values.postalCode.trim().toUpperCase() } : {}),
      ...(values.budget ? { budget: values.budget } : {}),
      name: values.name.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      contactPreference: values.contactPreference,
      privacyConsent: true,
      ...(values.website ? { website: values.website } : {}),
      ...(utm('utm_source') ? { utmSource: utm('utm_source') } : {}),
      ...(utm('utm_medium') ? { utmMedium: utm('utm_medium') } : {}),
      ...(utm('utm_campaign') ? { utmCampaign: utm('utm_campaign') } : {}),
    };
    mutation.mutate(
      { data },
      {
        onSuccess: () => {
          try {
            sessionStorage.removeItem(DRAFT_KEY);
          } catch {
            /* geen opslag beschikbaar */
          }
          scrollToTop();
        },
      },
    );
  };

  if (mutation.isSuccess) {
    return <SuccessState values={values} reference={mutation.data?.reference} />;
  }

  const descriptionHint = services.find((s) => s.slug === values.service)?.requestHint;

  return (
    <div ref={topRef} className="scroll-mt-28">
      <Stepper step={step} onStepClick={(i) => i < step && goTo(i)} />

      <form onSubmit={submit} noValidate className="relative mt-8" aria-label="Offerteaanvraag">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ opacity: 0, x: direction * 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -24 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="space-y-7"
          >
            {step === 0 && (
              <>
                <StepTitle title="Waar kunnen we u mee helpen?" text="Kies het soort werk en vertel kort wat u wilt laten doen." />
                <fieldset aria-describedby={errors.service ? 'service-error' : undefined}>
                  <legend className="mb-3 text-sm font-semibold text-ink">Soort werk</legend>
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                    {serviceOptions.map(({ value, label, icon: Icon }) => {
                      const checked = values.service === value;
                      return (
                        <label
                          key={value}
                          className={cn(
                            'group relative flex min-h-[92px] cursor-pointer flex-col justify-between gap-3 rounded-2xl border p-4 transition-all',
                            'has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand/20',
                            checked ? 'border-brand bg-brand-soft/60 shadow-[inset_0_0_0_1px_var(--color-brand)]' : 'border-line bg-white hover:border-stone/40 hover:shadow-soft',
                          )}
                        >
                          <input type="radio" name="service" value={value} checked={checked} onChange={() => set('service', value)} className="sr-only" />
                          <span className="flex items-start justify-between">
                            <span className={cn('grid size-10 place-items-center rounded-xl transition-colors', checked ? 'bg-brand text-white' : 'bg-sand text-brand')}>
                              <Icon className="size-5" />
                            </span>
                            <span className={cn('grid size-5 place-items-center rounded-full border transition-all', checked ? 'border-brand bg-brand text-white' : 'border-line bg-white')}>
                              {checked && <Check className="size-3" strokeWidth={3} />}
                            </span>
                          </span>
                          <span className="text-[0.95rem] font-semibold leading-tight text-ink">{label}</span>
                        </label>
                      );
                    })}
                  </div>
                  <FieldError id="service-error" message={errors.service} />
                </fieldset>
                <TextArea
                  id="description"
                  name="description"
                  label="Omschrijving van uw klus"
                  value={values.description}
                  maxLength={4000}
                  onChange={(e) => set('description', e.target.value)}
                  placeholder={descriptionHint ?? 'Bijvoorbeeld: woonkamer van ca. 30 m² laten stucen en schilderen, plafond inbegrepen.'}
                  error={errors.description}
                  footer={
                    <span className="flex justify-between gap-4">
                      <span>Hoe meer details, hoe beter we u kunnen helpen.</span>
                      <span className="tabular-nums">{values.description.length}/4000</span>
                    </span>
                  }
                />
              </>
            )}

            {step === 1 && (
              <>
                <StepTitle title="Waar en wanneer?" text="Zo kunnen we de planning en praktische zaken goed afstemmen." />
                <PillGroup name="timeline" legend="Gewenste start" options={timelineOptions} value={values.timeline} onChange={(v) => set('timeline', v)} error={errors.timeline} />
                <div className="grid gap-5 sm:grid-cols-[1.4fr_1fr]">
                  <TextField
                    id="city"
                    name="city"
                    label="Plaats"
                    icon={MapPin}
                    autoComplete="address-level2"
                    placeholder="Bijv. Utrecht"
                    maxLength={100}
                    value={values.city}
                    onChange={(e) => set('city', e.target.value)}
                    error={errors.city}
                  />
                  <TextField
                    id="postalCode"
                    name="postalCode"
                    label="Postcode"
                    optional
                    autoComplete="postal-code"
                    placeholder="1234 AB"
                    maxLength={7}
                    value={values.postalCode}
                    onChange={(e) => set('postalCode', e.target.value)}
                    error={errors.postalCode}
                  />
                </div>
                <PillGroup name="budget" legend="Budgetindicatie" optional options={budgetOptions} value={values.budget} onChange={(v) => set('budget', v)} />
              </>
            )}

            {step === 2 && (
              <>
                <StepTitle title="Hoe kunnen we u bereiken?" text="We gebruiken uw gegevens alleen om op uw aanvraag te reageren." />
                <TextField id="name" name="name" label="Naam" icon={User} autoComplete="name" placeholder="Voor- en achternaam" maxLength={120} value={values.name} onChange={(e) => set('name', e.target.value)} error={errors.name} />
                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField id="phone" name="phone" type="tel" inputMode="tel" label="Telefoonnummer" icon={Phone} autoComplete="tel" placeholder="06 12345678" maxLength={40} value={values.phone} onChange={(e) => set('phone', e.target.value)} error={errors.phone} />
                  <TextField id="email" name="email" type="email" inputMode="email" label="E-mailadres" icon={Mail} autoComplete="email" placeholder="naam@voorbeeld.nl" maxLength={254} value={values.email} onChange={(e) => set('email', e.target.value)} error={errors.email} />
                </div>
                <fieldset>
                  <legend className="mb-3 text-sm font-semibold text-ink">Hoe wilt u benaderd worden?</legend>
                  <div className="grid grid-cols-3 gap-1 rounded-2xl bg-sand p-1">
                    {contactOptions.map(({ value, label, icon: Icon }) => {
                      const checked = values.contactPreference === value;
                      return (
                        <label
                          key={value}
                          className={cn(
                            'relative flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl px-2 text-sm font-semibold transition-colors',
                            'has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand/20',
                            checked ? 'text-ink' : 'text-stone hover:text-ink',
                          )}
                        >
                          {checked && <motion.span layoutId="contact-pref" className="absolute inset-0 rounded-xl bg-white shadow-soft" transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }} />}
                          <input type="radio" name="contactPreference" value={value} checked={checked} onChange={() => set('contactPreference', value)} className="sr-only" />
                          <Icon className={cn('relative size-4 shrink-0', checked && 'text-brand')} />
                          <span className="relative">{label}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <div>
                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-white p-4 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand/20">
                    <input
                      id="privacyConsent"
                      name="privacyConsent"
                      type="checkbox"
                      checked={values.privacyConsent}
                      onChange={(e) => set('privacyConsent', e.target.checked)}
                      aria-invalid={errors.privacyConsent ? true : undefined}
                      aria-describedby={errors.privacyConsent ? 'privacyConsent-error' : undefined}
                      className="peer sr-only"
                    />
                    <span
                      aria-hidden
                      className={cn(
                        'mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border transition-colors',
                        values.privacyConsent ? 'border-brand bg-brand text-white' : errors.privacyConsent ? 'border-brand bg-white' : 'border-stone/40 bg-white',
                      )}
                    >
                      {values.privacyConsent && <Check className="size-3.5" strokeWidth={3} />}
                    </span>
                    <span className="text-sm leading-relaxed text-stone">
                      Ik ga akkoord met de verwerking van mijn gegevens volgens de{' '}
                      <Link href="/privacy" className="font-semibold text-brand underline-offset-2 hover:underline">privacyverklaring</Link>.
                    </span>
                  </label>
                  <FieldError id="privacyConsent-error" message={errors.privacyConsent} />
                </div>

                {/* Honeypot tegen spambots: onzichtbaar voor bezoekers. */}
                <div aria-hidden="true" className="absolute -left-[10000px] size-px overflow-hidden">
                  <label>
                    Laat dit veld leeg
                    <input tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => set('website', e.target.value)} />
                  </label>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {mutation.isError && (
          <div role="alert" className="mt-6 rounded-2xl border border-brand/20 bg-brand-soft p-4 text-sm leading-relaxed text-brand-dark">
            <strong className="block">Het versturen is niet gelukt.</strong>
            Uw gegevens staan nog in het formulier. Controleer uw internetverbinding en probeer het opnieuw
            {phoneHref ? (
              <>
                {' '}of bel ons op <a href={phoneHref} className="font-semibold underline">{company.phone}</a>
              </>
            ) : null}
            .
          </div>
        )}

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          {step > 0 ? (
            <button type="button" className="btn btn-outline w-full sm:w-auto" onClick={() => { setErrors({}); goTo(step - 1); }}>
              <ArrowLeft className="size-4" /> Vorige
            </button>
          ) : (
            <p className="flex items-center justify-center gap-2 text-sm text-stone sm:justify-start">
              <Lock className="size-4" /> Vrijblijvend en vertrouwelijk
            </p>
          )}
          <button type="submit" className="btn btn-primary w-full sm:w-auto sm:min-w-[200px]" disabled={mutation.isPending}>
            {step < steps.length - 1 ? (
              <>Volgende stap <ArrowRight className="size-4" /></>
            ) : mutation.isPending ? (
              <><Loader2 className="size-4 animate-spin" /> Versturen…</>
            ) : (
              <>Aanvraag versturen <ArrowRight className="size-4" /></>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function StepTitle({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h2 className="text-[1.75rem] leading-tight sm:text-3xl">{title}</h2>
      <p className="mt-2 text-stone">{text}</p>
    </div>
  );
}

function Stepper({ step, onStepClick }: { step: number; onStepClick: (i: number) => void }) {
  return (
    <div>
      <p className="sr-only" aria-live="polite">
        Stap {step + 1} van {steps.length}: {steps[step]}
      </p>
      <ol className="grid grid-cols-3 gap-2" aria-hidden>
        {steps.map((label, i) => {
          const done = i < step;
          const current = i === step;
          return (
            <li key={label}>
              <button
                type="button"
                tabIndex={-1}
                onClick={() => onStepClick(i)}
                disabled={!done}
                className={cn('flex w-full flex-col gap-2.5 text-left', done && 'cursor-pointer')}
              >
                <span className="relative h-1.5 w-full overflow-hidden rounded-full bg-line">
                  <motion.span
                    className="absolute inset-y-0 left-0 rounded-full bg-brand"
                    initial={false}
                    animate={{ width: done || current ? '100%' : '0%' }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                </span>
                <span className={cn('flex items-center gap-1.5 text-xs font-semibold sm:text-sm', current || done ? 'text-ink' : 'text-stone/70')}>
                  <span
                    className={cn(
                      'grid size-5 shrink-0 place-items-center rounded-full text-[0.7rem]',
                      done ? 'bg-brand text-white' : current ? 'bg-ink text-white' : 'bg-line text-stone',
                    )}
                  >
                    {done ? <Check className="size-3" strokeWidth={3} /> : i + 1}
                  </span>
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function SuccessState({ values, reference }: { values: Values; reference?: string }) {
  const service = serviceOptions.find((s) => s.value === values.service)?.label;
  const timeline = timelineOptions.find((t) => t.value === values.timeline)?.label;
  const firstName = values.name.trim().split(/\s+/)[0];
  const contact = { email: 'e-mail', phone: 'telefoon', whatsapp: 'WhatsApp' }[values.contactPreference];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="py-4 text-center" role="status" aria-live="polite">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
        className="mx-auto grid size-20 place-items-center rounded-full bg-[#e8f1e9] text-[#2f6b3a]"
      >
        <Check className="size-10" strokeWidth={2.5} />
      </motion.div>
      <h2 className="mt-6 text-3xl sm:text-4xl">Bedankt, {firstName}!</h2>
      <p className="mx-auto mt-3 max-w-md leading-relaxed text-stone">
        Uw aanvraag is goed ontvangen. We nemen zo snel mogelijk contact met u op via {contact}.
      </p>
      {reference && (
        <p className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-sand px-4 py-2 text-sm">
          Referentie <strong className="font-semibold tracking-wide text-ink">{reference}</strong>
        </p>
      )}
      <dl className="mx-auto mt-8 grid max-w-md gap-px overflow-hidden rounded-2xl border border-line bg-line text-left text-sm">
        {[
          ['Soort werk', service],
          ['Planning', timeline],
          ['Plaats', values.city],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 bg-white px-4 py-3">
            <dt className="text-stone">{k}</dt>
            <dd className="font-medium text-ink">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/projecten" className="btn btn-outline">Bekijk onze projecten</Link>
        <Link href="/" className="btn btn-primary">Terug naar home</Link>
      </div>
    </motion.div>
  );
}
