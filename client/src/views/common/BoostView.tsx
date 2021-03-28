import React, { useEffect, useState, useCallback } from 'react';
import ContentPage from 'components/common/ContentPage';
import BoostCalibration from 'components/common/boost/BoostCalibration';
import BoostConfigurator from 'components/common/boost/BoostConfigurator';
import { setCalibration, resetCalibration } from 'api/common/powerModel';
import uploadConfig from 'api/v3/boost';
import {
  ConfigT,
  BoostConfig,
  ConfigPayloadRT,
  RecommendedSPRT,
} from 'types/boost';
import { useSensorData, Sensor } from 'api/common/data';
import { Number, Static } from 'runtypes';
import { useChannelShaped } from 'api/common/socket';
import toast from 'react-hot-toast';

// TODO: Implement actual functions for `onSelectConfig`, `onDeleteConfig` and true values for `baseConfigs` (provided from `boost`)

/**
 * Send the config selection to `boost`
 *
 * @param configType the type of the config
 * @param name name of the config file
 */
function onSelectConfig(configType: ConfigT, name: string) {
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
function onDeleteConfig(configType: ConfigT, name: string) {
  console.log('Deleted config:');
  console.log(`type: ${configType}`);
  console.log(`name: ${name}`);
}

/**
 * Boost View component
 *
 * @returns {React.Component} Component
 */
export default function BoostView() {
  // TODO: remove the hardcoded value for `distTravelled` with actual value read from MQTT
  const [dist, setDist] = useState(0);
  const [distOffset, setOffset] = useState<number | null>(null);
  const [configs, setConfigs] = useState<BoostConfig[]>([
    {
      type: 'powerPlan',
      options: [],
    },
    {
      type: 'rider',
      options: [],
    },
    {
      type: 'bike',
      options: [],
    },
    {
      type: 'track',
      options: [],
    },
  ]);

  // fetch the reed distance from wireless module #3
  const reedDistance = useSensorData(3, Sensor.ReedDistance, Number);

  useEffect(() => {
    if (reedDistance) {
      // Set distance to 2 decimal places
      setDist(Math.round(reedDistance * 100) / 100);
    }
  }, [reedDistance]);

  const handleConfigsReceived = useCallback(
    (configsReceived: Static<typeof ConfigPayloadRT>) => {
      // Replace the available config options with those received
      setConfigs(
        configs.map((config) => {
          return { ...config, options: configsReceived[config.type] };
        }),
      );
    },
    [configs],
  );

  const handleDistOffsetReceived = useCallback(
    (payload: Static<typeof RecommendedSPRT>) => {
      setOffset(payload.distanceOffset);
    },
    [],
  );

  useChannelShaped('boost/configs', ConfigPayloadRT, handleConfigsReceived);
  useChannelShaped(
    'boost/recommended_sp',
    RecommendedSPRT,
    handleDistOffsetReceived,
  );

  const handleReset = () => {
    setOffset(0);
    toast.success('Calibration Reset!');
    resetCalibration();
  };

  return (
    <ContentPage title="Boost Configuration">
      <BoostCalibration
        onSet={setCalibration}
        onReset={handleReset}
        distTravelled={dist}
        calibrationDiff={distOffset}
      />
      <BoostConfigurator
        configs={configs}
        onSelectConfig={onSelectConfig}
        onDeleteConfig={onDeleteConfig}
        onUploadConfig={uploadConfig}
      />
    </ContentPage>
  );
}
