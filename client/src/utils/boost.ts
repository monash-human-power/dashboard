import { ConfigT } from 'types/boost';

export const configTypeToFileSuffix: { [K in ConfigT]: string } = {
  rider: '_rider.json',
  bike: '_bike.json',
  track: '_track.json',
  powerPlan: '_powerPlan.json',
};
