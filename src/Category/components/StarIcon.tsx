interface IconProps {
  className?: string;
}

/** Rating star. Decorative — the rating is always written out in text too. */
export const StarIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    viewBox='0 0 24 24'
    fill='currentColor'
    aria-hidden='true'
  >
    <path d='M12 17.3l-5.2 3 1.4-5.9-4.6-4 6-.5L12 4.3l2.4 5.6 6 .5-4.6 4 1.4 5.9z' />
  </svg>
);
