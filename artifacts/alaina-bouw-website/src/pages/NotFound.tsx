import { ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { usePageMeta } from '@/lib/seo';

export default function NotFound() {
  usePageMeta('Pagina niet gevonden', 'Deze pagina bestaat niet of is verplaatst.', { noindex: true });
  return (
    <section className="container-x grid min-h-[65vh] place-items-center py-20 text-center">
      <div>
        <p className="font-serif text-8xl text-brand/20 sm:text-9xl">404</p>
        <h1 className="mt-2 text-4xl sm:text-5xl">Deze pagina bestaat niet.</h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-stone">De pagina die u zoekt is verplaatst of bestaat niet meer.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn btn-primary">Naar de homepage <ArrowRight className="size-4" /></Link>
          <Link href="/diensten" className="btn btn-outline">Bekijk diensten</Link>
        </div>
      </div>
    </section>
  );
}
