import React, { useState, useCallback, useEffect } from 'react';
import ContentPage from 'components/common/ContentPage';
import BoostCalibration from 'components/common/boost/BoostCalibration';
import BoostConfigurator from 'components/common/boost/BoostConfigurator';
import { setCalibration, resetCalibration } from 'api/common/powerModel';
import uploadConfig, { sendConfig } from 'api/v3/boost';
import {
  ConfigT,
  BoostConfig,
  ConfigPayloadRT,
  RecommendedSPRT,
  ConfigNameT,
} from 'types/boost';
import { useSensorData, Sensor } from 'api/common/data';
import { Static } from 'runtypes';
import { useChannelShaped, emit } from 'api/common/socket';
import toast from 'react-hot-toast';
import { AntDistanceRT } from 'types/data';
import CrashModal from 'components/v3/CrashModal';

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

  // fetch the ant+ distance from wireless module #4
  const antDistance = useSensorData(4, Sensor.AntDistance, AntDistanceRT) ?? 0;

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

  // Ask server for boost configs when page reloads
  useEffect(() => {
    emit('get-boost-configs', 'boost/configs');
    emit('get-boost-results', 'boost/generate_complete');
  }, []);

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

  const handleSelect = (configType: ConfigT, configName: ConfigNameT) => {
    // Update the active field of the selected config in `configs`
    setConfigs(
      configs.map((config) => {
        if (config.type === configType) {
          return { ...config, active: configName };
        }
        return config;
      }),
    );
  };

  const handleDelete = (configType: ConfigT, configName: ConfigNameT) => {
    // Inform `boost`
    sendConfig('delete', configType, configName.fileName, null);

    // Update `dashboard`
    setConfigs(
      configs.map((config) => {
        if (config.type === configType) {
          // Remove the deleted config from the available options
          const newOptions = config.options.filter(
            (value) => value !== configName,
          );

          // If the deleted config was currently selected, remove the selection
          if (
            config.active?.displayName === configName.displayName &&
            config.active?.fileName === configName.fileName
          ) {
            return { ...config, options: newOptions, active: undefined };
          }
          return { ...config, options: newOptions };
        }
        return config;
      }),
    );
  };

  return (
    <ContentPage title="Boost Configuration">
      <CrashModal />

      <BoostCalibration
        onSet={setCalibration}
        onReset={handleReset}
        distTravelled={antDistance}
        calibrationDiff={distOffset}
      />
      <BoostConfigurator
        configs={configs}
        onSelectConfig={handleSelect}
        onDeleteConfig={handleDelete}
        onUploadConfig={uploadConfig}
      />
    </ContentPage>
  );
}
