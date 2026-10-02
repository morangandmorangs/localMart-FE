import type { Category } from '../../lib/catalog/types';
import { PRESCRIPTION_UPLOAD_PATH, subCategoryPath } from '../../lib/catalog/categories';
import { resolveCartAction } from '../../lib/cart';
import { AlertIcon, ChevronRightIcon, UploadIcon } from './Icons';

/**
 * Medicine is deliberately not a CategoryCard: it carries a terracotta
 * border, a STRICT badge, the pharmacist notice, and it never offers
 * "Add to cart" for an Rx item — resolveCartAction() decides that, not this
 * component.
 */
export function MedicineCard({ category }: { category: Category }) {
  return (
    <article className="lm-cat lm-cat--rx">
      <div className="lm-cat__media lm-cat__media--rx">
        <img src={category.image} alt={category.title} loading="lazy" />
        <span className="lm-badge-strict">STRICT</span>
      </div>

      <h3 className="lm-cat__title">{category.title}</h3>
      <p className="lm-cat__subtitle">{category.subtitle}</p>

      <ul className="lm-cat__subs">
        {category.subCategories.map((sub) => {
          const action = resolveCartAction({
            productId: sub.slug,
            name: sub.label,
            requiresPrescription: sub.requiresPrescription,
          });
          const rx = action.kind === 'prescription';
          return (
            <li key={sub.slug}>
              <a
                href={rx ? PRESCRIPTION_UPLOAD_PATH : subCategoryPath(category.slug, sub.slug)}
              >
                <span>{sub.label}</span>
                {rx ? (
                  <span className="lm-badge-rx">Rx</span>
                ) : (
                  <ChevronRightIcon className="lm-cat__chevron" />
                )}
              </a>
            </li>
          );
        })}
      </ul>

      {category.notice && (
        <p className="lm-rx-notice">
          <AlertIcon className="lm-rx-notice__icon" />
          <span>{category.notice}</span>
        </p>
      )}

      <a className="lm-btn lm-btn--rx lm-cat__cta" href={PRESCRIPTION_UPLOAD_PATH}>
        <UploadIcon className="lm-btn__icon" />
        {category.cta}
      </a>
    </article>
  );
}
