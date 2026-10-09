import { useEffect, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { whatsappHref } from '@/config/site';
import { Footer } from './Footer';
import { Header } from './Header';

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [location]);

  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Ga naar inhoud
      </a>
      <Header />
      <main id="main" className="min-h-[60vh]">{children}</main>
      <Footer />
      {whatsappHref && (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Stuur ons een WhatsApp-bericht"
          className="fixed bottom-6 right-6 z-30 grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_-6px_rgb(37_211_102/0.65)] transition-transform hover:scale-105 focus-visible:outline-white"
        >
          <WhatsAppIcon className="size-8" />
        </a>
      )}
    </>
  );
}
