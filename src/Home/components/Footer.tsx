const LINKS = [
  { href: '/about', label: 'About' },
  { href: '/sell', label: 'Sell on Local Mart' },
  { href: '/help', label: 'Help' },
  { href: '/terms', label: 'Terms' },
];

export function Footer() {
  return (
    <footer className="lm-footer">
      <p className="lm-footer__mark">Local Mart · Numaligarh, Assam</p>
      <nav aria-label="Footer">
        <ul className="lm-footer__links">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
}
