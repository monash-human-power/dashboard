import { Number, String, Array, Record, Union } from 'runtypes';

export type BoostConfigType = 'powerPlan' | 'rider' | 'bike' | 'track' | 'all';

export interface BoostConfig {
  /** The input of BOOST that this config is for */
  type: BoostConfigType;
  /** List of available BOOST configuration files */
  options: string[];
  /** Currently selected BOOST configuration */
  active?: string;
}

const riderT = Record({
  name: String,
  mass: Number,
});

const cdaT = Record({
  type: String,
  velocity: Array(Number),
  cda: Array(Number),
});
const WheelT = Record({
  rollResZeroSpeed: Number,
  rollResMoving: Number,
  loading: Number,
  momentOfInertia: Number,
  diameter: Number,
});
const bikeT = Record({
  name: String,
  bikeMass: Number,
  dtLoss: Number,
  cda: cdaT,
  frontWheel: WheelT,
  backWheel: WheelT,
});

const zonesT = Record({power: Number, duration: Number});
const parametersT = Record({lowerBound: Number, upperBound: Number, step: Number});
const powerPlanT = Record({
  name: String,
  inrunPower: Number,
  zones: Array(zonesT),
  searchParams: parametersT,
});

// const slopeT = Union(Record({type: String, contant: Number}), Record({type: String, file: String}));
const trackConstantT = Record({
  name: String,
  length: Number,
  trapStart: Number,
  trapEnd: Number,
  gravity: Number,
  airDensity: Number,
  slope: Record({
    type: String,
    constant: Number,
  }),
});

const trackSlopedT = Record({
  name: String,
  length: Number,
  trapStart: Number,
  trapEnd: Number,
  gravity: Number,
  airDensity: Number,
  slope: Record({
    type: String,
    file: String,
  }),
});

export const configBundleT = Record({
  rider: riderT,
  bike: bikeT,
  track: Union(trackConstantT, trackSlopedT),
  powerPlan: powerPlanT,
});

export const configObjT = Union(riderT, bikeT, Union(trackConstantT, trackSlopedT), powerPlanT);
