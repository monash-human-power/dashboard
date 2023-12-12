import { Record, Static, Boolean } from 'runtypes';

export const CrashAlertRT = Record({
  value: Boolean,
});

export type CrashAlertT = Static<typeof CrashAlertRT>;
