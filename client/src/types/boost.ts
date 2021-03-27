import {
  Number,
  String,
  Array,
  Record,
  Union,
  Runtype,
  Static,
} from 'runtypes';

const RiderRT = Record({
  displayName: String,
  mass: Number,
});

const CdaFunctionalRT = Record({
  type: String,
  velocity: Array(Number),
  cda: Array(Number),
});
const CdaConstantRT = Record({
  type: String,
  constant: Number,
});

const WheelRT = Record({
  rollResZeroSpeed: Number,
  rollResMoving: Number,
  loading: Number,
  momentOfInertia: Number,
  diameter: Number,
});
const BikeRT = Record({
  displayName: String,
  bikeMass: Number,
  dtLoss: Number,
  cda: Union(CdaFunctionalRT, CdaConstantRT),
  frontWheel: WheelRT,
  backWheel: WheelRT,
});

const ZonesRT = Record({ power: Number, duration: Number });
const ParametersRT = Record({
  lowerBound: Number,
  upperBound: Number,
  step: Number,
});
const PowerPlanRT = Record({
  displayName: String,
  inrunPower: Number,
  zones: Array(ZonesRT),
  searchParams: ParametersRT,
});

const TrackConstantRT = Record({
  displayName: String,
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
const TrackSlopedRT = Record({
  displayName: String,
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
const TrackRT = Union(TrackConstantRT, TrackSlopedRT);

const ConfigBundleRT = Record({
  rider: RiderRT,
  bike: BikeRT,
  track: TrackRT,
  powerPlan: PowerPlanRT,
});
export type ConfigBundleT = Static<typeof ConfigBundleRT>;

export const ConfigObjRT = Union(RiderRT, BikeRT, TrackRT, PowerPlanRT);

export type FileConfigT = keyof ConfigBundleT | 'bundle';
export type ConfigT = keyof ConfigBundleT;

export const RecommendedSPRT = Record({
  power: Number,
  speed: Number,
  zoneDistance: Number,
  distanceOffset: Number,
  distanceLeft: Number,
});

export const ConfigNameRT = Record({
  displayName: String,
  fileName: String,
});

// Type of the payload on 'boost/configs'
export const ConfigPayloadRT = Record({
  rider: Array(ConfigNameRT),
  bike: Array(ConfigNameRT),
  track: Array(ConfigNameRT),
  powerPlan: Array(ConfigNameRT),
});

type ConfigNameT = Static<typeof ConfigNameRT>;

export interface BoostConfig {
  /** The input of BOOST that this config is for */
  type: ConfigT;
  /** List of available BOOST configuration files */
  options: ConfigNameT[];
  /** Currently selected BOOST configuration */
  active?: ConfigNameT;
}

type ConfigDictionaryT = { [K in FileConfigT]: Runtype };
export const fileConfigTypeToRuntype: ConfigDictionaryT = {
  rider: RiderRT,
  bike: BikeRT,
  track: TrackRT,
  powerPlan: PowerPlanRT,
  bundle: ConfigBundleRT,
};
