import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';
import { AlertCircle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const controlBase =
  'w-full rounded-xl border bg-white px-4 text-[16px] text-ink placeholder:text-stone/60 transition-[border-color,box-shadow] outline-none focus:border-brand focus:ring-4 focus:ring-brand/10';

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 flex items-center gap-1.5 text-sm font-medium text-brand">
      <AlertCircle className="size-4 shrink-0" /> {message}
    </p>
  );
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  icon?: LucideIcon;
  hint?: string;
  error?: string;
  optional?: boolean;
}

export function TextField({ id, label, icon: Icon, hint, error, optional, className, ...props }: TextFieldProps) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between text-sm font-semibold text-ink">
        {label}
        {optional && <span className="text-xs font-normal text-stone">Optioneel</span>}
      </label>
      <div className="relative">
        {Icon && <Icon aria-hidden className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-stone/70" />}
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(controlBase, 'h-[52px]', Icon && 'pl-11', error ? 'border-brand' : 'border-line hover:border-stone/40')}
          {...props}
        />
      </div>
      {hint && !error && <p id={`${id}-hint`} className="mt-2 text-sm text-stone">{hint}</p>}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label: string;
  error?: string;
  footer?: ReactNode;
}

export function TextArea({ id, label, error, footer, ...props }: TextAreaProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-ink">{label}</label>
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : `${id}-footer`}
        className={cn(controlBase, 'min-h-[150px] resize-y py-3.5 leading-relaxed', error ? 'border-brand' : 'border-line hover:border-stone/40')}
        {...props}
      />
      {footer && !error && <div id={`${id}-footer`} className="mt-2 text-sm text-stone">{footer}</div>}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

/** Groep van keuzerondjes, gestyled als 'pills'. Native radios voor toetsenbord en screenreaders. */
export function PillGroup<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
  error,
  optional,
}: {
  name: string;
  legend: string;
  options: { value: T; label: string }[];
  value: string;
  onChange: (value: T) => void;
  error?: string;
  optional?: boolean;
}) {
  return (
    <fieldset aria-describedby={error ? `${name}-error` : undefined}>
      <legend className="mb-3 flex w-full items-baseline justify-between text-sm font-semibold text-ink">
        {legend}
        {optional && <span className="text-xs font-normal text-stone">Optioneel</span>}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const checked = value === option.value;
          return (
            <label
              key={option.value}
              className={cn(
                'relative inline-flex min-h-11 cursor-pointer select-none items-center gap-2 rounded-full border px-4 text-[0.95rem] font-medium transition-all',
                'has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand/20',
                checked ? 'border-brand bg-brand text-white shadow-[0_6px_16px_-8px_rgb(169_15_20/0.8)]' : 'border-line bg-white text-ink hover:border-stone/50',
              )}
            >
              <input type="radio" name={name} value={option.value} checked={checked} onChange={() => onChange(option.value)} className="sr-only" />
              {checked && <Check className="size-4" />}
              {option.label}
            </label>
          );
        })}
      </div>
      <FieldError id={`${name}-error`} message={error} />
    </fieldset>
  );
}
