import { BoltIcon, LeafIcon, ShieldIcon } from "./Icons";
import { PlanSmarter } from "./PlanSmarter";
import { ShopByCategory } from "./ShopByCategory";

const PERKS = [
  { label: "Fresh & Local", Icon: LeafIcon },
  { label: "Trusted Sellers", Icon: ShieldIcon },
  { label: "Fast Delivery", Icon: BoltIcon },
];

/** Headline over the farmer photo, then the shop and planning cards, which
 *  ride up over the bottom of the photo. */
export function Hero() {
  return (
    <section className='lm-hero' aria-labelledby='lm-hero-title'>
      <div className='lm-hero__top'>
        <img
          className='lm-hero__art'
          src='/home/hero-farmer.jpg'
          alt=''
          width={875}
          height={335}
          fetchPriority='high'
        />

        <div className='lm-hero__copy'>
          <h1 className='lm-hero__title' id='lm-hero-title'>
            Your Local
            <br />
            Market, <span className='lm-hero__accent'>Online</span>
          </h1>
          <p className='lm-hero__intro'>
            Buy fresh local produce, support local farmers, and get it
            delivered to your home or business.
          </p>
          <ul className='lm-hero__perks'>
            {PERKS.map(({ label, Icon }) => (
              <li key={label}>
                <span className='lm-hero__perk-mark'>
                  <Icon />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className='lm-hero__cards'>
        <ShopByCategory />
        <PlanSmarter />
      </div>
    </section>
  );
}
