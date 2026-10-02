import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { Logo } from "../../Common/Logo/Logo";
import { CloseIcon, MenuIcon, ProfileIcon } from "./Icons";
import { LocationPicker } from "./LocationPicker";
import { SearchBar } from "./SearchBar";
import { ScheduleDelivery } from "./ScheduleDelivery";

const NAV = [{ href: "/account", label: "Account", Icon: ProfileIcon }];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pinned, setPinned] = useState(true);
  const [scheduleOpen, setScheduleOpen] = useState(false);
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

  // An open mobile menu or schedule panel rides inside the bar, so it holds
  // the bar in place.
  const shown = pinned || open || scheduleOpen;

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
        <Logo to='/' />

        <div className='lm-header__controls'>
          {!isMobile && <LocationPicker />}
          <SearchBar />
        </div>

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
          <ScheduleDelivery onOpenChange={setScheduleOpen} />
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

// Hide the support bot on the hero section and show
// it on /signin?redirect=/checkout and /checkout
// Instead show
// in mobile view, take the        <LocationPicker /> in the header
// and move it to the top of the mobile menu, above the nav links.
// and in desktop view, keep it in the header as is.
// Create a new search bottom in home page, onClick search and Mic Button should
// appear in the search bar, and the search bar should be sticky on scroll.
