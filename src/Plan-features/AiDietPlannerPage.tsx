import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { GET_APP_PATH } from "../config/apps";
import { Footer } from "../Home/components/Footer";
import { Header } from "../Home/components/Header";
import {
  DAILY_KCAL,
  DAILY_MEALS,
  PLAN_DAYS,
  generateMonthlyPlan,
  scheduleWeekly,
} from "./leanBulkPlan";

const STAGES = [
  "Reading your diet chart…",
  "Detecting meals and portions…",
  "Calculating 30-day quantities…",
  "Matching items from local shops…",
  "Splitting into weekly deliveries…",
];
const STAGE_MS = 1100;

type Phase = "idle" | "generating" | "done";

/** Mock AI planner: any uploaded image "generates" the Lean Bulk plan. */
export default function AiDietPlannerPage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [stage, setStage] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const previewRef = useRef<string | null>(null);

  const weeks = useMemo(() => scheduleWeekly(generateMonthlyPlan()), []);

  useEffect(() => {
    if (phase !== "generating") return;
    const t = setInterval(() => {
      setStage((s) => {
        if (s + 1 >= STAGES.length) {
          clearInterval(t);
          setPhase("done");
          return s;
        }
        return s + 1;
      });
    }, STAGE_MS);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => () => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
  }, []);

  const onFile = (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = URL.createObjectURL(file);
    setPreview(previewRef.current);
    setStage(0);
    setPhase("generating");
  };

  const total = weeks.reduce((s, w) => s + w.total, 0);
  return (
    <div className='lm-home'>
      <Header />
      <main className='lm-main'>
        <header className='lm-catpage__head'>
          <div>
            <h1 className='lm-catpage__title'>AI diet planner</h1>
            <p className='lm-catpage__subtitle'>
              Upload your diet chart. We'll turn it into a month of groceries, delivered weekly.
            </p>
          </div>
        </header>

        <section className='lm-catpage__section'>
          <label className='lm-aidiet__drop'>
            <input
              type='file'
              accept='image/*'
              disabled={phase === "generating"}
              onChange={(e) => onFile(e.target.files?.[0])}
            />
            {preview ? (
              <img src={preview} alt='Your uploaded diet chart' />
            ) : (
              <span>Click to upload a diet chart image</span>
            )}
          </label>

          {phase === "generating" && (
            <div className='lm-aidiet__progress' role='status' aria-live='polite'>
              <div className='lm-aidiet__bar'>
                <span style={{ width: `${((stage + 1) / STAGES.length) * 100}%` }} />
              </div>
              <ul>
                {STAGES.map((label, i) => (
                  <li key={label} data-state={i < stage ? "done" : i === stage ? "active" : "todo"}>
                    {i < stage ? "✓" : i === stage ? "…" : "○"} {label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {phase === "done" && (
          <section className='lm-catpage__section lm-aidiet__plan'>
            <h2 className='lm-catpage__title'>Your {PLAN_DAYS}-day plan is ready</h2>
            <p className='lm-catpage__subtitle'>
              ~{DAILY_KCAL} kcal/day · {DAILY_MEALS.length} meals ·{" "}
              {DAILY_MEALS.map((m) => m.name).join(", ")}
            </p>

            {weeks.map((w) => (
              <div className='lm-aidiet__week' key={w.week}>
                <div className='lm-aidiet__week-head'>
                  <div>
                    <h3>Week {w.week}</h3>
                    <p>
                      Delivery{" "}
                      {w.date.toLocaleDateString(undefined, {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                      , 9 am – 12 pm
                    </p>
                  </div>
                  <p className='lm-aidiet__price'>₹{w.total}</p>
                </div>
                <ul className='lm-aidiet__lines'>
                  {w.lines.map(({ item, quantity }) => (
                    <li key={item.id}>
                      <span className='lm-aidiet__emoji' aria-hidden='true'>
                        {item.emoji}
                      </span>
                      <span className='lm-aidiet__name'>
                        {item.name}, {item.pack}
                      </span>
                      <span className='lm-aidiet__qty'>× {quantity}</span>
                      <span className='lm-aidiet__line-price'>
                        ₹{item.price * quantity}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Ordering and weekly deliveries are set up in the app. */}
            <div className='lm-aidiet__summary'>
              <p className='lm-aidiet__total'>
                {weeks.length} deliveries · ₹{total}
              </p>
              <div className='lm-aidiet__actions'>
                <Link className='lm-btn lm-btn--primary' to={GET_APP_PATH}>
                  Order this plan in the app
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
