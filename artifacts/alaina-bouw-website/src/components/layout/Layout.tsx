import { useEffect, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
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
          <svg aria-hidden="true" viewBox="0 0 32 32" className="size-7" fill="none">
            <path
              d="M16 3.5a12.3 12.3 0 0 0-10.6 18.5L3.8 28l6.2-1.6A12.3 12.3 0 1 0 16 3.5Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path
              d="M11.2 9.5c-.4 0-.8.2-1.1.6-.4.4-1.3 1.3-1.3 3.1s1.3 3.6 1.5 3.8c.2.3 2.6 4.2 6.4 5.7 3.2 1.2 3.8 1 4.5.9.7-.1 2.3-.9 2.6-1.8.3-.9.3-1.6.2-1.8-.1-.2-.4-.3-.8-.5l-2.7-1.3c-.4-.1-.6-.2-.9.2l-1.2 1.5c-.2.3-.5.3-.9.1a10.8 10.8 0 0 1-3.2-2 11.2 11.2 0 0 1-2.1-2.7c-.2-.4 0-.6.2-.8l.6-.7c.2-.2.3-.4.4-.7.1-.3 0-.5 0-.7l-1.2-2.9c-.2-.5-.5-.5-.8-.5h-.2Z"
              fill="currentColor"
            />
          </svg>
        </a>
      )}
    </>
  );
}
