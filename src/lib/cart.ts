import { PRESCRIPTION_UPLOAD_PATH } from './catalog/categories';

export interface CartCandidate {
  productId: string;
  name: string;
  /** Set by the catalogue/server. Rx items never go straight to the cart. */
  requiresPrescription?: boolean;
}

export type CartAction =
  | { kind: 'add'; label: 'Add to cart' }
  | { kind: 'prescription'; label: 'Upload prescription'; href: string };

/**
 * The medicine rule, in one place.
 *
 * An item flagged `requiresPrescription` can never be added to the cart
 * directly — its CTA routes to the prescription upload flow so a pharmacist
 * can verify first. Every Add-to-cart surface must go through this.
 */
export function resolveCartAction(item: CartCandidate): CartAction {
  if (item.requiresPrescription) {
    return {
      kind: 'prescription',
      label: 'Upload prescription',
      href: PRESCRIPTION_UPLOAD_PATH,
    };
  }
  return { kind: 'add', label: 'Add to cart' };
}

export function canAddToCart(item: CartCandidate): boolean {
  return resolveCartAction(item).kind === 'add';
}

/** Filters an Rx item out of any bulk add. Returns only what may be carted. */
export function selectCartableItems<T extends CartCandidate>(items: T[]): T[] {
  return items.filter(canAddToCart);
}
