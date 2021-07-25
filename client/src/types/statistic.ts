/**
  This file contains the types for trap speed payloads 
*/

import {
  Number,
  Record,
  Static,
} from 'runtypes';

export const PredictedPayload = Record({
  speed: Number,
});
export type PredictedPayload= Static<typeof PredictedPayload>

export const AchievedPayload = Record({
  speed: Number,
});
export type AchievedPayload = Static<typeof AchievedPayload>