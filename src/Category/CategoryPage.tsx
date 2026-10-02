import { useParams } from "react-router-dom";

import { CATEGORIES } from "../lib/catalog/categories";
import { CartBar } from "../Home/components/CartBar";
import { Footer } from "../Home/components/Footer";
import { Header } from "../Home/components/Header";
import { AlertIcon, CategoryIcon } from "../Home/components/Icons";
import { FoodSection } from "./sections/FoodSection";
import { FreshSection } from "./sections/FreshSection";
import { GrocerySection } from "./sections/GrocerySection";
import { MedicineSection } from "./sections/MedicineSection";

/**
 * Which surface each category gets.
 *
 * Keyed off the catalogue slug rather than a chain of conditionals, so a new
 * category either has a section here or falls through to the not-found
 * branch — it can never silently render the wrong page.
 */
const SECTIONS: Record<string, () => React.ReactElement> = {
  "livestock-vegetables": FreshSection,
  grocery: GrocerySection,
  food: FoodSection,
  medicine: MedicineSection,
};

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = CATEGORIES.find((c) => c.slug === slug);
  const Section = slug ? SECTIONS[slug] : undefined;

  if (!category || !Section) {
    return (
      <div className='lm-home'>
        <Header />
        <main className='lm-main'>
          <section className='lm-catpage__missing'>
            <h1>Category not found</h1>
            <p>
              We don't have a <code>{slug}</code> aisle. Try the{" "}
              <a href='/'>homepage</a>.
            </p>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className='lm-home'>
      <Header />

      <main className='lm-main'>
        <header className='lm-catpage__head'>
          <div className='lm-catpage__head-icon'>
            <CategoryIcon name={category.icon} />
          </div>
          <div>
            <h1 className='lm-catpage__title'>{category.title}</h1>
            <p className='lm-catpage__subtitle'>{category.subtitle}</p>
          </div>
        </header>

        {/* Regulatory notice, on strict categories only. */}
        {category.notice && (
          <p className='lm-catpage__notice'>
            <AlertIcon className='lm-catpage__notice-icon' />
            <span>{category.notice}</span>
          </p>
        )}

        <Section />
      </main>

      <Footer />
      <CartBar />
    </div>
  );
}
