import { type InputHTMLAttributes, type ReactNode, useState } from "react";
import { Link } from "react-router-dom";

export interface AuthLink {
  to: string;
  label: string;
}

interface AuthLayoutProps {
  brandRole: string;
  title: string;
  subtitle: string;
  links: AuthLink[];
  children: ReactNode;
}

/** Page chrome shared by every merchant/driver auth screen: brand mark, card,
 *  and the footer links to neighbouring screens. */
export const AuthLayout = ({
  brandRole,
  title,
  subtitle,
  links,
  children,
}: AuthLayoutProps) => (
  <section className='flex min-h-[100dvh] items-center justify-center bg-[var(--lm-page)] px-4 py-8'>
    <div className='w-full max-w-md'>
      <h1 className='mb-6 text-center text-lg font-black tracking-tight text-[var(--lm-brand-ink)]'>
        Local Mart <span className='text-[var(--lm-brand)]'>{brandRole}</span>
      </h1>
      <div className='rounded-xl border border-[var(--lm-line)] bg-[var(--lm-surface)] p-6 shadow-sm'>
        <h2 className='text-xl font-semibold text-[var(--lm-brand-ink)]'>
          {title}
        </h2>
        <p className='mb-5 mt-1 text-sm text-[var(--lm-muted)]'>{subtitle}</p>
        {children}
      </div>
      <div className='mt-4 flex flex-col gap-2 text-sm'>
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className='text-[var(--lm-brand)] underline'
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  </section>
);

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

export const TextField = ({ label, id, type, ...rest }: TextFieldProps) => {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  return (
    <div className='space-y-1.5'>
      <label htmlFor={id} className='text-sm text-[var(--lm-brand-ink)]'>
        {label}
      </label>
      <div className='relative'>
        <input
          id={id}
          type={isPassword && visible ? "text" : type}
          className='w-full rounded-md border border-[var(--lm-line)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--lm-brand)]'
          {...rest}
        />
        {isPassword && (
          <button
            type='button'
            tabIndex={-1}
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            className='absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[var(--lm-muted)]'
          >
            {visible ? "Hide" : "Show"}
          </button>
        )}
      </div>
    </div>
  );
};

export const ErrorBanner = ({ message }: { message: string }) => (
  <div
    role='alert'
    className='rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700'
  >
    {message}
  </div>
);

export const SubmitButton = ({
  loading,
  idle,
  busy,
}: {
  loading: boolean;
  idle: string;
  busy: string;
}) => (
  <button
    type='submit'
    disabled={loading}
    className='w-full rounded-md bg-[var(--lm-brand)] py-2 text-sm font-medium text-white hover:bg-[var(--lm-brand-deep)] disabled:opacity-60'
  >
    {loading ? busy : idle}
  </button>
);
