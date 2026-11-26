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
