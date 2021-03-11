import {
  Number,
  String,
  Array,
  Record,
  Union,
  Runtype,
  Static,
} from 'runtypes';

const RiderT = Record({
  name: String,
  mass: Number,
});

const CdaT = Record({
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
const BikeT = Record({
  name: String,
  bikeMass: Number,
  dtLoss: Number,
  cda: CdaT,
  frontWheel: WheelT,
  backWheel: WheelT,
});

const ZonesT = Record({ power: Number, duration: Number });
const ParametersT = Record({
  lowerBound: Number,
  upperBound: Number,
  step: Number,
});
const PowerPlanT = Record({
  name: String,
  inrunPower: Number,
  zones: Array(ZonesT),
  searchParams: ParametersT,
});

const TrackConstantT = Record({
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
const TrackSlopedT = Record({
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
const TrackT = Union(TrackConstantT, TrackSlopedT);

const ConfigBundle = Record({
  rider: RiderT,
  bike: BikeT,
  track: TrackT,
  powerPlan: PowerPlanT,
});
export type ConfigBundleT = Static<typeof ConfigBundle>;

export const ConfigObjT = Union(RiderT, BikeT, TrackT, PowerPlanT);

export type BoostConfigType = keyof ConfigBundleT | "bundle";

type ConfigName = {
  displayName: string;
  fileName: string;
};

export interface BoostConfig {
  /** The input of BOOST that this config is for */
  type: BoostConfigType;
  /** List of available BOOST configuration files */
  options: ConfigName[];
  /** Currently selected BOOST configuration */
  active?: ConfigName;
}

type ConfigDictionary = { [K in BoostConfigType]: Runtype };
export const getConfigRunType: ConfigDictionary = {
  rider: RiderT,
  bike: BikeT,
  track: TrackT,
  powerPlan: PowerPlanT,
  bundle: ConfigBundle,
};
