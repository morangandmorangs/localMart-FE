import { DailyRationCard } from './DailyRationCard';
import { FestiveRationCard } from './FestiveRationCard';

export function PlanSection() {
  return (
    <section className="lm-section" id="plan" aria-labelledby="lm-plan-title">
      <p className="lm-eyebrow lm-eyebrow--plan">Plan &amp; convenience</p>
      <h2 className="lm-h2" id="lm-plan-title">
        Set it once. Stop remembering.
      </h2>

      <div className="lm-plan-grid">
        <DailyRationCard />
        <FestiveRationCard />
      </div>
    </section>
  );
}
