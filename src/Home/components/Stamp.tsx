import { useId, type ReactNode } from "react";

export interface StampProps {
  /** Icon shown in the centre of the stamp. */
  icon: ReactNode;
  /** Text set around the ring; spaced evenly to fill the circle. */
  ringText: string;
  /** Spoken name; the ring text is decorative because it repeats and wraps. */
  label: string;
  /** Colour family. */
  tone?: "brand" | "plan";
  /** Hand-pressed tilt in degrees. */
  tilt?: number;
  /** Delay before the press animation, in seconds. */
  delay?: number;
}

const TONE_INK = {
  brand: "text-(--lm-brand)",
  plan: "text-(--lm-plan-ink)",
} as const;

const RING_R = 44;
const RING_LENGTH = 2 * Math.PI * RING_R;

/** Round rubber-stamp badge: text running round the rim, icon in the middle.
 *  Rendered as an <li>, so place it inside a <ul>. */
export function Stamp({
  icon,
  ringText,
  label,
  tone = "brand",
  tilt = 0,
  delay = 0,
}: StampProps) {
  const pathId = useId();

  return (
    <li
      className={`relative size-29 ${TONE_INK[tone]} rotate-(--lm-stamp-tilt) motion-safe:animate-[lm-stamp-press_0.45s_cubic-bezier(0.2,1.2,0.4,1)_backwards]`}
      style={
        {
          "--lm-stamp-tilt": `${tilt}deg`,
          animationDelay: `${delay}s`,
        } as React.CSSProperties
      }
      aria-label={label}
    >
      {/* Shadow lives on its own disc: a CSS filter on the stamp would rasterise
          the rotating ring text into a bitmap and blur it. */}
      <span
        className='absolute inset-0.75 rounded-full shadow-[0_6px_12px_rgba(15,59,44,0.3)]'
        aria-hidden='true'
      />
      <svg viewBox='0 0 120 120' className='block size-full overflow-visible' aria-hidden='true'>
        <circle className='fill-[rgb(247_250_245/0.96)]' cx='60' cy='60' r='57' />
        <circle className='fill-none stroke-current stroke-2' cx='60' cy='60' r='57' />
        <circle className='fill-none stroke-current stroke-[1.2] [stroke-dasharray:2_3]' cx='60' cy='60' r='33' />
        <defs>
          {/* Full circle starting at 9 o'clock so the text reads clockwise. */}
          <path
            id={pathId}
            d={`M ${60 - RING_R} 60 a ${RING_R} ${RING_R} 0 1 1 ${RING_R * 2} 0 a ${RING_R} ${RING_R} 0 1 1 ${-RING_R * 2} 0`}
          />
        </defs>
        <g className='origin-[60px_60px] motion-safe:animate-[lm-stamp-spin_40s_linear_infinite]'>
          <text className='fill-current font-(family-name:--lm-sans) text-[8.4px] font-semibold [text-rendering:geometricPrecision]'>
            <textPath
              href={`#${pathId}`}
              textLength={RING_LENGTH - 2}
              lengthAdjust='spacing'
            >
              {ringText}
            </textPath>
          </text>
        </g>
      </svg>
      <span className='absolute inset-0 grid place-items-center [&_svg]:size-7.5'>{icon}</span>
    </li>
  );
}
