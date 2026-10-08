import type { LucideIcon } from 'lucide-react';
import { Grid3x3, Hammer, Layers, PaintRoller, Rows3, Sprout } from 'lucide-react';

/**
 * Centrale bedrijfsgegevens.
 *
 * Lege contact- en bedrijfsvelden worden automatisch verborgen op de website, dus er
 * verschijnt nooit een lege knop of placeholder.
 */
export const company = {
  name: 'Alaina Bouw',
  legalName: 'Alaina Bouw Klusbedrijf',
  tagline: 'Vakwerk in en om uw woning',
  area: 'Heel Nederland',
  areaLower: 'heel Nederland',
  /** Bijv. '+31 6 12345678' */
  phone: '',
  /** Internationaal formaat zonder + of spaties, bijv. '31612345678' */
  whatsapp: '+31685516357',
  email: 'info@alainabouw.nl',
  address: '',
  kvk: '42177751',
  btw: 'NL005556959B60',
};

export const phoneHref = company.phone ? `tel:${company.phone.replace(/[^\d+]/g, '')}` : '';
export const whatsappHref = company.whatsapp ? `https://wa.me/${company.whatsapp.replace(/\D/g, '')}` : '';
export const emailHref = company.email ? `mailto:${company.email}` : '';

const photoBase = `${import.meta.env.BASE_URL}project-photos/`;

export type PhotoCategory = 'badkamer' | 'keuken' | 'vloeren' | 'wanden' | 'interieur' | 'tuin';

export const photoCategories: { id: PhotoCategory; label: string }[] = [
  { id: 'badkamer', label: 'Badkamers' },
  { id: 'keuken', label: 'Keukens' },
  { id: 'vloeren', label: 'Vloeren' },
  { id: 'wanden', label: 'Wanden & plafonds' },
  { id: 'interieur', label: 'Interieur' },
  { id: 'tuin', label: 'Tuin & bestrating' },
];

export interface ProjectPhoto {
  src: string;
  alt: string;
  caption: string;
  category: PhotoCategory;
  width: number;
  height: number;
}

const photo = (
  n: number,
  caption: string,
  alt: string,
  category: PhotoCategory,
  width = 1000,
  height = 1333,
): ProjectPhoto => ({
  src: `${photoBase}project-${String(n).padStart(2, '0')}.jpg`,
  caption,
  alt,
  category,
  width,
  height,
});

export const projectPhotos: ProjectPhoto[] = [
  photo(15, 'Badkamer met ligbad', 'Afgewerkte badkamer met ligbad, toilet en tegelwerk.', 'badkamer', 788, 1400),
  photo(6, 'Visgraatvloer op tegelvloer', 'Aansluiting tussen een tegelvloer en een visgraatvloer.', 'vloeren'),
  photo(14, 'Keuken met kookeiland', 'Keuken met kookeiland tijdens de afronding.', 'keuken', 788, 1400),
  photo(10, 'Trap en maatwerk', 'Trap met groene afwerking en geïntegreerde opbergruimte.', 'interieur', 788, 1400),
  photo(13, 'Badkamer met douche', 'Badkamer met douche, toilet en wastafel.', 'badkamer', 788, 1400),
  photo(11, 'Vloer leggen in de woonkamer', 'Vloerwerk in een woonkamer tijdens een project.', 'vloeren'),
  photo(3, 'Stucwerk aan plafond en wand', 'Werkzaamheden aan plafond en wand in een ruimte in aanbouw.', 'wanden'),
  photo(7, 'Keuken tijdens werkzaamheden', 'Keuken met kookeiland tijdens werkzaamheden.', 'keuken'),
  photo(8, 'Badkamer in verbouwing', 'Badkamer in verbouwing met een bad en wandtegels.', 'badkamer'),
  photo(4, 'Wandafwerking bij een raam', 'Wandafwerking rond een raam in een ruimte in aanbouw.', 'wanden'),
  photo(12, 'Gang tijdens de afbouw', 'Gang tijdens de afbouw, gezien vanuit de deuropening.', 'wanden', 788, 1400),
  photo(5, 'Detail van vloerwerk', 'Vloerdetail met plaatsingsmateriaal bij een deuropening.', 'vloeren'),
  photo(1, 'Woonruimte in uitvoering', 'Woonruimte met een centraal bouwdeel en afgedekte vloer tijdens werkzaamheden.', 'interieur'),
  photo(2, 'Vloer in voorbereiding', 'Vloer in voorbereiding tijdens een verbouwing.', 'vloeren', 788, 1400),
  photo(9, 'Badkamer in opbouw', 'Badkamerwand tijdens werkzaamheden.', 'badkamer', 788, 1400),
  photo(16, 'Terras met grote tuintegels', 'Afgewerkt tuinterras met grote tegels, plantenborder en houten schutting.', 'tuin', 720, 1344),
  photo(17, 'Terras opnieuw bestraat', 'Terras met lichte klinkers en een zithoek in de tuin.', 'tuin', 720, 1020),
  photo(18, 'Tuin voorbereiden voor bestrating', 'Zandbed en kruiwagen tijdens de voorbereiding van een tuinproject.', 'tuin', 768, 400),
  photo(19, 'Nieuw gazon in de achtertuin', 'Werk aan een nieuw gazon naast het terras van een woning.', 'tuin', 768, 500),
  photo(20, 'Nieuwe vloer in de woonkamer', 'Lichte houtlookvloer in een gerenoveerde woonkamer.', 'vloeren', 768, 1021),
];

export const photoBySrcNumber = (n: number) =>
  projectPhotos.find((p) => p.src.endsWith(`project-${String(n).padStart(2, '0')}.jpg`))!;

export interface Service {
  slug: string;
  title: string;
  short: string;
  intro: string;
  icon: LucideIcon;
  image?: ProjectPhoto;
  examples: string[];
  requestHint: string;
}

export const services: Service[] = [
  {
    slug: 'stukadoorswerk',
    title: 'Stukadoorswerk',
    short: 'Strakke wanden en plafonds, klaar voor de afwerking.',
    intro:
      'Een strak gestuukte wand of plafond is de basis van elke mooie ruimte. Vertel ons welke wanden of plafonds u wilt laten aanpakken en welke afwerking u voor ogen heeft.',
    icon: Layers,
    image: photoBySrcNumber(3),
    examples: ['Wanden en plafonds stucen', 'Reparatie van scheuren en beschadigingen', 'Voorbereiding op schilder- of behangwerk', 'Afwerking in overleg'],
    requestHint: 'Beschrijf welke wanden of plafonds u wilt laten stukadoren en welke afwerking u wenst.',
  },
  {
    slug: 'schilderwerk',
    title: 'Schilderwerk',
    short: 'Binnen- en buitenschilderwerk met oog voor detail.',
    intro:
      'Een frisse kleur verandert een hele ruimte. Laat weten welke ruimtes of onderdelen u wilt laten schilderen, dan stemmen we de mogelijkheden met u af.',
    icon: PaintRoller,
    image: photoBySrcNumber(10),
    examples: ['Wanden en plafonds', 'Kozijnen, deuren en trappen', 'Binnen- en buitenschilderwerk', 'Advies over voorbereiding'],
    requestHint: 'Beschrijf welke ruimtes of onderdelen u wilt laten schilderen.',
  },
  {
    slug: 'tegelwerk',
    title: 'Tegelwerk',
    short: 'Vloer- en wandtegels voor badkamer, keuken en meer.',
    intro:
      'Van badkamer tot keuken: tegelwerk vraagt om precisie. Beschrijf de ruimte, het formaat tegels en uw wensen, dan kijken we samen naar de aanpak.',
    icon: Grid3x3,
    image: photoBySrcNumber(15),
    examples: ['Badkamers en toiletten', 'Keukenwanden', 'Vloertegels', 'Aansluitingen en details'],
    requestHint: 'Beschrijf waar u tegels wilt laten plaatsen en wat uw wensen zijn.',
  },
  {
    slug: 'laminaat-leggen',
    title: 'Laminaat leggen',
    short: 'Een nieuwe vloer, netjes gelegd en afgewerkt.',
    intro:
      'Een nieuwe vloer geeft uw woning direct een ander gevoel. Vertel om welke ruimtes het gaat en welk patroon u wilt, bijvoorbeeld recht of visgraat.',
    icon: Rows3,
    image: photoBySrcNumber(20),
    examples: ['Laminaat in woonkamer en slaapkamers', 'Rechte en visgraatpatronen', 'Overgangen naar andere vloeren', 'Plinten en afwerking'],
    requestHint: 'Beschrijf in welke ruimtes u laminaat wilt laten leggen en hoeveel m² het ongeveer is.',
  },
  {
    slug: 'tuinwerk',
    title: 'Tuinwerk',
    short: 'Tuinieren en werkzaamheden in en rond de tuin.',
    intro:
      'Wilt u uw tuin laten opknappen of onderhouden? Vertel wat u in de tuin wilt aanpakken of veranderen, dan bespreken we wat mogelijk is.',
    icon: Sprout,
    image: photoBySrcNumber(16),
    examples: ['Tuinonderhoud', 'Opknappen van de tuin', 'Snoeien en opruimen', 'Kleine aanpassingen in de tuin'],
    requestHint: 'Beschrijf welk tuinwerk u wilt laten uitvoeren en wat u belangrijk vindt.',
  },
];

export const otherService = { slug: 'anders', title: 'Overige klus', icon: Hammer };

export const navItems: { label: string; href: string }[] = [
  { label: 'Diensten', href: '/diensten' },
  { label: 'Projecten', href: '/projecten' },
  { label: 'Werkwijze', href: '/werkwijze' },
  { label: 'Over ons', href: '/over-ons' },
  { label: 'Contact', href: '/contact' },
];

export const processSteps = [
  { title: 'Aanvraag', text: 'U beschrijft uw klus via het formulier. Dat duurt maar een paar minuten.' },
  { title: 'Kennismaking', text: 'We nemen contact met u op om uw wensen, de ruimte en de planning door te nemen.' },
  { title: 'Offerte', text: 'U ontvangt een duidelijke offerte, zodat u precies weet waar u aan toe bent.' },
  { title: 'Uitvoering', text: 'Na akkoord plannen we het werk in en voeren we het zorgvuldig uit.' },
];
