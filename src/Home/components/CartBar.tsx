import { useCartDraft } from '../../lib/useCartDraft';
import { CartIcon } from './Icons';

/** Floating cart indicator. Sits bottom-right on category pages, in the
 *  same slot SupportBot uses on the homepage — only ever one or the other
 *  is on screen, so there is no visual collision. Hidden until the cart
 *  has something in it. */
export function CartBar() {
  const { totalItems } = useCartDraft();

  if (totalItems === 0) return null;

  return (
    <a className="lm-cartbar" href="/cart">
      <CartIcon className="lm-cartbar__icon" />
      <span>Cart · {totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
    </a>
  );
}
