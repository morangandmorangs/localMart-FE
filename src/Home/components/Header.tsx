import { useEffect, useRef, useState } from 'react';
import {
  CartIcon,
  CloseIcon,
  GridIcon,
  MenuIcon,
  OrdersIcon,
  ProfileIcon,
  SearchIcon,
  StorefrontIcon,
  SupportIcon,
} from './Icons';

const NAV = [
  { href: '/browse', label: 'Browse', Icon: GridIcon },
  { href: '/search', label: 'Search', Icon: SearchIcon },
  { href: '/orders', label: 'Orders', Icon: OrdersIcon },
  { href: '/support', label: 'Support', Icon: SupportIcon },
  { href: '/account', label: 'Customer profile', Icon: ProfileIcon },
];

export function Header({ cartCount = 0 }: { cartCount?: number }) {
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Close the mobile menu on Escape and return focus to its trigger.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="lm-header">
      <div className="lm-header__strip" aria-hidden="true" />

      <div className="lm-header__bar">
        <a className="lm-logo" href="/" aria-label="Local Mart — home">
          <StorefrontIcon className="lm-logo__icon" />
          <span className="lm-logo__text">Local Mart</span>
        </a>

        <nav className="lm-nav" aria-label="Main">
          <ul className="lm-nav__list">
            {NAV.map(({ href, label, Icon }) => (
              <li key={href}>
                <a className="lm-nav__link" href={href}>
                  <Icon className="lm-nav__icon" />
                  <span>{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lm-header__right">
          <a
            className="lm-nav__link lm-nav__link--cart"
            href="/cart"
            aria-label={`Cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
          >
            <span className="lm-cart">
              <CartIcon className="lm-nav__icon" />
              {cartCount > 0 && (
                <span className="lm-cart__count" aria-hidden="true">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </span>
            <span className="lm-nav__cart-label">Cart</span>
          </a>

          <button
            ref={menuButtonRef}
            type="button"
            className="lm-menu-toggle"
            aria-expanded={open}
            aria-controls="lm-mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <div
        id="lm-mobile-menu"
        className="lm-mobile-menu"
        hidden={!open}
      >
        <ul>
          {NAV.map(({ href, label, Icon }) => (
            <li key={href}>
              <a href={href}>
                <Icon className="lm-nav__icon" />
                <span>{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
