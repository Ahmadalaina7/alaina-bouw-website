import { Mail, MapPin, Phone } from 'lucide-react';
import { InstagramIcon } from '@/components/icons/InstagramIcon';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { Link } from 'wouter';
import { company, emailHref, instagramHref, phoneHref, services, whatsappHref } from '@/config/site';
import { Logo } from './Logo';

const linkClass = 'text-white/70 no-underline transition-colors hover:text-white';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-white">
      <div className="container-x">
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo variant="light" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">
              {company.legalName}. Stukadoors-, schilder-, tegel-, vloer- en tuinwerk voor particulieren in {company.areaLower}.
            </p>
          </div>

          <div>
            <h3 className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-white/45">Diensten</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/diensten/${s.slug}`} className={linkClass}>{s.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-white/45">Bedrijf</h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li><Link href="/projecten" className={linkClass}>Projecten</Link></li>
              <li><Link href="/werkwijze" className={linkClass}>Werkwijze</Link></li>
              <li><Link href="/over-ons" className={linkClass}>Over ons</Link></li>
              <li><Link href="/werkgebied" className={linkClass}>Werkgebied</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-white/45">Contact</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {phoneHref && (
                <li><a href={phoneHref} className={`${linkClass} inline-flex items-center gap-2`}><Phone className="size-4" />{company.phone}</a></li>
              )}
              {whatsappHref && (
                <li><a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={`${linkClass} inline-flex items-center gap-2`}><WhatsAppIcon className="size-4" />WhatsApp</a></li>
              )}
              {instagramHref && (
                <li><a href={instagramHref} target="_blank" rel="noopener noreferrer" className={`${linkClass} inline-flex items-center gap-2`}><InstagramIcon className="size-4" />Instagram</a></li>
              )}
              {emailHref && (
                <li><a href={emailHref} className={`${linkClass} inline-flex items-center gap-2`}><Mail className="size-4" />{company.email}</a></li>
              )}
              {company.address && (
                <li className="inline-flex items-start gap-2 text-white/70"><MapPin className="mt-0.5 size-4 shrink-0" />{company.address}</li>
              )}
              <li><Link href="/contact" className={linkClass}>Contactformulier</Link></li>
              <li className="text-white/70">Werkgebied: {company.areaLower}</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-6 pb-28 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between lg:pb-6">
          <p>
            © {year} {company.legalName}
            {company.kvk && <> · KvK {company.kvk}</>}
            {company.btw && <> · Btw {company.btw}</>}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li><Link href="/privacy" className="text-white/45 no-underline hover:text-white">Privacy</Link></li>
            <li><Link href="/cookies" className="text-white/45 no-underline hover:text-white">Cookies</Link></li>
            <li><Link href="/algemene-voorwaarden" className="text-white/45 no-underline hover:text-white">Algemene voorwaarden</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
