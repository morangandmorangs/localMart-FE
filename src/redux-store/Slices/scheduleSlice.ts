import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ScheduledLine {
  id: string;
  name: string;
  emoji: string;
  pack: string;
  price: number;
  quantity: number;
}

/** One planned delivery, e.g. week 2 of the 30-day diet plan. */
export interface ScheduledDelivery {
  /** Unique per plan + week, so re-scheduling replaces instead of duplicating. */
  id: string;
  label: string;
  /** ISO string; Dates are not serialisable in the persisted store. */
  deliverOn: string;
  lines: ScheduledLine[];
  total: number;
}

export interface ScheduleState {
  deliveries: ScheduledDelivery[];
}

const initialState: ScheduleState = { deliveries: [] };

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    scheduleDeliveries(state, action: PayloadAction<ScheduledDelivery[]>) {
      const incoming = new Set(action.payload.map((d) => d.id));
      state.deliveries = [
        ...state.deliveries.filter((d) => !incoming.has(d.id)),
        ...action.payload,
      ].sort((a, b) => a.deliverOn.localeCompare(b.deliverOn));
    },
    unscheduleDelivery(state, action: PayloadAction<string>) {
      state.deliveries = state.deliveries.filter((d) => d.id !== action.payload);
    },
  },
});

export const { scheduleDeliveries, unscheduleDelivery } = scheduleSlice.actions;

interface WithSchedule {
  schedule: ScheduleState;
}

export const selectScheduledDeliveries = (state: WithSchedule) =>
  state.schedule.deliveries;
export const selectScheduledCount = (state: WithSchedule) =>
  state.schedule.deliveries.length;

export default scheduleSlice.reducer;
