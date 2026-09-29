import { useState } from 'react';
import type { DietPlanItem } from '../../lib/api/dietPlan';
import { DietPlanResults } from './DietPlanResults';
import { DietPlanUpload, type UploadState } from './DietPlanUpload';
import { SparkleIcon } from './Icons';

const STEPS = [
  'Upload a PDF or photo of your plan',
  'Review matched products and quantities',
  'Order once, or send it to Daily Ration',
];

export function AiDietPlanner() {
  const [state, setState] = useState<UploadState>({ kind: 'idle' });
  const [items, setItems] = useState<DietPlanItem[]>([]);

  const setQuantity = (productId: string, quantity: number) =>
    setItems((prev) =>
      prev.map((it) =>
        it.productId === productId
          ? {
              ...it,
              quantity: Number.isFinite(quantity) ? Math.max(0, quantity) : 0,
            }
          : it,
      ),
    );

  return (
    <section className="lm-ai" id="ai-diet-planner" aria-labelledby="lm-ai-title">
      <div className="lm-ai__left">
        <p className="lm-pill-ai">
          <SparkleIcon className="lm-pill-ai__icon" />
          AI ASSIST
        </p>

        <h2 className="lm-h2 lm-h2--onDark" id="lm-ai-title">
          Your diet plan,
          <br />
          turned into a basket.
        </h2>

        <p className="lm-ai__body">
          Upload the plan from your doctor or dietitian as a PDF or photo. We
          read it, match each item to products sold near you, and hand you a
          list you can edit and order in one go.
        </p>

        <ol className="lm-steps">
          {STEPS.map((step, i) => (
            <li key={step}>
              <span className="lm-steps__num" aria-hidden="true">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="lm-ai__right">
        <DietPlanUpload state={state} onState={setState} onItems={setItems} />
        <DietPlanResults items={items} onQuantityChange={setQuantity} />
      </div>
    </section>
  );
}
