import { CATEGORIES } from '../../lib/catalog/categories';
import { CategoryCard } from './CategoryCard';
import { MedicineCard } from './MedicineCard';

export function CategoryGrid() {
  return (
    <section className="lm-section" aria-labelledby="lm-shop-title">
      <div className="lm-section__head">
        <div>
          <p className="lm-eyebrow">Shop</p>
          <h2 className="lm-h2" id="lm-shop-title">
            What&rsquo;s in the market today
          </h2>
        </div>

        <ul className="lm-key" aria-label="Colour key">
          <li>
            <span className="lm-key__swatch lm-key__swatch--product" />
            Products
          </li>
          <li>
            <span className="lm-key__swatch lm-key__swatch--ai" />
            AI assist
          </li>
          <li>
            <span className="lm-key__swatch lm-key__swatch--plan" />
            Plan &amp; convenience
          </li>
        </ul>
      </div>

      <div className="lm-cat-grid">
        {CATEGORIES.map((c) =>
          c.family === 'rx' ? (
            <MedicineCard key={c.slug} category={c} />
          ) : (
            <CategoryCard key={c.slug} category={c} />
          ),
        )}
      </div>
    </section>
  );
}
