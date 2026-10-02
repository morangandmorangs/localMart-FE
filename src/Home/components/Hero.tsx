import GradientWaves from "../../Common/GradientWaves";
import { ShieldIcon } from "./Icons";
import { CategoryQuickCard } from "./CategoryQuickCard";
import { Stamp } from "./Stamp";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Hero() {
  return (
    <section className='lm-hero' aria-labelledby='lm-hero-title'>
      {/* Brand palette: deep green haze, brand-green waves, mint crests. */}
      <div className='lm-hero__waves' aria-hidden='true'>
        <GradientWaves
          horizonColor='#0f3b2c'
          waveColor='#15573f'
          crestColor='#bfe8cf'
          speed={prefersReducedMotion() ? 0 : 0.3}
          mouseInteraction={false}
          grainIntensity={0.03}
        />
      </div>
      <div className='lm-hero__right'>
        <CategoryQuickCard />
      </div>

      <ul className='absolute -right-8 -bottom-8 z-1 hidden min-[1100px]:block' aria-label='Local Mart promises'>
        <Stamp
          icon={<ShieldIcon />}
          ringText='VERIFIED SELLERS • EVERY LISTING REVIEWED • '
          label=''
          tilt={-6}
          delay={0.7}
        />
      </ul>
    </section>
  );
}
// Hide the support bot on the hero section and show
// it on /signin?redirect=/checkout and /checkout
// Instead show
