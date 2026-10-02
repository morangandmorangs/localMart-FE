import type { ComponentType, SVGProps } from 'react';
import type { IconName } from '../../lib/catalog/types';

type IconProps = SVGProps<SVGSVGElement>;

/** All icons are inline SVG on a 24x24 grid, stroke-based, currentColor.
 *  No icon library, no emoji. */
const base = {
  viewBox: '0 0 24 24',
  width: 24,
  height: 24,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
};

export const StorefrontIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M3.5 9.5V19a1 1 0 0 0 1 1h15a1 1 0 0 0 1-1V9.5" />
    <path d="M3 6.5 4.2 4h15.6L21 6.5a2.6 2.6 0 0 1-4.5 2 2.6 2.6 0 0 1-4.5 0 2.6 2.6 0 0 1-4.5 0A2.6 2.6 0 0 1 3 6.5Z" />
  </svg>
);

export const GridIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="4" y="4" width="6.5" height="6.5" rx="1.4" />
    <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.4" />
    <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.4" />
    <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.4" />
  </svg>
);

export const SearchIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4 4" />
  </svg>
);

export const CartIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 7h16l-1.4 9.2a2 2 0 0 1-2 1.7H7.4a2 2 0 0 1-2-1.7L4 7Z" />
    <path d="M9 7V5.5a3 3 0 0 1 6 0V7" />
  </svg>
);

export const OrdersIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M6 3h9l4 4v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
    <path d="M14 3v4h5M8.5 12.5h7M8.5 16h4.5" />
  </svg>
);

export const SupportIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M9.8 9.4a2.3 2.3 0 1 1 3 2.2c-.5.2-.8.7-.8 1.2v.4" />
    <path d="M12 16.6h.01" />
  </svg>
);

export const ProfileIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="8.5" r="3.6" />
    <path d="M5 20a7 7 0 0 1 14 0" />
  </svg>
);

export const MenuIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const CloseIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

export const ChevronRightIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="m9.5 5 7 7-7 7" />
  </svg>
);

export const ChevronDownIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="m5 9.5 7 7 7-7" />
  </svg>
);

export const ArrowRightIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4.5 12h15M13.5 6l6 6-6 6" />
  </svg>
);

export const PinIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
);

export const CrosshairIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="6.5" />
    <circle cx="12" cy="12" r="1.6" />
    <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3" />
  </svg>
);

export const ShieldIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 3 19 6v6c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6l7-3Z" />
    <path d="m9 12 2.2 2.2L15.5 10" />
  </svg>
);

export const WalletIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 7.5A1.5 1.5 0 0 1 5.5 6H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7.5Z" />
    <path d="M4 9.5h16" />
    <circle cx="16.5" cy="14" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const CalendarIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="4" y="5.5" width="16" height="15" rx="2.2" />
    <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
  </svg>
);

export const GiftIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="9" width="17" height="11" rx="1.6" />
    <path d="M3.5 13.5h17M12 9v11" />
    <path d="M12 9S10.6 4.5 8.4 4.5a2.2 2.2 0 0 0 0 4.5H12Zm0 0s1.4-4.5 3.6-4.5a2.2 2.2 0 0 1 0 4.5H12Z" />
  </svg>
);

export const SparkleIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 3.5l1.7 4.8 4.8 1.7-4.8 1.7L12 16.5l-1.7-4.8L5.5 10l4.8-1.7L12 3.5Z" />
    <path d="M18.5 15.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2Z" />
  </svg>
);

export const UploadIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 16V4.5M8 8.5 12 4.5l4 4" />
    <path d="M4.5 15v3.5a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V15" />
  </svg>
);

export const HeartIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 20s-7.5-4.6-7.5-9.7A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 2.9C19.5 15.4 12 20 12 20Z" />
  </svg>
);

export const AlertIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.8v4.8M12 16.2h.01" />
  </svg>
);

export const LeafIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M20 4.5c0 8-4.6 12.4-10.2 12.4A4.8 4.8 0 0 1 5 12.1C5 7.4 10.4 4.5 20 4.5Z" />
    <path d="M4.5 19.5C7 15 11 11.7 15.5 9.8" />
  </svg>
);

export const BasketIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M3.5 9.5h17l-1.6 9a1.6 1.6 0 0 1-1.6 1.3H6.7a1.6 1.6 0 0 1-1.6-1.3l-1.6-9Z" />
    <path d="m8 9.5 2.4-5.4M16 9.5 13.6 4.1M9.5 13.5v3M14.5 13.5v3" />
  </svg>
);

export const BowlIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M3.5 11.5h17a8.5 8.5 0 0 1-17 0Z" />
    <path d="M9 8.2c0-1.3 1.4-1.6 1.4-2.9M13 8.2c0-1.3 1.4-1.6 1.4-2.9M5 20h14" />
  </svg>
);

export const PillIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect
      x="2.6"
      y="8.6"
      width="18.8"
      height="6.8"
      rx="3.4"
      transform="rotate(-45 12 12)"
    />
    <path d="m9.2 9.2 5.6 5.6" />
  </svg>
);

const CATEGORY_ICONS: Record<IconName, ComponentType<IconProps>> = {
  leaf: LeafIcon,
  basket: BasketIcon,
  bowl: BowlIcon,
  pill: PillIcon,
  sparkle: SparkleIcon,
  calendar: CalendarIcon,
  gift: GiftIcon,
  wallet: WalletIcon,
};

export function CategoryIcon({ name, ...rest }: IconProps & { name: IconName }) {
  const Cmp = CATEGORY_ICONS[name];
  return <Cmp {...rest} />;
}

export const MicIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" />
  </svg>
);
