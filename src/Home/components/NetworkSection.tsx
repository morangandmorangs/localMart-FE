import type { ComponentType, SVGProps } from "react";
import { APP_LINKS } from "../../config/apps";
import { ArrowRightIcon, CartIcon, LeafIcon, StorefrontIcon, TruckIcon } from "./Icons";

interface Role {
  /** Picks the card tint and the /home/network-<key>.png illustration. */
  key: "customer" | "merchant" | "farmer" | "delivery";
  app: string;
  pitch: string;
  body: string;
  cta: string;
  /** The partner's own app: a Play Store page, or the farmer website. */
  href: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

const ROLES: Role[] = [
  {
    key: "customer",
    app: "Customer App",
    pitch: "Shop here",
    body: "Buy fresh produce, groceries, food and more from local sellers.",
    cta: "Shop Here",
    href: APP_LINKS.customer,
    Icon: CartIcon,
  },
  {
    key: "merchant",
    app: "Merchant App",
    pitch: "Join us, become a merchant",
    body: "List your products, reach more local customers and grow your business.",
    cta: "Become a Merchant",
    href: APP_LINKS.merchant,
    Icon: StorefrontIcon,
  },
  {
    key: "farmer",
    app: "Farmer Web App",
    pitch: "Tell us what you cultivate",
    body: "Add your farm, crops and expected harvest so we can connect you to local buyers.",
    cta: "Add Your Farm Details",
    href: APP_LINKS.farmer,
    Icon: LeafIcon,
  },
  {
    key: "delivery",
    app: "Delivery Partner App",
    pitch: "Become a delivery partner",
    body: "Deliver orders in your area, earn income and support your local community.",
    cta: "Join as Delivery Partner",
    href: APP_LINKS.driver,
    Icon: TruckIcon,
  },
];

export function NetworkSection() {
  return (
    <section className='lm-section lm-network' aria-labelledby='lm-network-title'>
      <h2 className='lm-h2' id='lm-network-title'>
        Join the Local Mart Network
      </h2>
      <p className='lm-network__sub'>
        Be a buyer, seller, farmer or delivery partner. Help build a stronger
        local food ecosystem.
      </p>

      <ul className='lm-network__grid'>
        {ROLES.map(({ key, app, pitch, body, cta, href, Icon }) => (
          <li key={key} className={`lm-join lm-join--${key}`}>
            <img
              className='lm-join__art'
              src={`/home/network-${key}.png`}
              alt=''
              loading='lazy'
            />
            <div className='lm-join__head'>
              <span className='lm-join__mark'>
                <Icon />
              </span>
              <div>
                <h3 className='lm-join__app'>{app}</h3>
                <p className='lm-join__pitch'>{pitch}</p>
              </div>
            </div>
            <p className='lm-join__body'>{body}</p>
            <a
              className='lm-btn lm-btn--primary lm-btn--pill lm-join__cta'
              href={href}
              target='_blank'
              rel='noopener noreferrer'
            >
              {cta}
              <ArrowRightIcon className='lm-btn__icon' />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
