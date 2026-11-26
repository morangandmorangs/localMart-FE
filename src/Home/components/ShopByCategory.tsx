import { Link } from "react-router-dom";
import { CATEGORIES, categoryPath } from "../../lib/catalog/categories";

/** Hero card: one photo tile per aisle, straight from the catalogue config. */
export function ShopByCategory() {
  return (
    <section className='lm-shop' aria-labelledby='lm-shop-title'>
      <h2 className='lm-card-title' id='lm-shop-title'>
        Shop by category
      </h2>

      <ul className='lm-shop__tiles'>
        {CATEGORIES.map((c) => (
          <li key={c.slug}>
            <Link
              className={`lm-shop__tile${c.family === "rx" ? " lm-shop__tile--rx" : ""}`}
              to={categoryPath(c.slug)}
            >
              <span className='lm-shop__thumb'>
                <img src={c.image} alt='' loading='lazy' />
                <span className='lm-shop__badge'>{c.tileLabel}</span>
              </span>
              <span className='lm-shop__name'>{c.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
