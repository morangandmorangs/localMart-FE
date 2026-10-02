import type { Category } from '../../lib/catalog/types';
import { categoryPath, subCategoryPath } from '../../lib/catalog/categories';
import { ChevronRightIcon } from './Icons';

export function CategoryCard({ category }: { category: Category }) {
  return (
    <article className="lm-cat">
      <div className="lm-cat__media">
        <img src={category.image} alt={category.title} loading="lazy" />
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
