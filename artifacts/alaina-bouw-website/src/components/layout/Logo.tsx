import { Link } from 'wouter';
import mark from '@/assets/logo-mark.png';
import markWhite from '@/assets/logo-mark-white.png';
import { cn } from '@/lib/utils';

export function Logo({ variant = 'dark', className }: { variant?: 'dark' | 'light'; className?: string }) {
  const light = variant === 'light';
  return (
    <Link href="/" aria-label="Alaina Bouw Klusbedrijf, naar de homepage" className={cn('flex items-center gap-3 no-underline', className)}>
      <img src={light ? markWhite : mark} alt="" width={48} height={40} className="h-10 w-auto shrink-0" />
      <span className="flex flex-col leading-none">
        <span className={cn('font-serif text-[1.15rem] font-medium tracking-[0.08em]', light ? 'text-white' : 'text-brand')}>ALAINA BOUW</span>
        <span className={cn('mt-1.5 text-[0.6rem] font-semibold tracking-[0.32em]', light ? 'text-white/60' : 'text-stone')}>KLUSBEDRIJF</span>
      </span>
    </Link>
  );
}
