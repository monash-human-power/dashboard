import { ConfigT } from 'types/boost';

export const configTypeToFileSuffix: { [K in ConfigT]: string } = {
  rider: '_rider.json',
  bike: '_bike.json',
  track: '_track.json',
  powerPlan: '_powerPlan.json',
};

export const removeSuffix = (name: string, type: ConfigT) =>
  name.replace(configTypeToFileSuffix[type], '.json');

export const addSuffix = (name: string, type: ConfigT) =>
  name.replace('.json', configTypeToFileSuffix[type]);
