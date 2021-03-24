import { emit } from 'api/common/socket';
import {
  FileConfigT,
  ConfigObjRT,
  ConfigT,
  fileConfigTypeToRuntype,
} from 'types/boost';
import { addSuffix } from 'utils/boost';
import toast from 'react-hot-toast';
import { Static } from 'runtypes';

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
 * @param dispErr function to display error if uploaded config is not correct
 */
export default function uploadConfig(
  type: FileConfigT,
  configFile: File,
  dispErr: (msg: string) => void,
) {
  const reader = new FileReader();

  // Called when FileReader has completed reading a file
  reader.onload = () => {
    const fileContent = reader.result as string;
    const configContent = JSON.parse(fileContent);

    if (type === 'bundle') {
      // Check that all 4 configs are included in the bundle
      if (Object.entries(configContent).length !== 4) {
        dispErr(
          `${configFile.name} should have exactly 4 configs (one each for rider, track, bike and power plan)`,
        );
      } else {
        let error = false;
        Object.entries(configContent).forEach((configEntry) => {
          console.log(configEntry);
          const configType = configEntry[0] as ConfigT;
          console.log(configType);
          try {
            const config = ConfigObjRT.check(configEntry[1]);

            // Since this config was uploaded as a bundle give it a different file name by adding a suffix, to differentiate it's config type
            const file = addSuffix(configFile.name, configType);

            sendConfig('upload', configType, file, config);
          } catch (err) {
            dispErr(
              `${configFile.name} is not of the correct form for a config bundle`,
            );
            error = true;
          }
        });
        if (!error) toast.success(`Uploaded configs in ${configFile.name}`);
      }
    } else {
      try {
        // Single config uploaded
        fileConfigTypeToRuntype[type].check(configContent);
        sendConfig('upload', type, configFile.name, configContent);
        toast.success(`Uploaded ${configFile.name}!`);
      } catch (err) {
        dispErr(
          `${configFile.name} is not of the correct form for ${type} config`,
        );
      }
    }
  };

  reader.readAsText(configFile);
}
