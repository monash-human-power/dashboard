import { emit } from 'api/common/socket';
import {
  FileConfigT,
  ConfigBundleT,
  ConfigObjT,
  ConfigT,
  fileConfigTypeToRuntype,
} from 'types/boost';
import toast from 'react-hot-toast';
import { Runtype, Static } from 'runtypes';

type payloadAction = 'upload' | 'delete';

/**
 * Send configuration status over MQTT on topic 'boost/configs/action'
 *
 * @param actionType represents whether the config is being uploaded or deleted
 * @param type the type of the configuration being sent
 * @param name name of the config file
 * @param configContent configuration content
 */
function sendConfig(
  actionType: payloadAction,
  type: ConfigT,
  name: string,
  configContent: Static<typeof ConfigObjT> | null,
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

const configTypeToFileSuffix: { [K in ConfigT]: string } = {
  rider: '_rider.json',
  bike: '_bike.json',
  track: '_track.json',
  powerPlan: '_powerPlan.json',
};

/**
 * Split the given configurations object into individual configs and then send them over MQTT
 *
 * @param configs dictionary containing the 4 config types (`powerPlan`, `rider`, `track` and `bike`)
 * @param fileName name of the file that contained all the configs
 */
function uploadMultipleConfigs(configs: ConfigBundleT, fileName: string) {
  // For each config, send the config content over MQTT
  Object.entries(configs).forEach((configEntry) => {
    const configType = configEntry[0] as ConfigT;
    const config = ConfigObjT.check(configEntry[1]);

    // Since this config was uploaded as a bundle give it a different file name to differentiate it's config type.
    const file = fileName.replace('.json', configTypeToFileSuffix[configType]);

    sendConfig('upload', configType, file, config);
  });
}

/**
 * Read content from the given file and send it on `boost/configs/action` over MQTT.
 * If the content contains more than one config (i.e. `type` is 'all'), the content is
 * split into the different configurations before sending.
 *
 * @param type the type of the configuration
 * @param configFile file containing content of the configuration
 * @param displayErr function to display error if uploaded config is not correct
 */
export default function uploadConfig(
  type: FileConfigT,
  configFile: File,
  displayErr: (message: string) => void,
) {
  const reader = new FileReader();

  // Called when FileReader has completed reading a file
  reader.onload = () => {
    const fileContent = reader.result as string;
    const configContent = JSON.parse(fileContent);

    // Checks that the given content is of the type given
    const isCorrectContentType = (content: any, typeRequired: Runtype) => {
      try {
        typeRequired.check(content);
        return true;
      } catch (error) {
        return false;
      }
    };

    if (!isCorrectContentType(configContent, fileConfigTypeToRuntype[type])) {
      displayErr(
        `${configFile.name} is not of the correct type for ${type} config`,
      );
    } else if (type === 'bundle') {
      uploadMultipleConfigs(configContent, configFile.name);
      toast.success(`Uploaded configs in ${configFile.name}`);
    } else {
      // Single config uploaded
      sendConfig('upload', type, configFile.name, configContent);
      toast.success(`Uploaded ${configFile.name}!`);
    }
  };

  reader.readAsText(configFile);
}
