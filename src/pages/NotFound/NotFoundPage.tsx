import { Link, useLocation } from "react-router-dom";

import { Footer } from "../../Home/components/Footer";
import { Header } from "../../Home/components/Header";
import "./NotFound.css";

/** Aisles the magnifier "checks" while it sweeps the shelves. Purely cosmetic;
 *  the loop runs in CSS, so the wording rotates without any JS timers. */
const SEARCH_LINES = [
  "Checking the vegetable aisle…",
  "Asking the fish counter…",
  "Peeking behind the rice sacks…",
  "Looking by the tea shelf…",
];

// Real produce photos, self-hosted in /public/veg (see CREDITS.txt there).
type Veg = "broccoli" | "carrot" | "tomato" | "capsicum" | "courgette";

// Stock on each shelf; `null` marks the gap where the page should be.
const SHELVES: (Veg | null)[][] = [
  ["carrot", "broccoli", "tomato", "capsicum", "courgette"],
  ["tomato", "courgette", null, "carrot", "broccoli"],
  ["capsicum", "carrot", "broccoli", "tomato", "courgette"],
];

const SHELF_X = 30;
const SHELF_W = 260;
const SLOT = 52;

export default function NotFoundPage() {
  const { pathname } = useLocation();

  return (
    <div className='lm-home'>
      <Header />
      <main className='lm-main'>
        <section className='lm-nf' aria-labelledby='lm-nf-title'>
          <svg
            className='lm-nf__scene'
            viewBox='10 12 300 196'
            role='img'
            aria-label='A shopper searching an aisle for something that is not on the shelf'
          >
            {SHELVES.map((row, r) => {
              const base = 60 + r * 62;
              return (
                <g key={r}>
                  <rect
                    className='lm-nf__plank'
                    x={SHELF_X - 6}
                    y={base}
                    width={SHELF_W + 12}
                    height={6}
                    rx={3}
                  />
                  {row.map((item, i) => {
                    const cx = SHELF_X + i * SLOT + SLOT / 2;
                    if (!item) {
                      return (
                        <text
                          key={i}
                          className='lm-nf__qmark'
                          x={cx}
                          y={base - 8}
                          textAnchor='middle'
                        >
                          ?
                        </text>
                      );
                    }
                    const size = 38 + ((r + i) % 3) * 3;
                    const x = cx - size / 2;
                    const y = base - size;
                    const clip = `lm-nf-clip-${r}-${i}`;
                    return (
                      <g
                        key={i}
                        className='lm-nf__item'
                        style={{ animationDelay: `${(r * 5 + i) * 90}ms` }}
                      >
                        <clipPath id={clip}>
                          <rect x={x} y={y} width={size} height={size} rx={7} />
                        </clipPath>
                        <image
                          href={`/veg/${item}.jpg`}
                          x={x}
                          y={y}
                          width={size}
                          height={size}
                          preserveAspectRatio='xMidYMid slice'
                          clipPath={`url(#${clip})`}
                        />
                        <rect
                          className='lm-nf__frame'
                          x={x}
                          y={y}
                          width={size}
                          height={size}
                          rx={7}
                        />
                      </g>
                    );
                  })}
                </g>
              );
            })}

            {/* Magnifier sweeps the shelves; it pauses over the gap. */}
            <g className='lm-nf__lens'>
              <circle cx='0' cy='0' r='22' className='lm-nf__glass' />
              <circle cx='0' cy='0' r='22' className='lm-nf__rim' />
              <line x1='16' y1='16' x2='34' y2='34' className='lm-nf__handle' />
            </g>
          </svg>

          <p className='lm-nf__code' aria-hidden='true'>
            4<span className='lm-nf__zero'>0</span>4
          </p>
          <h1 id='lm-nf-title'>We looked everywhere</h1>
          <p className='lm-nf__lede'>
            There's nothing at <code>{pathname}</code> — it may have been moved,
            or it was never stocked.
          </p>

          <p className='lm-nf__status' aria-hidden='true'>
            {SEARCH_LINES.map((line, i) => (
              <span key={line} style={{ animationDelay: `${i * 3}s` }}>
                {line}
              </span>
            ))}
          </p>

          <div className='lm-nf__actions'>
            <Link className='lm-nf__btn lm-nf__btn--solid' to='/'>
              Back to the homepage
            </Link>
            <Link className='lm-nf__btn lm-nf__btn--outline' to='/category/grocery'>
              Browse groceries
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
