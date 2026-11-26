import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GET_APP_PATH } from '../../config/apps';
import { WEEK_DAYS, type WeekDay } from '../../lib/api/ration';
import { CalendarIcon } from './Icons';

export function DailyRationCard() {
  const [days, setDays] = useState<WeekDay[]>([
    'mon',
    'tue',
    'wed',
    'thu',
    'fri',
  ]);

  const toggle = (day: WeekDay) =>
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );

  return (
    <article className="lm-plan-card" aria-labelledby="lm-ration-title">
      <div className="lm-plan-card__head">
        <span className="lm-plan-card__mark">
          <CalendarIcon />
        </span>
        <div>
          <h3 className="lm-plan-card__title" id="lm-ration-title">
            Daily Ration + Wallet
          </h3>
          <p className="lm-plan-card__subtitle">
            Milk, bread, vegetables — at your door on schedule
          </p>
        </div>
      </div>

      <div className="lm-plan-card__grid">
        <div className="lm-tile-plain">
          <p className="lm-tile-plain__label">DELIVERY DAYS</p>

          <div className="lm-days" role="group" aria-label="Delivery days">
            {WEEK_DAYS.map((d) => (
              <button
                key={d.key}
                type="button"
                className="lm-days__btn"
                aria-pressed={days.includes(d.key)}
                onClick={() => toggle(d.key)}
              >
                <span aria-hidden="true">{d.short}</span>
                <span className="lm-visually-hidden">{d.full}</span>
              </button>
            ))}
          </div>

          <p className="lm-tile-plain__note">Morning slot · pause anytime</p>
        </div>

        <div className="lm-tile-plain">
          <p className="lm-tile-plain__label">LOCAL MART WALLET</p>
          <p className="lm-tile-plain__note">
            Auto-pays each delivery. Top up by UPI in the app.
          </p>
        </div>
      </div>

      {/* The days above are a preview; the ration is set up in the app. */}
      <div className="lm-plan-card__actions">
        <Link className="lm-btn lm-btn--primary" to={GET_APP_PATH}>
          Start Daily Ration in the app
        </Link>
      </div>
    </article>
  );
}
