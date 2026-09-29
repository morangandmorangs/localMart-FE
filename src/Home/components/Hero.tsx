import { ShieldIcon, WalletIcon } from './Icons';
import { CategoryQuickCard } from './CategoryQuickCard';
import { LocationPicker } from './LocationPicker';
import { SearchBar } from './SearchBar';

export function Hero() {
  return (
    <section className="lm-hero" aria-labelledby="lm-hero-title">
      <div className="lm-hero__left">
        <p className="lm-hero__eyebrow">
          Local Mart · One neighbourhood, many services
        </p>

        <p className="lm-hero__tagline" lang="as">
          আমাৰ বজাৰ আমাৰ পথাৰ
        </p>

        <h1 className="lm-hero__title" id="lm-hero-title">
          Everything local.
          <br />
          One simple place.
          <br />
          More peace of mind.
        </h1>

        <p className="lm-hero__intro">
          Fresh produce, groceries, meals and medicines from sellers near you —
          plus smart planning that builds your list from a diet plan, keeps
          daily ration on schedule and gets festive shopping sorted early.
        </p>

        <p className="lm-hero__find">Find what you need and where you need it</p>

        <div className="lm-hero__controls">
          <SearchBar />
          <LocationPicker />
        </div>

        <ul className="lm-hero__chips">
          <li className="lm-chip">Serving Numaligarh Refinery Township</li>
          <li className="lm-chip">Reviewed listings and clear availability</li>
        </ul>
      </div>

      <div className="lm-hero__right">
        <CategoryQuickCard />

        <ul className="lm-hero__trust">
          <li>
            <ShieldIcon className="lm-hero__trust-icon" />
            <span>
              <strong>Verified sellers</strong>
              <span>Every listing reviewed</span>
            </span>
          </li>
          <li>
            <WalletIcon className="lm-hero__trust-icon" />
            <span>
              <strong>One wallet</strong>
              <span>For every order and plan</span>
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
}
