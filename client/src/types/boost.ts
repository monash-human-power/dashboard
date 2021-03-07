import { Number, String, Array, Record, Union, Runtype } from 'runtypes';

export type BoostConfigType = 'powerPlan' | 'rider' | 'bike' | 'track' | 'bundle';

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
    filename: String,
  }),
});
const trackT = Union(trackConstantT, trackSlopedT);

const configBundle = Record({
  rider: riderT,
  bike: bikeT,
  track: trackT,
  powerPlan: powerPlanT,
});
export type configBundleT = typeof configBundle;

export const configObjT = Union(riderT, bikeT, trackT, powerPlanT);

type ConfigDictionary = {[K in BoostConfigType] : Runtype};
const ConfigRunType: ConfigDictionary = {
  'rider': riderT,
  'bike': bikeT,
  'track': trackT,
  'powerPlan': powerPlanT,
  'bundle': configBundle,
};

export const getConfigRunType = (type: BoostConfigType) => {
  return ConfigRunType[type];
};
