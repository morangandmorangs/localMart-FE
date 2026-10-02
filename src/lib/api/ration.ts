export type WeekDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export const WEEK_DAYS: { key: WeekDay; short: string; full: string }[] = [
  { key: 'mon', short: 'M', full: 'Monday' },
  { key: 'tue', short: 'T', full: 'Tuesday' },
  { key: 'wed', short: 'W', full: 'Wednesday' },
  { key: 'thu', short: 'T', full: 'Thursday' },
  { key: 'fri', short: 'F', full: 'Friday' },
  { key: 'sat', short: 'S', full: 'Saturday' },
  { key: 'sun', short: 'S', full: 'Sunday' },
];

/** Food delivery runs on working days only. */
export const WORKDAYS = WEEK_DAYS.slice(0, 5);
export const ALL_WORKDAYS: WeekDay[] = WORKDAYS.map((d) => d.key);

export interface RationSchedule {
  days: WeekDay[];
  slot: 'morning';
  paused: boolean;
}

export interface RationScheduleResponse {
  signedIn: boolean;
  schedule: RationSchedule | null;
}

/** TODO(api): wire to GET/POST /api/ration/schedule once the customer
 *  session and the recurring-delivery job exist. */
export function saveRationSchedule(
  days: WeekDay[],
): Promise<RationScheduleResponse> {
  return Promise.resolve({
    signedIn: false,
    schedule: { days, slot: 'morning', paused: false },
  });
}
