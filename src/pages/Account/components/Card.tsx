import type { ReactNode } from "react";

/** The one surface every account mini component sits on. */
export const Card = ({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) => (
  <section className='rounded-xl border border-(--lm-line) bg-(--lm-surface) p-5 shadow-sm'>
    {title && (
      <h2 className='mb-3 text-sm font-semibold tracking-wide text-(--lm-muted) uppercase'>
        {title}
      </h2>
    )}
    {children}
  </section>
);
