import { emit } from 'api/common/socket';
import {
  FileConfigT,
  ConfigObjRT,
  ConfigT,
  SelectedConfigsT,
  BoostConfig,
  ConfigNameT,
} from 'types/boost';
import { addSuffix } from 'utils/boost';
import toast from 'react-hot-toast';
import { Runtype, Static } from 'runtypes';

type payloadActionT = 'upload' | 'delete';

/**
 * Send configuration status over MQTT on topic 'boost/configs/action'
 *
 * @param actionType represents whether the config is being uploaded or deleted
 * @param type the type of the configuration being sent
 * @param name name of the config file
 * @param configContent configuration content
 */
function sendConfig(
  actionType: payloadActionT,
  type: ConfigT,
  name: string,
  configContent: Static<typeof ConfigObjRT> | null,
) {
  const channel = 'send-config';
  const payload = {
    action: actionType,
    configType: type,
    fileName: name,
    content: configContent,
  };
  // To check things work without needing the server started
  console.log(payload);
  emit(channel, JSON.stringify(payload));
}

/**
 * Read content from the given file and send it on `boost/configs/action` over MQTT.
 * If the content contains more than one config (i.e. `type` is 'all'), the content is
 * split into the different configurations before sending.
 *
 * @param type the type of the configuration
 * @param configFile file containing content of the configuration
 * @param shape the expected Runtype of the uploaded file
 * @param dispErr function to display error if uploaded config is not correct
 */
export default function uploadConfig(
  type: FileConfigT,
  configFile: File,
  shape: Runtype,
  dispErr: (msg: string) => void,
) {
  const reader = new FileReader();

  // Called when FileReader has completed reading a file
  reader.onload = () => {
    const fileContent = reader.result as string;
    const configContent = JSON.parse(fileContent);

    try {
      if (type === 'bundle' && shape.check(configContent)) {
        Object.entries(configContent).forEach((configEntry) => {
          const configType = configEntry[0] as ConfigT;

          // Since this config was uploaded as a bundle give it a different file name by adding a suffix, to differentiate it's config type
          const file = addSuffix(configFile.name, configType);

          sendConfig('upload', configType, file, configContent);
        });
        toast.success(`Uploaded configs in ${configFile.name}`);
      } else if (type !== 'bundle' && shape.check(configContent)) {
        // Single config uploaded
        sendConfig('upload', type, configFile.name, configContent);
        toast.success(`Uploaded ${configFile.name}!`);
      }
    } catch (err) {
      dispErr(
        `${configFile.name} is not of the correct type for a ${type} config`,
      );
    }
  };

  reader.readAsText(configFile);
}

/**
 * Inform boost of the deletion of the given config file
 *
 * @param configType the type of the config
 * @param configName object containing displayName and fileName of the config
 */
export function deleteConfig(configType: ConfigT, configName: ConfigNameT) {
  // FIXME: Should dashboard remove the config file from `configs`?
  console.log(`Delete ${configName.displayName} ${configType} config`);
  sendConfig('delete', configType, configName.displayName, null);
  toast.success(`${configName.displayName} deleted`);
}

/**
 * Send the selected configs to `boost`
 *
 * @param configs contains all actively selected configs
 * @param configTypeSelected the config type of the new config file selected
 * @param configNameSelected object containing displayName and fileName of the new config selected
 */
export function sendConfigSelections(
  configs: BoostConfig[],
  configTypeSelected: ConfigT,
  configNameSelected: ConfigNameT,
) {
  const payload: SelectedConfigsT = {
    rider: '',
    bike: '',
    track: '',
    powerPlan: '',
  };

  // Populate payload with the currently active config for each config type
  configs.forEach((config) => {
    if (config.type === configTypeSelected) {
      payload[configTypeSelected] = configNameSelected.displayName;
    } else {
      payload[config.type] = config.active?.displayName;
    }
  });
  emit('submit-selected-configs', JSON.stringify(payload));
}
