import { Link } from "react-router-dom";

export interface LogoProps {
  /** Renders as a link to this path; omit for a non-interactive mark. */
  to?: string;
  /** sm = footers/dense bars, md = header, lg = auth screens and heroes. */
  size?: "sm" | "md" | "lg";
  /** Hide the wordmark and show the storefront mark alone. */
  iconOnly?: boolean;
  /** Turn the intro and hover motion off. Always off under reduced-motion. */
  static?: boolean;
  className?: string;
}

const WORD = ["Local", "Mart"] as const;

/** Local Mart logo: a storefront whose outline draws itself in, with the
 *  wordmark rising in letter by letter. Hovering swings the awning.
 *  Motion lives in Logo.css and is dropped under prefers-reduced-motion. */
export function Logo({
  to,
  size = "md",
  iconOnly = false,
  static: isStatic = false,
  className = "",
}: LogoProps) {
  const classes = [
    "lm-logo",
    `lm-logo--${size}`,
    isStatic ? "lm-logo--static" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  let index = 0;
  const content = (
    <>
      <svg
        className='lm-logo__icon'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
        aria-hidden='true'
        focusable='false'
      >
        <path
          className='lm-logo__body'
          pathLength='1'
          d='M3.5 9.5V19a1 1 0 0 0 1 1h15a1 1 0 0 0 1-1V9.5'
        />
        {/* The group takes the hover swing so the path keeps its intro
            animation untouched (and never replays). */}
        <g className='lm-logo__swing'>
          <path
            className='lm-logo__awning'
            pathLength='1'
            d='M3 6.5 4.2 4h15.6L21 6.5a2.6 2.6 0 0 1-4.5 2 2.6 2.6 0 0 1-4.5 0 2.6 2.6 0 0 1-4.5 0A2.6 2.6 0 0 1 3 6.5Z'
          />
        </g>
      </svg>

      {!iconOnly && (
        <span className='lm-logo__text' aria-hidden={to ? undefined : "true"}>
          {WORD.map((word) => (
            <span className='lm-logo__word' key={word}>
              {[...word].map((ch) => (
                <span
                  className='lm-logo__char'
                  style={{ animationDelay: `${0.35 + index++ * 0.05}s` }}
                  key={index}
                >
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </span>
      )}
    </>
  );

  if (to) {
    return (
      <Link className={classes} to={to} aria-label='Local Mart — home'>
        {content}
      </Link>
    );
  }
  return (
    <span className={classes} role='img' aria-label='Local Mart'>
      {content}
    </span>
  );
}
