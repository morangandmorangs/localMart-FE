import { useEffect, useRef, useState } from "react";
import {
  CartIcon,
  CloseIcon,
  GridIcon,
  MenuIcon,
  OrdersIcon,
  ProfileIcon,
  SearchIcon,
  StorefrontIcon,
} from "./Icons";

const NAV = [
  { href: "/browse", label: "Browse", Icon: GridIcon },
  { href: "/search", label: "Search", Icon: SearchIcon },
  { href: "/orders", label: "Orders", Icon: OrdersIcon },
  { href: "/account", label: "Customer profile", Icon: ProfileIcon },
];

export function Header({ cartCount = 0 }: { cartCount?: number }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pinned, setPinned] = useState(true);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 20);
        // Sub-6px moves are jitter and iOS rubber-banding, not intent.
        if (Math.abs(y - lastY) > 6 || y < 10) {
          setPinned(y < lastY || y < 10);
          lastY = y;
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on Escape and return focus to its trigger.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // An open mobile menu rides inside the bar, so it holds the bar in place.
  const shown = pinned || open;

  return (
    <header
      className={[
        "lm-header",
        scrolled ? "lm-header--scrolled" : "",
        shown ? "" : "lm-header--hidden",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className='lm-header__strip' aria-hidden='true' />

      <div className='lm-header__bar'>
        <a className='lm-logo' href='/' aria-label='Local Mart — home'>
          <StorefrontIcon className='lm-logo__icon' />
          <span className='lm-logo__text'>Local Mart</span>
        </a>

        <nav className='lm-nav' aria-label='Main'>
          <ul className='lm-nav__list'>
            {NAV.map(({ href, label, Icon }) => (
              <li key={href}>
                <a className='lm-nav__link' href={href}>
                  <Icon className='lm-nav__icon' />
                  <span>{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className='lm-header__right'>
          <a
            className='lm-nav__link lm-nav__link--cart'
            href='/cart'
            aria-label={`Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
          >
            <span className='lm-cart'>
              <CartIcon className='lm-nav__icon' />
              {cartCount > 0 && (
                <span className='lm-cart__count' aria-hidden='true'>
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </span>
            <span className='lm-nav__cart-label'>Cart</span>
          </a>

          <button
            ref={menuButtonRef}
            type='button'
            className='lm-menu-toggle'
            aria-expanded={open}
            aria-controls='lm-mobile-menu'
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <div id='lm-mobile-menu' className='lm-mobile-menu' hidden={!open}>
        <ul>
          {NAV.map(({ href, label, Icon }) => (
            <li key={href}>
              <a href={href}>
                <Icon className='lm-nav__icon' />
                <span>{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
