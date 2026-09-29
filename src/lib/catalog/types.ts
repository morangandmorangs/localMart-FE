/** Visual family a surface belongs to. Every family also carries a text tag,
 *  so the three are never distinguished by colour alone. */
export type Family = 'product' | 'ai' | 'plan' | 'rx';

export type IconName =
  | 'leaf'
  | 'basket'
  | 'bowl'
  | 'pill'
  | 'sparkle'
  | 'calendar'
  | 'gift'
  | 'wallet';

export interface SubCategory {
  /** URL segment — resolves to /category/[slug]/[sub] */
  slug: string;
  label: string;
  /** Rx items cannot be added to the cart directly. */
  requiresPrescription?: boolean;
}

export interface Category {
  slug: string;
  title: string;
  subtitle: string;
  /** Short label shown on the hero quick-tile. */
  tileLabel: string;
  icon: IconName;
  family: Extract<Family, 'product' | 'rx'>;
  cta: string;
  subCategories: SubCategory[];
  /** Regulatory notice, rendered on strict categories only. */
  notice?: string;
}

export interface FestiveKit {
  slug: string;
  /** Month band shown above the kit name, e.g. "JANUARY". */
  period: string;
  name: string;
  contents: string;
}
