import React from 'react';
import ContentPage from 'components/common/ContentPage';
import BoostCalibration from 'components/common/boost/BoostCalibration';
import BoostConfigurator from 'components/common/boost/BoostConfigurator';
import { setCalibration, resetCalibration } from 'api/common/powerModel';
import uploadConfig from 'api/v3/boost';
import { BoostConfigType, BoostConfig } from 'types/boost';

// TODO: Implement actual functions for `onSelectConfig`, `onDeleteConfig` and true values for `baseConfigs` (provided from `boost`)

/**
 * Send the config selection to `boost`
 *
 * @param configType the type of the config
 * @param name name of the config file
 */
function onSelectConfig(configType: BoostConfigType, name: string) {
  console.log('Selected config:');
  console.log(`type: ${configType}`);
  console.log(`name: ${name}`);
}

/**
 * Inform boost of the deletion of the given config file
 *
 * @param configType the type of the config
 * @param name name of the config file
 */
function onDeleteConfig(configType: BoostConfigType, name: string) {
  console.log('Deleted config:');
  console.log(`type: ${configType}`);
  console.log(`name: ${name}`);
}

// Only dummy data
const baseConfigs: BoostConfig[] = [
  {
    type: 'powerPlan',
    options: [
      { fileName: 'my_plan_1.json', displayName: 'my_plan_1' },
      { fileName: 'this_one_gets_you_to_144.json', displayName: '144' },
    ],
    active: { fileName: 'my_plan_1.json', displayName: 'my_plan_1' },
  },
  {
    type: 'rider',
    options: [
      { fileName: 'al.json', displayName: 'AL' },
      { fileName: 'charles.json', displayName: 'charles' },
    ],
    active: { fileName: 'charles.json', displayName: 'charles' },
  },
  {
    type: 'bike',
    options: [
      { fileName: 'blacksmith.json', displayName: 'Black Smith' },
      { fileName: 'wombat.json', displayName: 'Wombat' },
      { fileName: 'precilla.json', displayName: 'Precilla' },
    ],
    active: { fileName: 'wombat.json', displayName: 'Wombat' },
  },
  {
    type: 'track',
    options: [
      { fileName: 'ford.json', displayName: 'Ford' },
      { fileName: 'holden.json', displayName: 'Holden' },
      { fileName: 'battle_mountain.json', displayName: 'Battle Mountain' },
    ],
    active: { fileName: 'ford.json', displayName: 'Ford' },
  },
];

/**
 * Boost View component
 *
 * @returns {React.Component} Component
 */
export default function BoostView() {
  // TODO: remove the hardcoded value for `distTravelled` with actual value read from MQTT
  return (
    <ContentPage title="Boost Configuration">
      <BoostCalibration
        onSet={setCalibration}
        onReset={resetCalibration}
        distTravelled={30}
        calibrationDiff={10}
      />
      <BoostConfigurator
        configs={baseConfigs}
        onSelectConfig={onSelectConfig}
        onDeleteConfig={onDeleteConfig}
        onUploadConfig={uploadConfig}
      />
    </ContentPage>
  );
}
