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
  /** Cover photo for the category card. Sourced from the internet (Pexels). */
  image: string;
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

/** One sellable size of a product sold by weight or count. */
export interface ProductVariant {
  /** Stable within a product, e.g. "500g", "whole". */
  id: string;
  /** What the shopper picks, e.g. "500 g, cut". */
  label: string;
  price: number;
  stockCount: number;
}

export interface Product {
  id: string;
  name: string;
  /** Path to the product photo. Placeholders live in /public/mock. */
  image: string;
  /** Which SubCategory.slug this sits under. */
  subCategory: string;
  /** Sizes, for anything sold by weight. Mutually exclusive with price. */
  variants?: ProductVariant[];
  /** Fixed-pack price. Only when there are no variants. */
  price?: number;
  /** Fixed-pack stock. Only when there are no variants. */
  stockCount?: number;
  /** Pack description for a fixed pack, e.g. "5 kg bag". */
  pack?: string;
  /** Provenance line for fresh produce, e.g. "Brahmaputra catch". */
  origin?: string;
  /** What an OTC medicine treats. Shown so nobody guesses. */
  useFor?: string;
  /** Rx items never go straight to the cart — see lib/cart.ts. */
  requiresPrescription?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  /** Short descriptor, e.g. "Assamese thali · Home-style". */
  cuisine: string;
  rating: number;
  ratingCount: number;
  /** Typical kitchen time in minutes, before delivery. */
  prepMinutes: number;
  priceForTwo: number;
  isOpen: boolean;
  signatureDishes: string[];
}
