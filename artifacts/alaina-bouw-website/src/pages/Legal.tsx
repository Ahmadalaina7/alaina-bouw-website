import type { ReactNode } from 'react';
import { Link } from 'wouter';
import { PageHero } from '@/components/ui';
import { company, emailHref } from '@/config/site';
import { usePageMeta } from '@/lib/seo';

function ContactLine() {
  return emailHref ? (
    <>
      per e-mail via <a href={emailHref} className="font-semibold text-brand">{company.email}</a> of via het{' '}
      <Link href="/contact" className="font-semibold text-brand">contactformulier</Link>
    </>
  ) : (
    <>
      via het <Link href="/contact" className="font-semibold text-brand">contactformulier</Link>
    </>
  );
}

function LegalLayout({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} text={intro} />
      <section className="section !pt-12">
        <div className="container-x">
          <article className="prose-legal mx-auto max-w-3xl">{children}</article>
        </div>
      </section>
    </>
  );
}

export function PrivacyPage() {
  usePageMeta('Privacyverklaring', `Lees hoe ${company.legalName} omgaat met uw persoonsgegevens.`);
  return (
    <LegalLayout eyebrow="Privacy" title="Privacyverklaring" intro={`${company.legalName} gaat zorgvuldig om met uw persoonsgegevens. Hieronder leest u welke gegevens we verwerken en waarom.`}>
      <h2>Wie is verantwoordelijk?</h2>
      <p>
        {company.legalName}
        {company.address && <>, {company.address}</>}
        {company.kvk && <> (KvK {company.kvk})</>} is verantwoordelijk voor de verwerking van persoonsgegevens via deze website.
      </p>
      <h2>Welke gegevens verwerken we?</h2>
      <p>Wanneer u het aanvraagformulier invult, verwerken we de gegevens die u zelf opgeeft:</p>
      <ul>
        <li>Naam, telefoonnummer en e-mailadres</li>
        <li>Plaats en eventueel postcode van het project</li>
        <li>Omschrijving van de klus, gewenste planning en eventuele budgetindicatie</li>
        <li>Uw voorkeur voor de manier van contact</li>
      </ul>
      <p>Vermeld in de omschrijving geen bijzondere of onnodige persoonsgegevens.</p>
      <h2>Waarvoor gebruiken we uw gegevens?</h2>
      <p>We gebruiken uw gegevens uitsluitend om uw aanvraag te behandelen, contact met u op te nemen en u een passend voorstel te doen. De grondslag hiervoor is uw toestemming en het nemen van stappen op uw verzoek voorafgaand aan een eventuele overeenkomst.</p>
      <h2>Hoe lang bewaren we uw gegevens?</h2>
      <p>We bewaren uw gegevens niet langer dan nodig is voor het doel waarvoor ze zijn verzameld, of zolang de wet dat vereist.</p>
      <h2>Delen met derden</h2>
      <p>We verkopen uw gegevens niet. We delen ze alleen met partijen die ons helpen deze website en het formulier technisch te laten werken, en alleen voor zover dat nodig is.</p>
      <h2>Uw rechten</h2>
      <p>U heeft het recht om uw gegevens in te zien, te laten corrigeren of te laten verwijderen, en om uw toestemming in te trekken. Neem hiervoor contact met ons op <ContactLine />. U kunt ook een klacht indienen bij de Autoriteit Persoonsgegevens.</p>
    </LegalLayout>
  );
}

export function CookiesPage() {
  usePageMeta('Cookiebeleid', `Informatie over het gebruik van cookies op de website van ${company.legalName}.`);
  return (
    <LegalLayout eyebrow="Cookies" title="Cookiebeleid" intro="Deze website gebruikt alleen wat nodig is om goed te werken.">
      <h2>Functionele opslag</h2>
      <p>Om het aanvraagformulier gebruiksvriendelijk te maken, onthoudt uw browser tijdelijk wat u heeft ingevuld zolang het tabblad openstaat. Deze gegevens blijven op uw eigen apparaat en worden verwijderd wanneer u het tabblad sluit of de aanvraag verstuurt.</p>
      <h2>Analytische en marketingcookies</h2>
      <p>Op dit moment plaatsen we geen analytische cookies, advertentiecookies of tracking van derden. Als dat verandert, passen we dit beleid aan en vragen we waar nodig vooraf om uw toestemming.</p>
      <h2>Externe lettertypen</h2>
      <p>Voor de weergave van de lettertypen maakt deze website gebruik van Google Fonts. Daarbij wordt uw IP-adres gedeeld met Google om de lettertypen te laden.</p>
      <h2>Vragen</h2>
      <p>Heeft u vragen over dit cookiebeleid? Neem dan contact met ons op <ContactLine />.</p>
    </LegalLayout>
  );
}

export function TermsPage() {
  usePageMeta('Algemene voorwaarden', `Algemene voorwaarden van ${company.legalName}.`);
  return (
    <LegalLayout eyebrow="Voorwaarden" title="Algemene voorwaarden" intro="Duidelijke afspraken zorgen voor een prettige samenwerking.">
      <h2>Offertes en opdrachten</h2>
      <p>De afspraken over prijs, planning, uitvoering en betaling leggen we per opdracht vast in de offerte. Een aanvraag via deze website is vrijblijvend en verplicht u tot niets.</p>
      <h2>Opvragen van de voorwaarden</h2>
      <p>Wilt u de volledige algemene voorwaarden ontvangen? Neem dan contact met ons op <ContactLine />. We sturen ze u graag toe.</p>
    </LegalLayout>
  );
}
