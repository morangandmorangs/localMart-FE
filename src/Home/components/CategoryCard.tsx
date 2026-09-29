import type { Category } from '../../lib/catalog/types';
import { categoryPath, subCategoryPath } from '../../lib/catalog/categories';
import { CategoryIcon, ChevronRightIcon } from './Icons';

/**
 * A product category. The media area is an icon today; it is sized and
 * positioned so a product photo can drop straight in later — swap the
 * <CategoryIcon> for an <img> and nothing around it moves.
 */
export function CategoryCard({ category }: { category: Category }) {
  return (
    <article className="lm-cat">
      <div className="lm-cat__media">
        <CategoryIcon name={category.icon} className="lm-cat__icon" />
      </div>

      <h3 className="lm-cat__title">{category.title}</h3>
      <p className="lm-cat__subtitle">{category.subtitle}</p>

      <ul className="lm-cat__subs">
        {category.subCategories.map((sub) => (
          <li key={sub.slug}>
            <a href={subCategoryPath(category.slug, sub.slug)}>
              <span>{sub.label}</span>
              <ChevronRightIcon className="lm-cat__chevron" />
            </a>
          </li>
        ))}
      </ul>

      <a className="lm-btn lm-btn--outline lm-cat__cta" href={categoryPath(category.slug)}>
        {category.cta}
      </a>
    </article>
  );
}
