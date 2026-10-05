import { useEffect } from 'react';
import { company } from '@/config/site';

const defaultDescription =
  'Stukadoorswerk, schilderwerk, tegelwerk, laminaat leggen en tuinwerk in heel Nederland. Vraag vrijblijvend een offerte aan bij Alaina Bouw Klusbedrijf.';

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let meta = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, key);
    document.head.appendChild(meta);
  }
  meta.content = content;
}

/** Werkt titel, beschrijving, social-tags en canonical-URL bij per pagina. */
export function usePageMeta(title: string | null, description = defaultDescription) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${company.legalName}` : `${company.legalName} | ${company.tagline}`;
    const url = new URL(window.location.pathname, window.location.origin).href;
    const image = new URL(`${import.meta.env.BASE_URL}og-image.jpg`, window.location.origin).href;

    document.title = fullTitle;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', image);
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', image);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [title, description]);
}
