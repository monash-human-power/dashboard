import React, { useState, useCallback } from 'react';
import ContentPage from 'components/common/ContentPage';
import BoostCalibration from 'components/common/boost/BoostCalibration';
import BoostConfigurator from 'components/common/boost/BoostConfigurator';
import { setCalibration, resetCalibration } from 'api/common/powerModel';
import uploadConfig, { deleteConfig, sendConfigSelections } from 'api/v3/boost';
import {
  ConfigT,
  BoostConfig,
  ConfigPayloadRT,
  RecommendedSPRT,
  ConfigNameT,
} from 'types/boost';
import { useSensorData, Sensor } from 'api/common/data';
import { Static } from 'runtypes';
import { useChannelShaped, useChannel } from 'api/common/socket';
import toast from 'react-hot-toast';
import { ReedDistanceRT } from 'types/data';

/**
 * Boost View component
 *
 * @returns {React.Component} Component
 */
export default function BoostView() {
  const [distOffset, setDistOffset] = useState<number | null>(null);
  const [numConfigsSelected, setConfigsSelected] = useState(0);

  // Keeps track of whether a power plan is being generated or not
  const [powerPlanGenerating, setPowerPlanGenerating] = useState(false);
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

  const handlePPGenerationComplete = () => {
    if (powerPlanGenerating) {
      setPowerPlanGenerating(false);
      toast.dismiss();
      toast.success('Power Plan Generated!');
    }
  };

  useChannel('boost/generate_complete', handlePPGenerationComplete);

  const handleReset = () => {
    setDistOffset(0);
    resetCalibration();
    toast.success('Calibration Reset!');
  };

  const handleSelect = (configType: ConfigT, configName: ConfigNameT) => {
    setConfigs(
      configs.map((config) => {
        if (config.type === configType) {
          if (!config.active) {
            setConfigsSelected(numConfigsSelected + 1);
          }
          return { ...config, active: configName };
        }
        return config;
      }),
    );
    if (numConfigsSelected >= 3) {
      // All config types selected, ready to generate power plan!
      sendConfigSelections(configs, configType, configName);
      setPowerPlanGenerating(true);
      toast.loading('Generating power plan...');
    }
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
        onSelectConfig={handleSelect}
        onDeleteConfig={deleteConfig}
        onUploadConfig={uploadConfig}
      />
    </ContentPage>
  );
}
