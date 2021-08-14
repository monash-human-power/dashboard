/**
 * This file contains the types for trap speed payloads
 */

import { Number, Record, Static } from 'runtypes';

export const SpeedPayload = Record({
  speed: Number,
});
export type SpeedPayload = Static<typeof SpeedPayload>;
