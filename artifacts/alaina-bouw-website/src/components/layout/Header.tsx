import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Menu, Phone, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { company, navItems, phoneHref } from '@/config/site';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location]);

  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const isActive = (href: string) => location === href || location.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b transition-[background-color,border-color,box-shadow] duration-300',
        scrolled || open ? 'border-line bg-cream/90 shadow-[0_6px_24px_-18px_rgb(0_0_0/0.4)] backdrop-blur-xl' : 'border-transparent bg-cream',
      )}
    >
      <div className="container-x flex h-[72px] items-center justify-between gap-6 lg:h-[84px]">
        <Logo />

        <nav aria-label="Hoofdnavigatie" className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={cn(
                'relative rounded-full px-4 py-2 text-[0.95rem] font-medium no-underline transition-colors',
                isActive(item.href) ? 'text-brand' : 'text-ink/75 hover:text-ink',
              )}
            >
              {item.label}
              {isActive(item.href) && <motion.span layoutId="nav-dot" className="absolute bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-brand" />}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {phoneHref && (
            <a href={phoneHref} className="flex items-center gap-2 text-sm font-semibold text-ink no-underline hover:text-brand">
              <Phone className="size-4" /> {company.phone}
            </a>
          )}
          <Link href="/offerte-aanvragen" className="btn btn-primary">
            Offerte aanvragen <ArrowRight className="size-4" />
          </Link>
        </div>

        <button
          type="button"
          className="-mr-2 grid size-12 place-items-center rounded-full text-ink transition-colors hover:bg-sand lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Menu sluiten' : 'Menu openen'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {createPortal(
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobiele navigatie"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 bottom-0 top-[72px] z-50 flex flex-col overflow-y-auto bg-cream px-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-4 lg:hidden"
          >
            <ul className="flex flex-col">
              {[{ label: 'Home', href: '/' }, ...navItems].map((item, i) => (
                <motion.li key={item.href} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.03 * i }}>
                  <Link
                    href={item.href}
                    aria-current={location === item.href ? 'page' : undefined}
                    className={cn(
                      'flex items-center justify-between border-b border-line py-4 font-serif text-[1.65rem] no-underline',
                      location === item.href || (item.href !== '/' && isActive(item.href)) ? 'text-brand' : 'text-ink',
                    )}
                  >
                    {item.label}
                    <ArrowRight className="size-5 text-stone" />
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="mt-auto flex flex-col gap-3 pt-8">
              {phoneHref && (
                <a href={phoneHref} className="btn btn-outline w-full">
                  <Phone className="size-4" /> Bel {company.phone}
                </a>
              )}
              <Link href="/offerte-aanvragen" className="btn btn-primary w-full">
                Offerte aanvragen <ArrowRight className="size-4" />
              </Link>
              <p className="mt-2 text-center text-sm text-stone">Werkgebied: {company.areaLower}</p>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>,
      document.body,
      )}
    </header>
  );
}
