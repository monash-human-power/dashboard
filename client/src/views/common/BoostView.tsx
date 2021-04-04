import React, { useState, useCallback } from 'react';
import ContentPage from 'components/common/ContentPage';
import BoostCalibration from 'components/common/boost/BoostCalibration';
import BoostConfigurator from 'components/common/boost/BoostConfigurator';
import { setCalibration, resetCalibration } from 'api/common/powerModel';
import uploadConfig, { deleteConfig } from 'api/v3/boost';
import {
  ConfigT,
  BoostConfig,
  ConfigPayloadRT,
  RecommendedSPRT,
} from 'types/boost';
import { useSensorData, Sensor } from 'api/common/data';
import { Static } from 'runtypes';
import { useChannelShaped } from 'api/common/socket';
import toast from 'react-hot-toast';
import { ReedDistanceRT } from 'types/data';

// TODO: Implement actual functions for `onSelectConfig` and `onDeleteConfig`

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
 * Boost View component
 *
 * @returns {React.Component} Component
 */
export default function BoostView() {
  const [distOffset, setDistOffset] = useState<number | null>(null);
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
  const reedDistance =
    useSensorData(3, Sensor.ReedDistance, ReedDistanceRT) ?? 0;

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
      setDistOffset(payload.distanceOffset);
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
    setDistOffset(0);
    resetCalibration();
    toast.success('Calibration Reset!');
  };

  return (
    <ContentPage title="Boost Configuration">
      <BoostCalibration
        onSet={setCalibration}
        onReset={handleReset}
        distTravelled={reedDistance}
        calibrationDiff={distOffset}
      />
      <BoostConfigurator
        configs={configs}
        onSelectConfig={onSelectConfig}
        onDeleteConfig={deleteConfig}
        onUploadConfig={uploadConfig}
      />
    </ContentPage>
  );
}
