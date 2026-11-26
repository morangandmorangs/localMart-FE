import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { GET_APP_PATH } from "../../config/apps";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { Logo } from "../../Common/Logo/Logo";
import { CalendarIcon, CartIcon, CloseIcon, MenuIcon, PhoneIcon } from "./Icons";
import { LocationPicker } from "./LocationPicker";
import { SearchBar } from "./SearchBar";

// No sign-in on the site: the cart, the schedule and this link all lead to
// the page that sends shoppers to the Local Mart app.
const NAV = [{ href: GET_APP_PATH, label: "Get the app", Icon: PhoneIcon }];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pinned, setPinned] = useState(true);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  // Same breakpoint as the 768px block in Home.css where the nav collapses.
  const isMobile = useMediaQuery("(max-width: 768px)");

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
      <div className='lm-header__bar'>
        <Logo to='/' />

        <div className='lm-header__controls'>
          {!isMobile && <LocationPicker />}
          <SearchBar />
        </div>

        <Link
          className='lm-nav__link lm-cart'
          to={GET_APP_PATH}
          aria-label='Cart: order in the Local Mart app'
        >
          <CartIcon className='lm-nav__icon' />
        </Link>

        <nav className='lm-nav' aria-label='Main'>
          <ul className='lm-nav__list'>
            {NAV.map(({ href, label, Icon }) => (
              <li key={href}>
                <Link className='lm-nav__link' to={href} aria-label={label}>
                  <Icon className='lm-nav__icon' />
                  <span className='lm-nav__label'>{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className='lm-header__right'>
          <Link
            className='lm-schedule-chip'
            to={GET_APP_PATH}
            aria-label='Schedule deliveries in the Local Mart app'
          >
            <CalendarIcon className='lm-nav__icon' />
            <span className='lm-schedule-chip__label'>Schedule</span>
          </Link>
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
        {isMobile && (
          <div className='lm-mobile-menu__location'>
            <LocationPicker />
          </div>
        )}
        <ul>
          {NAV.map(({ href, label, Icon }) => (
            <li key={href}>
              <Link to={href} onClick={() => setOpen(false)}>
                <Icon className='lm-nav__icon' />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
