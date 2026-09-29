import type { ReactNode } from 'react';

type Tone = 'neutral' | 'ai' | 'plan' | 'rx' | 'mint';

/** The text tag that rides alongside every colour-coded surface, so AI /
 *  Plan / Rx are never told apart by colour alone. */
export function Tag({
  tone = 'neutral',
  children,
}: {
  tone?: Tone;
  children: ReactNode;
}) {
  return <span className={`lm-tag lm-tag--${tone}`}>{children}</span>;
}
