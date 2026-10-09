import { useEffect } from 'react';
import { company } from '@/config/site';

export const canonicalOrigin = 'https://alainabouw.nl';

const defaultDescription =
  'Alaina Bouw is een klusbedrijf voor bouwdiensten: stukadoorswerk, schilderwerk, tegelwerk, laminaat leggen en tuinwerk in heel Nederland.';

const defaultKeywords = [
  'Alaina Bouw',
  'Alaina Bouw Klusbedrijf',
  'alainabouw',
  'klusbedrijf',
  'bouwbedrijf',
  'bouwdiensten',
  'stukadoorswerk',
  'schilderwerk',
  'tegelwerk',
  'laminaat leggen',
  'tuinwerk',
  'offerte klusbedrijf',
];

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let meta = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, key);
    document.head.appendChild(meta);
  }
  meta.content = content;
}

function setLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;
  let link = document.head.querySelector<HTMLLinkElement>(selector);
  if (!link) {
    link = document.createElement('link');
    link.rel = rel;
    if (hreflang) link.hreflang = hreflang;
    document.head.appendChild(link);
  }
  link.href = href;
}

/** Werkt titel, trefwoorden, beschrijving, social-tags en canonical-URL bij per pagina. */
export function usePageMeta(
  title: string | null,
  description = defaultDescription,
  options?: { noindex?: boolean; keywords?: string[] },
) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${company.legalName}` : `${company.legalName} | Klusbedrijf voor bouwdiensten`;
    const url = new URL(window.location.pathname, canonicalOrigin).href;
    const image = new URL(`${import.meta.env.BASE_URL}og-image.jpg`, canonicalOrigin).href;
    const keywords = [...new Set([...(options?.keywords ?? []), ...defaultKeywords])].join(', ');

    document.title = fullTitle;
    setMeta('name', 'description', description);
    setMeta('name', 'keywords', keywords);
    setMeta('name', 'robots', options?.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1');
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', image);
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', image);
    setLink('canonical', url);
    setLink('alternate', url, 'nl-NL');
  }, [title, description, options?.noindex, options?.keywords]);
}
